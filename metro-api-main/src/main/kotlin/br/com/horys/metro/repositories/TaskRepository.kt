package br.com.horys.metro.repositories

import br.com.horys.metro.models.Task
import org.springframework.data.jpa.repository.JpaRepository

interface TaskRepository : JpaRepository<Task, Long> {
    fun findByAssignedTo_IdOrderByCreatedAtDesc(userId: Long): List<Task>
    fun findByAssignedBy_IdOrderByCreatedAtDesc(userId: Long): List<Task>
    fun countByAssignedTo_IdAndSeenFalse(userId: Long): Long
}
