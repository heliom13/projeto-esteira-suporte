package br.com.horys.metro.services.message

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class MessageService(
    private val whatsappQueueService: WhatsappQueueService
) {
    private val log: Logger = LoggerFactory.getLogger(this::class.java)

    // Mesma assinatura de antes: os chamadores (ProcessMessageService etc.) não mudam.
    // Agora, em vez de enviar pela Twilio, a mensagem é colocada na fila para a extensão enviar.
    fun sendMessage(messageRequest: MessageRequest) {
        try {
            whatsappQueueService.enfileirar(messageRequest.phone, messageRequest.message)
        } catch (e: Exception) {
            log.error("Erro ao enfileirar mensagem WhatsApp: ${e.message}", e)
        }
    }
}
