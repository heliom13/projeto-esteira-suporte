package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Positive

@Entity
data class Step(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    @field:NotBlank val description: String,
    @field:Positive val deadline: Int,
    val requiredDocument: Boolean,
    @Enumerated(EnumType.STRING)
    val status: Status,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    enum class Status {
        NORMAL, INACTIVE, UNFORESEEN
    }
}
