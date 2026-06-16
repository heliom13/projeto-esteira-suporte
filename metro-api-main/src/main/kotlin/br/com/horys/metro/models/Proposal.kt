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
import javax.persistence.Table

@Entity
@Table(name = "proposals")
data class Proposal(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    val client: Client,
    @Enumerated(EnumType.STRING)
    val type: Type,
    @Enumerated(EnumType.STRING)
    val status: Status,
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updateAt: LocalDateTime = LocalDateTime.now()
) {
    enum class Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    enum class Type {
        CONSORTIUM,
        CONSIGNMENT,
        LOAN,
        FINANCING,
        CASH,
        CONTRACT,
        REGULARIZATION
    }
}
