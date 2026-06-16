package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.process.CreateCommentReplyRequest
import br.com.horys.metro.controllers.response.CommentReplyResponse
import br.com.horys.metro.services.CommentReplyService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/comment-replies")
class CommentReplyController(private val commentReplyService: CommentReplyService) {

    @PostMapping
    fun createCommentReply(
        @RequestBody request: CreateCommentReplyRequest
    ): ResponseEntity<CommentReplyResponse> {
        val savedCommentReply = commentReplyService.save(request)
        return ResponseEntity(savedCommentReply, HttpStatus.CREATED)
    }

    @GetMapping("/{id}")
    fun getCommentReplyById(@PathVariable id: Long): ResponseEntity<CommentReplyResponse> {
        val commentReply = commentReplyService.findById(id)
        return if (commentReply != null) {
            val response = CommentReplyResponse(
                id = commentReply.id!!,
                commentId = commentReply.comment.id!!,
                userId = commentReply.user.id!!,
                username = commentReply.user.username,
                content = commentReply.content,
                createdAt = commentReply.createdAt,
                updatedAt = commentReply.updatedAt
            )
            ResponseEntity(response, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping
    fun getAllCommentReplies(): ResponseEntity<List<CommentReplyResponse>> {
        val commentReplies = commentReplyService.findAll()
        val response = commentReplies.map { commentReply ->
            CommentReplyResponse(
                id = commentReply.id!!,
                commentId = commentReply.comment.id!!,
                userId = commentReply.user.id!!,
                username = commentReply.user.username,
                content = commentReply.content,
                createdAt = commentReply.createdAt,
                updatedAt = commentReply.updatedAt
            )
        }
        return ResponseEntity(response, HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun deleteCommentReply(@PathVariable id: Long): ResponseEntity<Void> {
        commentReplyService.deleteById(id)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}