package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.LoginLog
import java.time.LocalDateTime

class LoginLogResponse(
    val userName: String,
    val userEmail: String,
    val createdAt: LocalDateTime
) {
    companion object {
        fun fromModel(loginLog: LoginLog) = LoginLogResponse(
            userName = loginLog.user.name,
            userEmail = loginLog.user.email,
            createdAt = loginLog.createdAt
        )
    }
}
