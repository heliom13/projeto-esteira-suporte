package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.process.ChangeUsersRequest
import br.com.horys.metro.controllers.requests.process.CommentRequest
import br.com.horys.metro.controllers.requests.process.NextStepRequest
import br.com.horys.metro.controllers.requests.process.ProcessRequest
import br.com.horys.metro.controllers.requests.process.StepUnforeseenRequest
import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.exceptions.ProcessNotFoundException
import br.com.horys.metro.models.Comment
import br.com.horys.metro.models.Flow
import br.com.horys.metro.models.FlowStep
import br.com.horys.metro.models.Notification
import br.com.horys.metro.models.Process
import br.com.horys.metro.models.Process.Status.ACTIVE
import br.com.horys.metro.models.ProcessStep
import br.com.horys.metro.models.Proposal
import br.com.horys.metro.models.Step
import br.com.horys.metro.models.User
import br.com.horys.metro.repositories.CommentRepository
import br.com.horys.metro.repositories.FlowStepRepository
import br.com.horys.metro.repositories.NotificationRepository
import br.com.horys.metro.repositories.ProcessRepository
import br.com.horys.metro.repositories.ProcessStepRepository
import br.com.horys.metro.repositories.StepRepository
import br.com.horys.metro.repositories.UserRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.UUID
import java.util.regex.Pattern
import kotlin.coroutines.CoroutineContext

