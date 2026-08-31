package br.com.horys.metro.controllers.requests

import javax.validation.constraints.NotBlank

data class ResetPasswordWithTokenRequest(
    @field:NotBlank
    val token: String,
    @field:NotBlank
    val password: String
)
