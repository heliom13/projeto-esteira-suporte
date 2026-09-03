package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.CreateClientNoteRequest
import br.com.horys.metro.controllers.response.ClientNoteResponse
import br.com.horys.metro.models.ClientNote
import br.com.horys.metro.repositories.ClientNoteRepository
import org.springframework.stereotype.Service

@Service
class ClientNoteService(
    private val clientNoteRepository: ClientNoteRepository,
    private val clientService: ClientService,
    private val userService: UserService
) {

    fun getByClient(clientId: Long): List<ClientNoteResponse> {
        return clientNoteRepository.findByClient_IdOrderByCreatedAtAsc(clientId)
            .map { ClientNoteResponse.fromModel(it) }
    }

    fun create(clientId: Long, request: CreateClientNoteRequest): ClientNoteResponse {
        val client = clientService.findById(clientId)
        val currentUser = userService.getLoggedInUser()

        val note = clientNoteRepository.save(
            ClientNote(
                id = null,
                client = client,
                user = currentUser,
                content = request.content
            )
        )

        return ClientNoteResponse.fromModel(note)
    }
}
