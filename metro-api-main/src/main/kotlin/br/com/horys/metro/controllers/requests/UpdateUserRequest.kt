package br.com.horys.metro.controllers.requests

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class UpdateUserRequest(
    @field:NotBlank
    val name: String,
    @field:NotBlank
    val username: String,
    @field:NotBlank
    val email: String,
    @field:NotNull
    val role: String
)