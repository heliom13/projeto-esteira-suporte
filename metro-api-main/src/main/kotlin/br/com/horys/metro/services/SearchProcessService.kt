package br.com.horys.metro.services

import br.com.horys.metro.controllers.response.CommentResponse
import br.com.horys.metro.controllers.response.ProcessResponse
import br.com.horys.metro.exceptions.ProcessNotFoundException
import br.com.horys.metro.models.Client
import br.com.horys.metro.models.Comment
import br.com.horys.metro.models.CommentReply
import br.com.horys.metro.models.Notification
import br.com.horys.metro.models.Notification.Destiny.HISTORY
import br.com.horys.metro.models.Process
import br.com.horys.metro.models.ProcessStep
import br.com.horys.metro.models.User
import br.com.horys.metro.repositories.CommentReplyRepository
import br.com.horys.metro.repositories.CommentRepository
import br.com.horys.metro.repositories.NotificationRepository
import br.com.horys.metro.repositories.ProcessRepository
import br.com.horys.metro.repositories.ProcessStepRepository
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root


@Service
class SearchProcessService(
    private val processRepository: ProcessRepository,
    private val searchClientService: SearchClientService,
    private val processStepRepository: ProcessStepRepository,
    private val searchPropertyService: SearchPropertyService,
    private val sellerService: SellerService,
    private val userService: UserService,
    private val notificationRepository: NotificationRepository,
    private val commentRepository: CommentRepository,
    private val commentReplyRepository: CommentReplyRepository
) {


    fun findAll(name: String?, user: User): MutableList<Process> {
        val spec: Specification<Process> =
            Specification { root: Root<Process>, query: CriteriaQuery<*>, criteriaBuilder: CriteriaBuilder ->
                val client = root.join<Process, Client>("client")
                val predicates: MutableList<Predicate> = ArrayList()

                if (!name.isNullOrBlank()) {
                    predicates.add(
                        criteriaBuilder.like(
                            client.get("name"), "%$name%"
                        )
                    )
                }

                if (user.role == User.Role.SECRETARY) {
                    predicates.add(criteriaBuilder.equal(root.get<User>("user"), user))
                }

                predicates.add(criteriaBuilder.equal(root.get<Boolean>("status"), Process.Status.ACTIVE))

                query.orderBy(criteriaBuilder.desc(root.get<Long>("id")))

                criteriaBuilder.and(*predicates.toTypedArray())
            }


        return processRepository.findAll(spec)
    }

    fun getSteps(id: Long): List<HashMap<String, String>> {

        return processStepRepository.findFlowSteps(id).map {
            hashMapOf(
                "orderStep" to it.orderStep.toString(),
                "statusStep" to it.step.status.toString(),
                "deadline" to it.step.deadline.toString(),
                "flow" to it.process.flow.description,
                "step" to it.getDescriptionStep()
            )
        }.toList()
    }

    fun findById(id: Long): Process {
        return processRepository.findById(id).orElseThrow { ProcessNotFoundException() }
    }

    fun getProcessById(id: Long): ProcessResponse {
        val currentUser = userService.getLoggedInUser()
        val process = processRepository.findById(id).orElseThrow { ProcessNotFoundException() }
        val isUserProcessOwner = process.user.id == currentUser.id
        val destinies = listOf(HISTORY, Notification.Destiny.NOTIFICATION_AND_HISTORY)
        val notifications = notificationRepository.findByProcessIdOrderByCreatedAtDesc(process.id!!, destinies)
        val comments = commentRepository.findByProcessIdOrderByCreatedAtDesc(process.id)
        val commentResponses = comments.map { comment ->
            val replies = commentReplyRepository.findByCommentIdOrderByIdDesc(comment.id!!)
            CommentResponse.fromModel(comment, replies)
        }
        return ProcessResponse.fromModel(
            process, isUserProcessOwner, notifications, commentResponses
        )
    }

    fun findByExternalId(externalId: String): Process {
        return processRepository.findByExternalId(externalId) ?: throw ProcessNotFoundException()
    }

    fun findByClientExternalId(externalId: String): List<Process> {
        val client = searchClientService.findByExternalId(externalId)
        return processRepository.findByClient_IdAndStatus(clientId = client.id!!, status = Process.Status.ACTIVE)
    }


    fun findByPropertyExternalId(externalId: String): List<Process> {
        val property = searchPropertyService.findByExternalId(externalId)
        return processRepository.findByProperty_IdAndStatus(property.id!!, status = Process.Status.ACTIVE)
    }

    fun getByExternalId(externalId: String): List<ProcessStep> {
        val sale = findByExternalId(externalId)
        return processStepRepository.findFlowSteps(sale.id!!)
    }

    fun findBySellerExternalId(externalId: String): List<Process> {
        val seller = sellerService.findByExternalId(externalId)
        val processMain = processRepository.findBySellerMain_IdAndStatus(seller.id!!, status = Process.Status.ACTIVE)
        val processSecondary =
            processRepository.findBySellerSecondary_IdAndStatus(seller.id, status = Process.Status.ACTIVE)
        return processMain.plus(processSecondary)
    }

    fun getComments(id: Long): List<Comment> {
        val process = processRepository.findById(id).orElseThrow { ProcessNotFoundException() }
        return commentRepository.findByProcessIdOrderByCreatedAtDesc(process.id!!)
    }

    fun getReplies(commentId: Long): List<CommentReply> {
        return commentReplyRepository.findByCommentIdOrderByIdDesc(commentId)
    }

}