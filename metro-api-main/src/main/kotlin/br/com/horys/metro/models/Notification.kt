package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

@Entity
@Table(name = "notifications")
data class Notification(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val description: String,
    val stepCurrent: String,
    @Enumerated(EnumType.STRING)
    val destiny: Destiny,
    @Enumerated(EnumType.STRING)
    val type: Type,
    @ManyToOne
    @JoinColumn(name = "process_id")
    val process: Process,
    @ManyToOne
    @JoinColumn(name = "user_origin_id")
    val userOrigin: User,
    @ManyToOne
    @JoinColumn(name = "user_destiny_id")
    val userDestiny: User,
    val read: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
) {
    enum class Type(val description: String) {
        COMMENT_ADDED("Comentário Adicionado"),
        PROCESS_UPDATED("Processo Atualizado"),
        PROCESS_CREATED("Processo Criado"),
        PROCESS_CANCELLED("Processo Cancelado"),
        PROCESS_CHANGED_USER("Processo Alterado de Usuário"),
        PROCESS_STEP_COMPLETED("Etapa Concluída"),
        PROCESS_FINISHED("Processo Finalizado"),
    }

    enum class Destiny {
        NOTIFICATION,
        HISTORY,
        NOTIFICATION_AND_HISTORY
    }
}