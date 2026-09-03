package br.com.horys.metro.controllers.requests

import javax.validation.constraints.NotBlank

class CreateClientNoteRequest(
    @field:NotBlank val content: String
)
