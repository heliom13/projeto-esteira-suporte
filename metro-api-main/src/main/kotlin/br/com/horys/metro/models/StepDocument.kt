package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.persistence.Table

@Entity
@Table(name = "step_documents")
data class StepDocument(
    @Id
    @GeneratedValue
    val id: Long?,
    @ManyToOne
    val step: Step,
    @ManyToOne
    val typeDocument: TypeDocument,
    val deleted: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)