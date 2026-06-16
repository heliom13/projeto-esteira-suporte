package br.com.horys.metro.configs.security

data class AuthenticationRequest(
    val email: String = "",
    val password: String = ""
)