package br.com.horys.metro.configs.security.filters

import br.com.horys.metro.configs.security.AuthenticationRequest
import br.com.horys.metro.configs.security.AuthenticationResponse
import br.com.horys.metro.configs.security.JWTUtil
import br.com.horys.metro.configs.security.UserDetailsImpl
import br.com.horys.metro.models.LoginLog
import br.com.horys.metro.repositories.LoginLogRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import java.time.LocalDateTime
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JWTAuthenticationFilter(
    authenticationManager: AuthenticationManager,
    private var jwtUtil: JWTUtil,
    private val loginLogRepository: LoginLogRepository
) :
    UsernamePasswordAuthenticationFilter() {

    private val log = LoggerFactory.getLogger(this::class.java)

    init {
        this.authenticationManager = authenticationManager
    }

    override fun attemptAuthentication(request: HttpServletRequest, response: HttpServletResponse?): Authentication? {
        try {
            val (username, password) = ObjectMapper().readValue(request.inputStream, AuthenticationRequest::class.java)
            val token = UsernamePasswordAuthenticationToken(username, password)
            return authenticationManager.authenticate(token)
        } catch (e: Exception) {
            throw UsernameNotFoundException("")
        }
    }

    override fun successfulAuthentication(
        request: HttpServletRequest?,
        response: HttpServletResponse,
        chain: FilterChain?,
        authResult: Authentication
    ) {
        val user = (authResult.principal as UserDetailsImpl)
        val token = jwtUtil.generateToken(user)

        try {
            loginLogRepository.save(LoginLog(id = null, user = user.getUser(), createdAt = LocalDateTime.now()))
        } catch (e: Exception) {
            log.error(">>> [LOGIN_LOG] Erro ao registrar login: ${e.message}", e)
        }

        response.addHeader("Authorization", "Bearer $token")
        response.contentType = "application/json"
        response.characterEncoding = "UTF-8"
        response.writer.write(ObjectMapper().writeValueAsString(AuthenticationResponse(token)))
        response.writer.flush()
    }
}