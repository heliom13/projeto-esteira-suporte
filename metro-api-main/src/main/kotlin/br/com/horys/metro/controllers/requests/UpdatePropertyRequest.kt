package br.com.horys.metro.controllers.requests

import br.com.horys.metro.models.MaritalStatus
import org.hibernate.validator.constraints.br.CPF
import java.math.BigDecimal
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Positive

class UpdatePropertyRequest(
    @field:NotBlank val description: String,
    @field:NotBlank val address: String,
    @field:NotBlank val ownerName: String,
    @field:CPF val ownerDocument: String,
    @field:Positive val price: BigDecimal,
    @field:Positive val financialPrice: BigDecimal,
    @field:Email val email: String,
    val bank: String,
    val accountNumberBank: String,
    val pix: String,
    val accountBank: String,
    val maritalStatus: MaritalStatus,
    val linkDrive: String?,
)
