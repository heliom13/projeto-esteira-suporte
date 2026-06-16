package br.com.horys.metro.configs

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration

@Configuration
class MessageConfig(
    @Value("\${message.token}")
    val token: String,
)