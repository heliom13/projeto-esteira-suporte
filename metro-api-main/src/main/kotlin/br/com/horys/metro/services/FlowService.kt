package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.process.FlowBatchRequest
import br.com.horys.metro.controllers.requests.process.FlowRequest
import br.com.horys.metro.controllers.response.FlowResponse
import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.exceptions.FlowNotFoundException
import br.com.horys.metro.models.Flow
import br.com.horys.metro.models.Flow.StatusFlow.ACTIVE
import br.com.horys.metro.models.FlowStep
import br.com.horys.metro.models.FlowType
import br.com.horys.metro.models.Step
import br.com.horys.metro.repositories.FlowRepository
import br.com.horys.metro.repositories.FlowStepRepository
import br.com.horys.metro.repositories.FlowTypeRepository
import br.com.horys.metro.repositories.StepRepository
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root

@Service
class FlowService(
    private val repository: FlowRepository,
    private val stepRepository: StepRepository,
    private val flowStepRepository: FlowStepRepository,
    private val flowTypeRepository: FlowTypeRepository
) {
    fun save(request: FlowRequest): FlowResponse {
        val typeFlow =
            flowTypeRepository.findById(request.typeFlowId).orElseThrow { BusinessException("Tipo de fluxo inválido") }

        val steps = validateSteps(request)

        return saveFlow(request, typeFlow, steps)
    }

    fun findById(id: Long): FlowResponse {
        val flow = repository.findById(id).orElseThrow { FlowNotFoundException() }
        val flowSteps = flowStepRepository.findByFlowOrderedSteps(flow.id!!)
        return buildFlowResponse(
            flow, flowSteps
        )
    }

    fun getById(id: Long): Flow {
        return repository.findById(id).orElseThrow { FlowNotFoundException() }
    }

    @Transactional
    fun update(id: Long, request: FlowRequest): FlowResponse {
        val steps = validateSteps(request)
        val flow = repository.findById(id).orElseThrow { FlowNotFoundException() }

        val flowSteps = flowStepRepository.findByFlowOrderedSteps(id)
        val stepsToInactive = flowSteps.map {
            it.copy(
                status = FlowStep.Status.INACTIVE,
                updatedAt = LocalDateTime.now()
            )
        }.toList()
        flowStepRepository.saveAll(stepsToInactive)

        repository.save(
            flow.copy(
                description = request.description,
                sendMessage = request.sendMessage,
                updatedAt = LocalDateTime.now()
            )
        )

        val flowStepsSaved = saveFlowSteps(steps, request, flow)

        return buildFlowResponse(
            flow = flow,
            flowSteps = flowStepsSaved
        )
    }

    private fun buildFlowResponse(
        flow: Flow,
        flowSteps: List<FlowStep>
    ): FlowResponse {
        val flowResponse = FlowResponse(
            id = flow.id!!,
            description = flow.description,
            sendMessage = flow.sendMessage,
            typeFlow = flow.type,
            steps = flowSteps.map {
                FlowResponse.Step(
                    id = it.step.id!!,
                    order = it.orderStep,
                    description = it.step.description,
                    deadline = it.step.deadline,
                    requiredDocument = it.step.requiredDocument

                )
            }.toList()
        )
        return flowResponse
    }

    private fun validateSteps(request: FlowRequest): MutableList<Step> {
        val repeatedItems = request.steps.map { it.order }.toSet().size
        if (repeatedItems != request.steps.map { it.order }.toList().size) {
            throw BusinessException("Há passos com ordenação iguais")
        }
        val stepsIds = request.steps.map { it.stepId }.toList()
        val steps = stepRepository.findAllById(stepsIds)
        if (steps.size != request.steps.size) {
            throw BusinessException("Passos inválidos")
        }
        return steps
    }

    private fun saveFlow(
        request: FlowRequest,
        flowType: FlowType,
        steps: MutableList<Step>
    ): FlowResponse {
        val flow = repository.save(
            Flow(
                id = null,
                description = request.description,
                status = ACTIVE,
                type = flowType,
                sendMessage = request.sendMessage,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        )

        val flowSteps = saveFlowSteps(steps, request, flow)

        return buildFlowResponse(flow, flowSteps)
    }

    private fun saveFlowSteps(
        steps: MutableList<Step>,
        request: FlowRequest,
        flow: Flow
    ): List<FlowStep> {
        val flowSteps = steps.map {
            FlowStep(
                id = null,
                step = it,
                orderStep = request.steps.find { stepFilter -> stepFilter.stepId == it.id }!!.order,
                flow = flow,
                status = FlowStep.Status.ACTIVE,
                deadline = it.deadline,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        }.toList()

        flowStepRepository.saveAll(flowSteps)
        return flowSteps
    }

    @Transactional
    fun saveBatch(request: FlowBatchRequest): FlowResponse {
        val typeFlow = flowTypeRepository.findById(request.typeFlowId)
            .orElseThrow { BusinessException("Tipo de fluxo inválido") }

        val savedSteps = stepRepository.saveAll(
            request.steps.map { description ->
                Step(
                    id = null,
                    description = description,
                    deadline = 1,
                    requiredDocument = false,
                    status = Step.Status.NORMAL,
                    createdAt = LocalDateTime.now(),
                    updatedAt = LocalDateTime.now()
                )
            }
        )

        val flow = repository.save(
            Flow(
                id = null,
                description = request.description,
                status = ACTIVE,
                type = typeFlow,
                sendMessage = request.sendMessage,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        )

        val flowSteps = flowStepRepository.saveAll(
            savedSteps.mapIndexed { index, step ->
                FlowStep(
                    id = null,
                    step = step,
                    orderStep = (index + 1).toDouble(),
                    flow = flow,
                    status = FlowStep.Status.ACTIVE,
                    deadline = step.deadline,
                    createdAt = LocalDateTime.now(),
                    updatedAt = LocalDateTime.now()
                )
            }
        )

        return buildFlowResponse(flow, flowSteps)
    }

    @Transactional
    fun updateBatch(id: Long, request: FlowBatchRequest): FlowResponse {
        val flow = repository.findById(id).orElseThrow { FlowNotFoundException() }

        val existingSteps = flowStepRepository.findByFlowOrderedSteps(id)
        flowStepRepository.saveAll(existingSteps.map {
            it.copy(status = FlowStep.Status.INACTIVE, updatedAt = LocalDateTime.now())
        })

        val updatedFlow = repository.save(flow.copy(
            description = request.description,
            updatedAt = LocalDateTime.now()
        ))

        val savedSteps = stepRepository.saveAll(
            request.steps.map { description ->
                Step(
                    id = null,
                    description = description,
                    deadline = 1,
                    requiredDocument = false,
                    status = Step.Status.NORMAL,
                    createdAt = LocalDateTime.now(),
                    updatedAt = LocalDateTime.now()
                )
            }
        )

        val flowSteps = flowStepRepository.saveAll(
            savedSteps.mapIndexed { index, step ->
                FlowStep(
                    id = null,
                    step = step,
                    orderStep = (index + 1).toDouble(),
                    flow = updatedFlow,
                    status = FlowStep.Status.ACTIVE,
                    deadline = step.deadline,
                    createdAt = LocalDateTime.now(),
                    updatedAt = LocalDateTime.now()
                )
            }
        )

        return buildFlowResponse(updatedFlow, flowSteps)
    }

    fun findAll(description: String?): List<Flow> {
        val spec: Specification<Flow> =
            Specification { root: Root<Flow>, query: CriteriaQuery<*>, criteriaBuilder: CriteriaBuilder ->
                val predicates: MutableList<Predicate> = ArrayList()

                if (description != null) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("description"), "%$description%"
                        )
                    )
                }
                predicates.add(criteriaBuilder.equal(root.get<Boolean>("status"), Flow.StatusFlow.ACTIVE))

                query.orderBy(criteriaBuilder.asc(root.get<String>("description")))
                criteriaBuilder.and(*predicates.toTypedArray())
            }

        return repository.findAll(spec)
    }

    fun getSteps(id: Long): List<FlowStep> {
        return flowStepRepository.findByFlowOrderedSteps(id)
    }
}
