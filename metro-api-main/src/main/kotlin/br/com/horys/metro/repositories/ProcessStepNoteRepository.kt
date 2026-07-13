package br.com.horys.metro.repositories

import br.com.horys.metro.models.ProcessStepNote
import org.springframework.data.jpa.repository.JpaRepository

interface ProcessStepNoteRepository : JpaRepository<ProcessStepNote, Long> {
    fun findByProcessStep_IdOrderByCreatedAtAsc(processStepId: Long): List<ProcessStepNote>
    fun countByProcessStep_Id(processStepId: Long): Long
}
