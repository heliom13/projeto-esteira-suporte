package br.com.horys.metro.controllers.client

import br.com.horys.metro.models.MaritalStatus
import org.hibernate.validator.constraints.br.CPF
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank

class UpdateClientRequest(
    @field:NotBlank val name: String,
    @field:CPF val document: String,
    @field:Email val email: String,
    @field:NotBlank val phone: String,
    @field:NotBlank val address: String,
    @field:NotBlank val job: String,
    @field:NotBlank val birthday: String,
    val maritalStatus: MaritalStatus,
    val nameSecondary: String?,
    val emailSecondary: String?,
    val phoneSecondary: String?,
    val linkDrive: String?
)
