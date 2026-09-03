package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.CreateClientNoteRequest
import br.com.horys.metro.services.ClientNoteService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/v1/clients/{clientId}/notes")
class ClientNoteController(
    private val clientNoteService: ClientNoteService
) {
    @GetMapping
    fun getAll(@PathVariable clientId: Long) = clientNoteService.getByClient(clientId)

    @PostMapping
    fun create(@PathVariable clientId: Long, @Valid @RequestBody request: CreateClientNoteRequest) =
        clientNoteService.create(clientId, request)
}
