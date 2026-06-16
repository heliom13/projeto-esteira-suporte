package br.com.horys.metro.repositories

import br.com.horys.metro.models.CommentReply
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CommentReplyRepository : JpaRepository<CommentReply, Long> {
    fun findByCommentIdOrderByIdDesc(commentId: Long): List<CommentReply>
}