package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class Process(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val externalId: String,
    @ManyToOne
    @JoinColumn(name = "client_id")
    val client: Client?,
    @ManyToOne
    @JoinColumn(name = "flow_id")
    val flow: Flow,
    @ManyToOne
    @JoinColumn(name = "step_current_id")
    val stepCurrent: Step,
    @ManyToOne
    @JoinColumn(name = "process_step_current_id")
    val processStepCurrent: ProcessStep?,
    val orderCurrent: Double,
    @Enumerated(EnumType.STRING)
    val status: Status,
    @ManyToOne
    val property: Property?,
    @ManyToOne
    val sellerMain: Seller?,
    @ManyToOne
    val sellerSecondary: Seller?,
    val linkDrive: String?,
    val reasonCancel: String?,
    val totalDays: Int,
    val totalSteps: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val deletedAt: LocalDateTime? = null,
    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User,
    @ManyToOne
    @JoinColumn(name = "proposal_id")
    val proposal: Proposal
) {


    enum class Status {
        ACTIVE, SOLD, CANCELLED
    }
}
