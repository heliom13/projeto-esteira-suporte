package br.com.horys.metro.models

import java.time.LocalDate
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "clients")
data class Client(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val externalId: String,
    val name: String,
    val document: String,
    val birthday: LocalDate,
    val email: String,
    val phone: String,
    val address: String,
    @field:Enumerated(EnumType.STRING) val maritalStatus: MaritalStatus,
    val job: String,
    val linkDrive: String?,
    val nameSecondary: String?,
    val emailSecondary: String?,
    val phoneSecondary: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    val active: Boolean = true,
    val deletedAt: LocalDateTime? = null
)
