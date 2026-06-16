package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.CommentReply
import java.time.LocalDateTime

data class CommentReplyResponse(
    val id: Long,
    val commentId: Long,
    val userId: Long,
    val username: String,
    val content: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun fromModel(model: CommentReply): CommentReplyResponse {
            return CommentReplyResponse(
                id = model.id!!,
                commentId = model.comment.id!!,
                userId = model.user.id!!,
                username = model.user.username,
                content = model.content,
                createdAt = model.createdAt,
                updatedAt = model.updatedAt
            )
        }
    }
}