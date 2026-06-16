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
@Table(name = "flows")
data class Flow(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val description: String,
    @ManyToOne
    @JoinColumn(name = "type_id")
    val type: FlowType,
    @Enumerated(EnumType.STRING)
    val status: StatusFlow,
    val sendMessage: Boolean,

    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    enum class StatusFlow {
        ACTIVE, INACTIVE
    }

}
