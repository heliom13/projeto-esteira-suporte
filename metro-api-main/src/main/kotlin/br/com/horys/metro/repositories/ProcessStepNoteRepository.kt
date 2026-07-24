package br.com.horys.metro.repositories

import br.com.horys.metro.models.ProcessStepNote
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ProcessStepNoteRepository : JpaRepository<ProcessStepNote, Long> {
    fun findByProcessStep_IdOrderByCreatedAtAsc(processStepId: Long): List<ProcessStepNote>

    @Query("SELECT n.processStep.id, COUNT(n) FROM ProcessStepNote n WHERE n.processStep.id IN :ids GROUP BY n.processStep.id")
    fun countGroupedByIds(ids: List<Long>): List<Array<Any>>
}
