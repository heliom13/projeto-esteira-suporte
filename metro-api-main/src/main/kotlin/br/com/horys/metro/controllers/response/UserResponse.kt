package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.User

class UserResponse(
    val id: Long,
    val name: String,
    val username: String,
    val email: String,
    val role: User.Role
) {
}