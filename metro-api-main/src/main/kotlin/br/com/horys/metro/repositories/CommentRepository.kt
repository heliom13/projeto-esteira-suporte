package br.com.horys.metro.repositories

import br.com.horys.metro.models.Comment
import org.springframework.data.jpa.repository.JpaRepository

interface CommentRepository : JpaRepository<Comment, Long> {
    fun findByProcessIdOrderByCreatedAtDesc(processId: Long): List<Comment>
}