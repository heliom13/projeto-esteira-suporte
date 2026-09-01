package br.com.horys.metro.services

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpEntity
import org.springframework.http.MediaType
import org.springframework.http.client.SimpleClientHttpRequestFactory
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate

@Service
class EmailService(
    @Value("\${resend.api-key}") private val apiKey: String,
    @Value("\${resend.from-address}") private val fromAddress: String
) {
    private val logger = LoggerFactory.getLogger(EmailService::class.java)

    private val restTemplate = RestTemplate(
        SimpleClientHttpRequestFactory().apply {
            setConnectTimeout(8000)
            setReadTimeout(8000)
        }
    )

    fun sendPasswordResetEmail(to: String, resetLink: String) {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON
        headers.setBearerAuth(apiKey)

        val body = mapOf(
            "from" to fromAddress,
            "to" to listOf(to),
            "subject" to "Redefinição de senha - Suporte Imobiliário",
            "text" to """
                Olá,

                Recebemos uma solicitação para redefinir a senha da sua conta no sistema Suporte Imobiliário.

                Clique no link abaixo para criar uma nova senha. Esse link é válido por 30 minutos:
                $resetLink

                Se você não solicitou essa redefinição, ignore este e-mail — sua senha permanece a mesma.
            """.trimIndent()
        )

        try {
            restTemplate.postForEntity(
                "https://api.resend.com/emails",
                HttpEntity(body, headers),
                String::class.java
            )
        } catch (e: RestClientException) {
            logger.error("RESEND_SEND_FAILED: {}", e.message, e)
            throw e
        }
    }
}
