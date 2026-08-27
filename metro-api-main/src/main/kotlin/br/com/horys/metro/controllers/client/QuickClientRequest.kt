package br.com.horys.metro.controllers.client

import br.com.horys.metro.extensions.cleanPhoneNumber
import br.com.horys.metro.models.Client
import java.time.LocalDateTime
import java.util.UUID
import javax.validation.constraints.NotBlank

class QuickClientRequest(
    @field:NotBlank val name: String,
    @field:NotBlank val phone: String
) {
    fun toModel(): Client {
        return Client(
            id = null,
            name = this.name,
            document = null,
            email = null,
            job = null,
            phone = this.phone.cleanPhoneNumber(),
            address = null,
            maritalStatus = null,
            birthday = null,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
            linkDrive = null,
            externalId = UUID.randomUUID().toString(),
            nameSecondary = null,
            phoneSecondary = null,
            emailSecondary = null
        )
    }
}
