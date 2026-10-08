package br.com.horys.metro.configs

import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.context.annotation.Configuration

@Configuration
class CorsConfiguration : WebMvcConfigurer {

    companion object {
        // Enderecos do frontend usados quando CORS_ALLOWED_ORIGINS nao esta definida.
        // Antes o padrao era "*" (qualquer site podia chamar a API pelo navegador).
        val ORIGENS_PADRAO = listOf(
            "https://metro-front-tuna.onrender.com",
            "https://sistema.suporteimobiliario.com",
            "http://localhost:3000",
        )
    }

    override fun addCorsMappings(registry: CorsRegistry) {
        // Origens permitidas via env CORS_ALLOWED_ORIGINS (separadas por virgula).
        val origens = System.getenv("CORS_ALLOWED_ORIGINS")
            ?.split(",")
            ?.map { it.trim().trimEnd('/') }
            ?.filter { it.isNotEmpty() }
            ?.takeIf { it.isNotEmpty() }
            ?: ORIGENS_PADRAO

        // A fila do WhatsApp e lida pela extensao do Chrome (origem
        // chrome-extension://...), entao aceita qualquer origem. Ela continua
        // protegida pelo token X-Queue-Token. Precisa vir ANTES do "/**":
        // vale o primeiro mapeamento que casar com o caminho.
        registry.addMapping("/v1/webhook/whatsapp/**")
            .allowedOriginPatterns("*")
            .allowedHeaders("*")
            .allowedMethods("GET", "POST", "OPTIONS")

        registry.addMapping("/**")
            .allowedOrigins(*origens.toTypedArray())
            .allowedHeaders("*")
            .allowedMethods("*")
    }
}
