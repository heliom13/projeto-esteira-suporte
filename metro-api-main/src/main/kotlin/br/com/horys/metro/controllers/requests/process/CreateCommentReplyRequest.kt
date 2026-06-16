package br.com.horys.metro.controllers.requests.process

data class CreateCommentReplyRequest(
    val commentId: Long,
    val reply: String
)