package br.com.horys.metro.configs

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfiguration : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        // Origens permitidas via env CORS_ALLOWED_ORIGINS (separadas por vírgula).
        // Padrão "*" para não quebrar; defina os domínios reais no Render para restringir.
        val origins = System.getenv("CORS_ALLOWED_ORIGINS")
            ?.split(",")
            ?.map { it.trim() }
            ?.filter { it.isNotEmpty() }
            ?.toTypedArray()
            ?: arrayOf("*")

        registry.addMapping("/**")
            .allowedHeaders("*")
            .allowedOrigins(*origins)
            .allowedMethods("*")
    }
}
