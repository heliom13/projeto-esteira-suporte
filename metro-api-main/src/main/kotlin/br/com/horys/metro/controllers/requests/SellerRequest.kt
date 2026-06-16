package br.com.horys.metro.controllers.requests

import br.com.horys.metro.extensions.cleanPhoneNumber
import br.com.horys.metro.models.Seller
import br.com.horys.metro.models.validator.CpfCnpj
import java.util.UUID
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank

class SellerRequest(
    @field:NotBlank val name: String,
    @field:CpfCnpj val document: String,
    @field:Email val email: String,
    @field:Email val emailOther: String?,
    @field:NotBlank val phone: String,
    val otherPhone: String?,
    val bank: String?,
    val accountNumberBank: String?,
    val accountBank: String?,
    val pix: String?,
    @field:NotBlank val creci: String,
) {
    fun toModel(): Seller {
        return Seller(
            id = null,
            name = this.name,
            document = this.document,
            email = this.email,
            emailOther = this.emailOther,
            phone = this.phone.cleanPhoneNumber(),
            otherPhone = this.otherPhone?.cleanPhoneNumber() ?: "",
            bank = this.bank,
            accountBank = this.accountBank,
            accountNumberBank = this.accountNumberBank,
            creci = this.creci,
            externalId = UUID.randomUUID().toString(),
            pix = this.pix
        )
    }
}