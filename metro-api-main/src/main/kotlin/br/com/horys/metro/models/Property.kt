package br.com.horys.metro.models

import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "properties")
data class Property(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long?,
    val externalId: String,
    val description: String,
    val address: String,
    val ownerName: String,
    val ownerDocument: String,
    val price: BigDecimal,
    val financialPrice: BigDecimal,
    val email: String,
    val bank: String?,
    val accountBank: String?,
    val accountNumberBank: String?,
    val linkDrive: String?,
    val phone: String,
    val nameSecondary: String?,
    val emailSecondary: String?,
    val phoneSecondary: String?,
    val pix: String?,
    @Enumerated(EnumType.STRING)
    val maritalStatus: MaritalStatus?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val active: Boolean = true,
    val deletedAt: LocalDateTime? = null
)
