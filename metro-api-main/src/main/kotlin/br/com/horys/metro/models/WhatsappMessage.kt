package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

/**
 * Fila de mensagens de WhatsApp a serem enviadas pela extensão (WhatsApp Web).
 * O backend apenas enfileira; a extensão lê os pendentes, envia e marca como enviada.
 */
@Entity
@Table(name = "whatsapp_queue")
data class WhatsappMessage(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val phone: String,

    @Column(columnDefinition = "TEXT")
    val message: String,

    @field:Enumerated(EnumType.STRING)
    var status: Status = Status.PENDING,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    var sentAt: LocalDateTime? = null
) {
    enum class Status { PENDING, SENT, FAILED }
}
