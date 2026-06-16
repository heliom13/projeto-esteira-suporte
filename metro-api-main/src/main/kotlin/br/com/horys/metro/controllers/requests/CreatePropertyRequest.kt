package br.com.horys.metro.controllers.requests

import br.com.horys.metro.models.MaritalStatus
import br.com.horys.metro.models.Property
import br.com.horys.metro.models.validator.CpfCnpj
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Positive

class CreatePropertyRequest(
    @field:NotBlank val description: String,
    @field:NotBlank val address: String,
    @field:NotBlank val ownerName: String,
    @field:CpfCnpj val ownerDocument: String,
    @field:Positive val price: BigDecimal,
    @field:Positive val financialPrice: BigDecimal,
    @field:Email val email: String,
    val bank: String?,
    @field:NotBlank val phone: String,
    val accountNumberBank: String?,
    val accountBank: String?,
    val linkDrive: String?,
    val maritalStatus: MaritalStatus?,
    val nameSecondary: String?,
    val emailSecondary: String?,
    val pix: String?,
    val phoneSecondary: String?,
) {

    fun toModel(): Property {
        return Property(
            id = null,
            description = this.description,
            address = this.address,
            ownerName = this.ownerName,
            ownerDocument = this.ownerDocument,
            price = this.price,
            financialPrice = this.financialPrice,
            email = this.email,
            bank = this.bank,
            accountBank = this.accountBank,
            accountNumberBank = this.accountNumberBank,
            maritalStatus = this.maritalStatus,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
            linkDrive = this.linkDrive,
            externalId = UUID.randomUUID().toString(),
            nameSecondary = this.nameSecondary,
            phoneSecondary = this.phoneSecondary,
            emailSecondary = this.emailSecondary,
            pix = this.pix,
            phone = this.phone
        )
    }
}
