package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.Comment
import br.com.horys.metro.models.CommentReply
import java.time.LocalDateTime

data class CommentResponse(
    val id: Long?,
    val content: String,
    val userId: Long?,
    val username: String?,
    val replies: List<CommentReplyResponse>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun fromModel(comment: Comment, replies: List<CommentReply>) = CommentResponse(
            id = comment.id,
            content = comment.content,
            userId = comment.user.id,
            username = comment.user.username,
            createdAt = comment.createdAt,
            updatedAt = comment.updatedAt,
            replies = replies.map { CommentReplyResponse.fromModel(it) }
        )
    }
}