@Service
class ProcessService(
    private val flowService: FlowService,
    private val flowStepRepository: FlowStepRepository,
    private val processRepository: ProcessRepository,
    private val processStepRepository: ProcessStepRepository,
    private val propertyService: PropertyService,
    private val stepRepository: StepRepository,
    private val processMessageService: ProcessMessageService,
    private val sellerService: SellerService,
    private val searchClientService: SearchClientService,
    private val userService: UserService,
    private val notificationRepository: NotificationRepository,
    private val commentRepository: CommentRepository,
    private val userRepository: UserRepository
) : CoroutineScope {

    private val job = Job()
    override val coroutineContext: CoroutineContext
        get() = Dispatchers.IO + job

    fun destroy() {
        job.cancel() // Cancela todas as coroutines quando o serviço for destruído
    }

    @Transactional
    fun save(request: ProcessRequest, proposal: Proposal): Process {
        val (flow, steps) = getValidFlow(request)
        val user = userService.getLoggedInUser()

        val property = request.propertyId?.let { propertyService.findById(it) }
        val client = request.clientId?.let { searchClientService.findById(it) }
        val sellerMain = sellerService.findOptionalSeller(request.sellerMainId)
        val sellerSecondary = sellerService.findOptionalSeller(request.sellerSecondaryId)

        val process = processRepository.save(
            Process(
                id = null,
                client = client,
                flow = flow,
                stepCurrent = steps.first().step,
                orderCurrent = 1.0,
                status = ACTIVE,
                property = property,
                linkDrive = request.linkDrive,
                reasonCancel = null,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                externalId = UUID.randomUUID().toString(),
                sellerMain = sellerMain,
                sellerSecondary = sellerSecondary,
                totalDays = steps.sumOf { it.deadline },
                totalSteps = steps.size,
                user = user,
                processStepCurrent = null,
                proposal = proposal
            )
        )

        steps.map {
            ProcessStep(
                id = null,
                process = process,
                step = it.step,
                orderStep = it.orderStep,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                reasonUnforeseen = null,
                status = ProcessStep.Status.UNCOMPLETED
            )
        }.toList().also {
            processStepRepository.saveAll(it)
            processRepository.save(process.copy(processStepCurrent = it.first()))
            notificationRepository.save(
                Notification(
                    id = null,
                    process = process,
                    userOrigin = user,
                    userDestiny = user,
                    createdAt = LocalDateTime.now(),
                    updatedAt = LocalDateTime.now(),
                    type = Notification.Type.PROCESS_CREATED,
                    destiny = Notification.Destiny.HISTORY,
                    stepCurrent = it.first().step.description,
                    read = false,
                    description = "Processo de ${flow.type.description} criado",
                )
            )
        }


        launch {
            if (flow.sendMessage) {
                processMessageService.sendNewProcess(process)
            }
        }



        return process
    }

    private fun getValidFlow(request: ProcessRequest): Pair<Flow, List<FlowStep>> {
        val flow = flowService.getById(request.flowId)
        val steps = flowStepRepository.findByFlowOrderedSteps(flow.id!!)
        if (steps.isEmpty()) {
            throw BusinessException("Fluxo sem etapas")
        }
        return Pair(flow, steps)
    }

    @Transactional
    fun nextStep(saleId: Long, request: NextStepRequest): Process {
        val sale = processRepository.findById(saleId).orElseThrow { ProcessNotFoundException() }
        if (sale.status == Process.Status.SOLD) {
            throw BusinessException(
                "Venda já finalizada"
            )
        }
        val stepCurrent = sale.stepCurrent

        val now = LocalDateTime.now()

        val diffDays = ChronoUnit.DAYS.between(now, sale.updatedAt)

        if (diffDays > stepCurrent.deadline) {
            if (request.reasonDelay.isNullOrBlank()) {
                throw BusinessException("Informe o motivo do atraso")
            }
        }

        completeStepCurrent(saleId, stepCurrent)

        val processStep = processStepRepository.findTopByProcessAndOrderStepGreaterThan(sale, sale.orderCurrent)

        processStep?.let {

            return processRepository.save(
                sale.copy(
                    stepCurrent = processStep.step,
                    processStepCurrent = processStep,
                    orderCurrent = processStep.orderStep,
                    updatedAt = LocalDateTime.now()
                )
            )
                .also {
                    processStepRepository.save(processStep)
                    processMessageService.sendNextStepSale(processStep, request.observation)
                    isFinish(it, processStep)
                }
        }

        processMessageService.sendFinishSale(sale)

        notificationRepository.save(
            Notification(
                id = null,
                process = sale,
                userOrigin = sale.user,
                userDestiny = sale.user,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                type = Notification.Type.PROCESS_FINISHED,
                read = false,
                destiny = Notification.Destiny.HISTORY,
                stepCurrent = stepCurrent.description,
                description = "Processo finalizado com sucesso",
            )
        )

        return processRepository.save(
            sale.copy(
                status = Process.Status.SOLD,
                updatedAt = LocalDateTime.now(),
            )
        )
    }

    fun findById(id: Long): Process {
        return processRepository.findById(id).orElseThrow { ProcessNotFoundException() }
    }

    private fun completeStepCurrent(saleId: Long, stepCurrent: Step) {
        processStepRepository.findTopByProcess_IdAndStep_Id(saleId, stepCurrent.id!!)?.let {

            val processStep = processStepRepository.save(it.copy(status = ProcessStep.Status.COMPLETED))
            notificationRepository.save(
                Notification(
                    id = null,
                    process = processStep.process,
                    userOrigin = processStep.process.user,
                    userDestiny = processStep.process.user,
                    createdAt = LocalDateTime.now(),
                    updatedAt = LocalDateTime.now(),
                    type = Notification.Type.PROCESS_STEP_COMPLETED,
                    stepCurrent = stepCurrent.description,
                    read = false,
                    destiny = Notification.Destiny.HISTORY,
                    description = "Etapa ${processStep.step.description} concluída",
                )
            )
        }
    }

    private fun isFinish(process: Process, processStep: ProcessStep) {
        val currentFlowStep =
            processStepRepository.findTopByProcessAndOrderStepGreaterThan(process, processStep.orderStep)
        if (currentFlowStep == null) {
            completeStepCurrent(process.id!!, process.stepCurrent)
            processMessageService.sendFinishSale(process)
            processRepository.save(process.copy(status = Process.Status.SOLD, updatedAt = LocalDateTime.now()))
        }
    }

    @Transactional
    fun createUnforeseen(saleId: Long, request: StepUnforeseenRequest) {
        val sale = processRepository.findById(saleId).orElseThrow { ProcessNotFoundException() }
        val stepOrder = sale.orderCurrent + 0.1
        val stepUnforeseen = stepRepository.findByStatus(Step.Status.UNFORESEEN)
            .orElseThrow { BusinessException("Step UNFORESEEN not found") }

        notificationRepository.save(
            Notification(
                id = null,
                process = sale,
                userOrigin = sale.user,
                userDestiny = sale.user,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                type = Notification.Type.PROCESS_UPDATED,
                read = false,
                stepCurrent = sale.stepCurrent.description,
                destiny = Notification.Destiny.HISTORY,
                description = "Processo atualizado com um imprevisto",
            )
        )

        processStepRepository.save(
            ProcessStep(
                id = null,
                process = sale,
                step = stepUnforeseen,
                orderStep = stepOrder,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                reasonUnforeseen = request.reason,
                status = ProcessStep.Status.UNCOMPLETED
            )
        ).also {
            processMessageService.sendNextStepUnforeseenSale(it)
            processRepository.save(
                sale.copy(
                    stepCurrent = it.step,
                    processStepCurrent = it,
                    orderCurrent = stepOrder,
                    updatedAt = LocalDateTime.now()
                )
            )
        }

    }

    fun delete(id: Long) {
        val sale = processRepository.findById(id).orElseThrow { ProcessNotFoundException() }
        processRepository.save(sale.copy(status = Process.Status.CANCELLED, updatedAt = LocalDateTime.now()))
    }

    @Transactional
    fun changeUsers(id: Long, request: ChangeUsersRequest) {
        val process = processRepository.findById(id).orElseThrow { ProcessNotFoundException() }
        val user = userService.findById(request.userDestiny)

        notificationRepository.save(
            Notification(
                id = null,
                process = process,
                userOrigin = process.user,
                userDestiny = user,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                type = Notification.Type.PROCESS_CHANGED_USER,
                read = false,
                stepCurrent = process.stepCurrent.description,
                destiny = Notification.Destiny.NOTIFICATION_AND_HISTORY,
                description = "Processo alterado de usuário: ${process.user.name} para ${user.name}",
            )
        )

//        notificationRepository.save(
//            Notification(
//                id = null,
//                process = process,
//                userOrigin = process.user,
//                userDestiny = user,
//                createdAt = LocalDateTime.now(),
//                updatedAt = LocalDateTime.now(),
//                type = Notification.Type.PROCESS_CHANGED_USER,
//                read = false,
//                stepCurrent = process.stepCurrent.description,
//                destiny = Notification.Destiny.HISTORY,
//                description = "Processo alterado de usuário: ${process.user.name} para ${user.name}",
//            )
//        )

        processRepository.save(process.copy(user = user, updatedAt = LocalDateTime.now()))
    }

    @Transactional
    fun addComment(processId: Long, request: CommentRequest) {
        val process = processRepository.findById(processId).orElseThrow { ProcessNotFoundException() }
        val currentUser = userService.getLoggedInUser()
        val comment = Comment(
            process = process,
            user = currentUser,
            content = request.content
        )
        commentRepository.save(comment)

        val mentionedUsers = extractMentionedUsers(request.content)

        notificationRepository.save(
            Notification(
                id = null,
                process = process,
                userOrigin = currentUser,
                userDestiny = currentUser,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                type = Notification.Type.COMMENT_ADDED,
                read = false,
                stepCurrent = process.stepCurrent.description,
                destiny = Notification.Destiny.HISTORY,
                description = "Novo comentário adicionado ao processo: ${request.content}"
            )
        )

        val notifications = mentionedUsers.map { user ->
            Notification(
                id = null,
                process = process,
                userOrigin = currentUser,
                userDestiny = user,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                type = Notification.Type.COMMENT_ADDED,
                read = false,
                stepCurrent = process.stepCurrent.description,
                destiny = Notification.Destiny.NOTIFICATION,
                description = "Novo comentário adicionado ao processo: ${request.content}"
            )
        }
        notificationRepository.saveAll(notifications)
    }

    private fun extractMentionedUsers(content: String): List<User> {
        val pattern = Pattern.compile("@([\\w.]+)")
        val matcher = pattern.matcher(content)
        val usernames = mutableListOf<String>()
        while (matcher.find()) {
            usernames.add(matcher.group(1))
        }
        return userRepository.findByUsernameIn(usernames)
    }
}