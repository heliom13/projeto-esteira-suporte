package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.ClientNote
import java.time.LocalDateTime

class ClientNoteResponse(
    val id: Long,
    val content: String,
    val userName: String,
    val userEmail: String,
    val createdAt: LocalDateTime
) {
    companion object {
        fun fromModel(note: ClientNote) = ClientNoteResponse(
            id = note.id!!,
            content = note.content,
            userName = note.user.name,
            userEmail = note.user.email,
            createdAt = note.createdAt
        )
    }
}
