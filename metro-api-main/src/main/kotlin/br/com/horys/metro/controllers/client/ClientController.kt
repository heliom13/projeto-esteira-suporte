package br.com.horys.metro.controllers.client

import br.com.horys.metro.models.Client
import br.com.horys.metro.services.ClientService
import br.com.horys.metro.services.SearchClientService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import javax.validation.Valid

@V1Clients
class ClientController(
    private val clientService: ClientService,
    private val searchClientService: SearchClientService
) {
    @PostMapping
    fun save(
        @Valid @RequestBody request: CreateClientRequest
    ): Client {
        return clientService.save(request)
    }

    @PostMapping("/quick")
    fun saveQuick(
        @Valid @RequestBody request: QuickClientRequest
    ): Client {
        return clientService.saveQuick(request)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: UpdateClientRequest): Client {
        return clientService.update(id, request)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        return clientService.delete(id)
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long) = searchClientService.findById(id)

    @GetMapping("/{id}/history")
    fun getHistory(@PathVariable id: Long) = clientService.getHistory(id)

    @GetMapping("/history/all")
    fun getGlobalHistory() = clientService.getGlobalHistory()

    @GetMapping()
    fun getAll(@RequestParam(required = false) name: String?) = searchClientService.findAll(name)
}