package br.com.horys.metro.controllers.client

import br.com.horys.metro.models.MaritalStatus
import javax.validation.constraints.NotBlank

class UpdateClientRequest(
    @field:NotBlank val name: String,
    val document: String?,
    val email: String?,
    @field:NotBlank val phone: String,
    val address: String?,
    val job: String?,
    val birthday: String?,
    val maritalStatus: MaritalStatus?,
    val nameSecondary: String?,
    val emailSecondary: String?,
    val phoneSecondary: String?,
    val linkDrive: String?
)
