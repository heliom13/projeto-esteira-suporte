package br.com.horys.metro.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
    private val mailSender: JavaMailSender,
    @Value("\${spring.mail.username}") private val fromAddress: String
) {

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
