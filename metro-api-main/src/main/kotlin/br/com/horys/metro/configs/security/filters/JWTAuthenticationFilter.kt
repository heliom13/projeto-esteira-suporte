package br.com.horys.metro.configs.security.filters

import br.com.horys.metro.configs.security.AuthenticationRequest
import br.com.horys.metro.configs.security.AuthenticationResponse
import br.com.horys.metro.configs.security.JWTUtil
import br.com.horys.metro.configs.security.LoginAttemptService
import br.com.horys.metro.configs.security.UserDetailsImpl
import br.com.horys.metro.models.LoginLog
import br.com.horys.metro.repositories.LoginLogRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.LockedException
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
    private val loginLogRepository: LoginLogRepository,
    private val loginAttemptService: LoginAttemptService
) :
    UsernamePasswordAuthenticationFilter() {

    private val log = LoggerFactory.getLogger(this::class.java)

    init {
        this.authenticationManager = authenticationManager
    }

    override fun attemptAuthentication(request: HttpServletRequest, response: HttpServletResponse?): Authentication? {
        var email: String? = null
        try {
            val creds = ObjectMapper().readValue(request.inputStream, AuthenticationRequest::class.java)
            email = creds.email
            if (loginAttemptService.estaBloqueado(email)) {
                throw LockedException("Muitas tentativas de login. Tente novamente em alguns minutos.")
            }
            val token = UsernamePasswordAuthenticationToken(creds.email, creds.password)
            val auth = authenticationManager.authenticate(token)
            loginAttemptService.registrarSucesso(email)
            return auth
        } catch (e: LockedException) {
            throw e
        } catch (e: Exception) {
            loginAttemptService.registrarFalha(email)
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