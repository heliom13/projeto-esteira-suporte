package br.com.horys.metro.repositories

import br.com.horys.metro.models.WhatsappMessage
import org.springframework.data.jpa.repository.JpaRepository

interface WhatsappMessageRepository : JpaRepository<WhatsappMessage, Long> {
    fun findTop30ByStatusOrderByCreatedAtAsc(status: WhatsappMessage.Status): List<WhatsappMessage>
}
