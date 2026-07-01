package br.com.horys.metro.configs.security

import br.com.horys.metro.configs.security.filters.JWTAuthenticationFilter
import br.com.horys.metro.configs.security.filters.JWTAuthorizationFilter
import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private var userDetailsService: UserDetailsService,
    private var jwtUtil: JWTUtil
) : WebSecurityConfigurerAdapter() {
    override fun configure(http: HttpSecurity) {
        http
            .cors().and()
            .csrf()
            .disable()
            .authorizeRequests()
            .antMatchers(HttpMethod.POST, "/v1/users/**").permitAll()
            .antMatchers(HttpMethod.PUT, "/v1/users/*/reset").permitAll()
            .antMatchers(HttpMethod.GET, "/v1/users/basic").permitAll()
            .antMatchers("/v1/processes/clients/**").permitAll()
            .antMatchers("/v1/processes/sellers/**").permitAll()
            .antMatchers("/v1/processes/properties/**").permitAll()
            .antMatchers("/v1/processes/external/**").permitAll()
            .antMatchers("/file/**").permitAll()
            .antMatchers("/swagger-ui/**").permitAll()
            .antMatchers("/swagger-ui.html").permitAll()
            .antMatchers("/v3/api-docs/**").permitAll()
            .antMatchers("/v1/webhook/**").permitAll()
            .antMatchers("/actuator/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .addFilter(
                JWTAuthenticationFilter(
                    authenticationManager(),
                    jwtUtil = jwtUtil
                )
            )
            .addFilter(
                JWTAuthorizationFilter(
                    authenticationManager(),
                    jwtUtil = jwtUtil,
                    userDetailService = userDetailsService
                )
            )
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
    }

    @Bean
    fun bCryptPasswordEncoder(): BCryptPasswordEncoder {
        return BCryptPasswordEncoder()
    }

    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder())
    }

    @Bean
    fun customOpenAPI(): OpenAPI {
        val securitySchemeName = "bearerAuth"
        val scheme = SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")

        return OpenAPI()
            .addSecurityItem(SecurityRequirement().addList(securitySchemeName))
            .components(Components().addSecuritySchemes(securitySchemeName, scheme))
    }
}