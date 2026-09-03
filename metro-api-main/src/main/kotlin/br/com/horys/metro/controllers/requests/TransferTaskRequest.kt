package br.com.horys.metro.controllers.requests

import javax.validation.constraints.NotBlank

class TransferTaskRequest(
    @field:NotBlank val assignedToUsername: String
)
