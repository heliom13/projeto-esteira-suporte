package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.process.CreateCommentReplyRequest
import br.com.horys.metro.controllers.response.CommentReplyResponse
import br.com.horys.metro.models.CommentReply
import br.com.horys.metro.models.Notification
import br.com.horys.metro.repositories.CommentReplyRepository
import br.com.horys.metro.repositories.CommentRepository
import br.com.horys.metro.repositories.NotificationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class CommentReplyService(
    private val commentReplyRepository: CommentReplyRepository,
    private val commentRepository: CommentRepository,
    private val userService: UserService,
    private val notificationRepository: NotificationRepository
) {

    @Transactional
    fun save(request: CreateCommentReplyRequest): CommentReplyResponse {
        val comment =
            commentRepository.findById(request.commentId).orElseThrow { throw Exception("Commentario nao encontrado") }
        val user = userService.getLoggedInUser()

        val savedCommentReply = CommentReply(
            comment = comment, user = user, content = request.reply
        )

        commentReplyRepository.save(savedCommentReply)

        notificationRepository.save(
            Notification(
                id = null,
                read = false,
                stepCurrent = comment.process.stepCurrent.description,
                type = Notification.Type.COMMENT_ADDED,
                destiny = Notification.Destiny.NOTIFICATION_AND_HISTORY,
                description = "Houve uma resposta ao comentario: ${comment.content}, a resposta foi: ${request.reply}",
                userDestiny = comment.user,
                userOrigin = user,
                process = comment.process,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
            )
        )


        return CommentReplyResponse(
            id = savedCommentReply.id!!,
            commentId = savedCommentReply.comment.id!!,
            userId = savedCommentReply.user.id!!,
            username = savedCommentReply.user.username,
            content = savedCommentReply.content,
            createdAt = savedCommentReply.createdAt,
            updatedAt = savedCommentReply.updatedAt
        )

    }

    fun findById(id: Long): CommentReply? {
        return commentReplyRepository.findById(id).orElse(null)
    }

    fun findAll(): List<CommentReply> {
        return commentReplyRepository.findAll()
    }

    fun deleteById(id: Long) {
        commentReplyRepository.deleteById(id)
    }
}