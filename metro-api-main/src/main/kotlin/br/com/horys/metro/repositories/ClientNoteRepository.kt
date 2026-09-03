package br.com.horys.metro.repositories

import br.com.horys.metro.models.ClientNote
import org.springframework.data.jpa.repository.JpaRepository

interface ClientNoteRepository : JpaRepository<ClientNote, Long> {
    fun findByClient_IdOrderByCreatedAtAsc(clientId: Long): List<ClientNote>
}
