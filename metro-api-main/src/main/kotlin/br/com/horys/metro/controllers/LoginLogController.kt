package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.response.LoginLogResponse
import br.com.horys.metro.repositories.LoginLogRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/login-logs")
class LoginLogController(
    private val loginLogRepository: LoginLogRepository
) {
    @GetMapping
    fun getAll(): List<LoginLogResponse> {
        return loginLogRepository.findTop200ByOrderByCreatedAtDesc().map { LoginLogResponse.fromModel(it) }
    }
}
