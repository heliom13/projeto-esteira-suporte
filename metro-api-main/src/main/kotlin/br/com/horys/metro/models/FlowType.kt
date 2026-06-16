package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "flow_types")
data class FlowType(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val description: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
