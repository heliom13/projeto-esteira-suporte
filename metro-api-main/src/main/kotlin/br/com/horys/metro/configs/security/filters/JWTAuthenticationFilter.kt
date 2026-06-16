package br.com.horys.metro.configs.security.filters

import br.com.horys.metro.configs.security.AuthenticationRequest
import br.com.horys.metro.configs.security.AuthenticationResponse
import br.com.horys.metro.configs.security.JWTUtil
import br.com.horys.metro.configs.security.UserDetailsImpl
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JWTAuthenticationFilter(authenticationManager: AuthenticationManager, private var jwtUtil: JWTUtil) :
    UsernamePasswordAuthenticationFilter() {

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
        response.addHeader("Authorization", "Bearer $token")
        response.contentType = "application/json"
        response.characterEncoding = "UTF-8"
        response.writer.write(ObjectMapper().writeValueAsString(AuthenticationResponse(token)))
        response.writer.flush()
    }
}