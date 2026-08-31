package br.com.horys.metro.services

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class EmailService(
    private val mailSender: JavaMailSender,
    @Value("\${spring.mail.username}") private val fromAddress: String,
    @Value("\${spring.mail.password}") private val debugPassword: String
) {
    private val logger = LoggerFactory.getLogger(EmailService::class.java)

    @PostConstruct
    fun logMailConfigDebug() {
        logger.info("DEBUG_MAIL_CONFIG username='{}' passwordLength={}", fromAddress, debugPassword.length)
    }

    fun sendPasswordResetEmail(to: String, resetLink: String) {
        val message = SimpleMailMessage()
        message.setFrom(fromAddress)
        message.setTo(to)
        message.setSubject("Redefinição de senha - Suporte Imobiliário")
        message.setText(
            """
            Olá,

            Recebemos uma solicitação para redefinir a senha da sua conta no sistema Suporte Imobiliário.

            Clique no link abaixo para criar uma nova senha. Esse link é válido por 30 minutos:
            $resetLink

            Se você não solicitou essa redefinição, ignore este e-mail — sua senha permanece a mesma.
            """.trimIndent()
        )
        mailSender.send(message)
    }
}
