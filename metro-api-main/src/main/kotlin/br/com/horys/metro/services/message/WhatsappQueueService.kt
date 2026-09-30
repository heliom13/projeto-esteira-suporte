package br.com.horys.metro.services.message

import br.com.horys.metro.models.WhatsappMessage
import br.com.horys.metro.repositories.WhatsappMessageRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

/**
 * Coloca as mensagens na fila e permite a extensão consumir/marcar como enviada.
 * Substitui o envio direto (Twilio) — agora quem envia é a extensão via WhatsApp Web.
 */
@Service
class WhatsappQueueService(
    private val repository: WhatsappMessageRepository
) {
    fun enfileirar(phone: String, message: String) {
        repository.save(WhatsappMessage(phone = phone, message = message))
    }

    fun pendentes(): List<WhatsappMessage> =
        repository.findTop30ByStatusOrderByCreatedAtAsc(WhatsappMessage.Status.PENDING)

    fun marcarEnviada(id: Long): Boolean {
        val msg = repository.findById(id).orElse(null) ?: return false
        msg.status = WhatsappMessage.Status.SENT
        msg.sentAt = LocalDateTime.now()
        repository.save(msg)
        return true
    }
}
