package br.com.horys.metro.repositories

import br.com.horys.metro.models.StepDocument
import org.springframework.data.jpa.repository.JpaRepository

interface StepDocumentRepository : JpaRepository<StepDocument, Long> {
    fun findByStep_IdAndDeletedFalse(stepId: Long): List<StepDocument>
    fun existsByTypeDocument_IdAndDeletedFalse(typeDocumentId: Long): Boolean
}