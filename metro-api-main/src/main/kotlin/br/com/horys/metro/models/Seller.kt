package br.com.horys.metro.models

import br.com.horys.metro.models.validator.CpfCnpj
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank

@Entity
@Table(name = "sellers")
data class Seller(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val name: String,
    val externalId: String,
    val creci: String?,
    @field:CpfCnpj val document: String,
    @field:Email val email: String,
    @field:Email val emailOther: String?,
    @field:NotBlank val phone: String,
    val otherPhone: String?,
    val pix: String?,
    val bank: String?,
    val accountBank: String?,
    val accountNumberBank: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    val active: Boolean = true,
    val deletedAt: LocalDateTime? = null
)