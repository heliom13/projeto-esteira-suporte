package br.com.horys.metro.services

import br.com.horys.metro.controllers.client.CreateClientRequest
import br.com.horys.metro.controllers.client.UpdateClientRequest
import br.com.horys.metro.exceptions.ClientNotFoundException
import br.com.horys.metro.models.Client
import br.com.horys.metro.repositories.ClientRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class ClientService(
    private val clientRepository: ClientRepository,
    private val searchClientService: SearchClientService
) {

    fun save(request: CreateClientRequest): Client {
        return clientRepository.save(request.toModel())
    }

    fun update(id: Long, request: UpdateClientRequest): Client {
        val client = searchClientService.findById(id)
        return clientRepository.save(
            client.copy(
                name = request.name,
                document = request.document,
                birthday = LocalDate.parse(request.birthday),
                email = request.email,
                phone = request.phone,
                address = request.address,
                maritalStatus = request.maritalStatus,
                job = request.job,
                updatedAt = LocalDateTime.now(),
                nameSecondary = request.nameSecondary,
                phoneSecondary = request.phoneSecondary,
                emailSecondary = request.emailSecondary,
                linkDrive = request.linkDrive
            )
        )
    }

    fun delete(id: Long) {
        val client = searchClientService.findById(id)
        clientRepository.save(
            client.copy(
                active = false,
                deletedAt = LocalDateTime.now()
            )
        )
    }

    fun findById(clientId: Long): Client {
        return clientRepository.findById(clientId).orElseThrow { throw ClientNotFoundException() }
    }
}
