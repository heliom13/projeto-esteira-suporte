package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne

@Entity
data class ProcessStep(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    @ManyToOne
    @JoinColumn(name = "process_id")
    val process: Process,
    val orderStep: Double,
    @ManyToOne
    val step: Step,
    val reasonUnforeseen: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    @Enumerated(EnumType.STRING)
    val status: Status
) {

    enum class Status {
        COMPLETED, UNCOMPLETED, CANCELLED
    }

    fun getDescriptionStep(): String {
        if (this.step.status == Step.Status.UNFORESEEN) {
            return "${this.step.description} - ${this.reasonUnforeseen}"
        }
        return this.step.description
    }
}
