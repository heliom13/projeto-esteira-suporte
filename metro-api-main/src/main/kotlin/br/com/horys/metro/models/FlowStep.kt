package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "flow_steps")
data class FlowStep(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long?,
        val orderStep: Double,
        val deadline: Int,
        @ManyToOne
        @JoinColumn(name = "step_id")
        val step: Step,
        @ManyToOne
        @JoinColumn(name = "flow_id")
        val flow: Flow,
        @Enumerated(EnumType.STRING)
        val status: Status,
        val createdAt: LocalDateTime,
        val updatedAt: LocalDateTime
) {
    enum class Status {
        ACTIVE, INACTIVE
    }
}
