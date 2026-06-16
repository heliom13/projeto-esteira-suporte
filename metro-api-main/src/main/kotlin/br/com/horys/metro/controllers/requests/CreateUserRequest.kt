package br.com.horys.metro.controllers.requests

import br.com.horys.metro.models.User
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class CreateUserRequest(
    @field:NotBlank
    val name: String,
    @field:NotBlank
    val username: String,
    @field:NotBlank
    var password: String,
    @field:NotBlank
    val email: String,
    @field:NotNull
    val role: String
) {
    fun toModel(): User {
        return User(
            name = name,
            username = username,
            password = password,
            email = email,
            role = User.Role.valueOf(role)
        )
    }
}