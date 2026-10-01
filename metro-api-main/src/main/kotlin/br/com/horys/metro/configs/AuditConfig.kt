package br.com.horys.metro.configs

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * Registra o interceptor de auditoria para as rotas da API.
 */
@Configuration
class AuditConfig(
    private val auditInterceptor: AuditInterceptor
) : WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(auditInterceptor).addPathPatterns("/v1/**")
    }
}
