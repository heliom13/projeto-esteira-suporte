package br.com.horys.metro.controllers.requests

import javax.validation.constraints.NotBlank

data class ForgotPasswordRequest(
    @field:NotBlank
    val email: String
)
