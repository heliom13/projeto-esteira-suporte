package br.com.horys.metro.controllers

import br.com.horys.metro.services.message.WhatsappQueueService
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Endpoints consumidos pela extensão do Chrome que envia pelo WhatsApp Web.
 * Fica sob /v1/webhook/** (já liberado na SecurityConfig) e é protegido por um token
 * simples no header X-Queue-Token (defina a variável de ambiente WHATSAPP_QUEUE_TOKEN).
 */
@RestController
@RequestMapping("/v1/webhook/whatsapp")
class WhatsappQueueController(
    private val queueService: WhatsappQueueService,
    @Value("\${WHATSAPP_QUEUE_TOKEN:}") private val token: String
) {
    private fun autorizado(auth: String?): Boolean = token.isBlank() || auth == token

    @GetMapping("/pendentes")
    fun pendentes(
        @RequestHeader(value = "X-Queue-Token", required = false) auth: String?
    ): ResponseEntity<*> {
        if (!autorizado(auth)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build<Any>()
        val itens = queueService.pendentes().map {
            mapOf(
                "id" to it.id,
                "phone" to it.phone,
                "message" to it.message
            )
        }
        return ResponseEntity.ok(itens)
    }

    @PostMapping("/{id}/enviada")
    fun enviada(
        @PathVariable id: Long,
        @RequestHeader(value = "X-Queue-Token", required = false) auth: String?
    ): ResponseEntity<*> {
        if (!autorizado(auth)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build<Any>()
        return if (queueService.marcarEnviada(id)) {
            ResponseEntity.ok(mapOf("ok" to true))
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).build<Any>()
        }
    }
}
