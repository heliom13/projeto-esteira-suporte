package br.com.horys.metro.controllers.client

import br.com.horys.metro.extensions.cleanPhoneNumber
import br.com.horys.metro.models.Client
import br.com.horys.metro.models.MaritalStatus
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID
import javax.validation.constraints.NotBlank

class CreateClientRequest(
    @field:NotBlank val name: String,
    val document: String?,
    val email: String?,
    @field:NotBlank val phone: String,
    val address: String?,
    val job: String?,
    val birthday: String?,
    val nameSecondary: String?,
    val emailSecondary: String?,
    val phoneSecondary: String?,
    val linkDrive: String?,
    val maritalStatus: MaritalStatus?
) {
    fun toModel(): Client {
        return Client(
            id = null,
            name = this.name,
            document = this.document,
            email = this.email,
            job = this.job,
            phone = this.phone.cleanPhoneNumber(),
            address = this.address,
            maritalStatus = this.maritalStatus,
            birthday = this.birthday?.let { LocalDate.parse(it) },
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
            linkDrive = this.linkDrive,
            externalId = UUID.randomUUID().toString(),
            nameSecondary = this.nameSecondary,
            phoneSecondary = this.phoneSecondary,
            emailSecondary = this.emailSecondary
        )
    }
}
