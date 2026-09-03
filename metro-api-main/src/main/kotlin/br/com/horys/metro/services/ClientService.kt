package br.com.horys.metro.services

import br.com.horys.metro.controllers.client.CreateClientRequest
import br.com.horys.metro.controllers.client.QuickClientRequest
import br.com.horys.metro.controllers.client.UpdateClientRequest
import br.com.horys.metro.controllers.response.ClientHistoryResponse
import br.com.horys.metro.exceptions.ClientNotFoundException
import br.com.horys.metro.models.Client
import br.com.horys.metro.models.Notification
import br.com.horys.metro.repositories.ClientRepository
import br.com.horys.metro.repositories.NotificationRepository
import br.com.horys.metro.repositories.ProcessRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class ClientService(
    private val clientRepository: ClientRepository,
    private val searchClientService: SearchClientService,
    private val userService: UserService,
    private val processRepository: ProcessRepository,
    private val notificationRepository: NotificationRepository
) {

    fun save(request: CreateClientRequest): Client {
        return clientRepository.save(request.toModel().copy(createdBy = userService.getLoggedInUser()))
    }

    fun saveQuick(request: QuickClientRequest): Client {
        return clientRepository.save(request.toModel().copy(createdBy = userService.getLoggedInUser()))
    }

    fun update(id: Long, request: UpdateClientRequest): Client {
        val client = searchClientService.findById(id)
        return clientRepository.save(
            client.copy(
                name = request.name,
                document = request.document,
                birthday = request.birthday?.let { LocalDate.parse(it) },
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

    fun getHistory(clientId: Long): List<ClientHistoryResponse> {
        val client = findById(clientId)
        val destinies = listOf(Notification.Destiny.HISTORY, Notification.Destiny.NOTIFICATION_AND_HISTORY)

        val entries = mutableListOf(
            ClientHistoryResponse(
                type = "CLIENT_CREATED",
                description = "Cliente cadastrado",
                userName = client.createdBy?.name,
                createdAt = client.createdAt,
                clientId = client.id,
                clientName = client.name
            )
        )

        processRepository.findByClient_Id(clientId).forEach { process ->
            notificationRepository.findByProcessIdOrderByCreatedAtDesc(process.id!!, destinies).forEach {
                entries.add(
                    ClientHistoryResponse(
                        type = it.type.name,
                        description = it.description,
                        userName = it.userOrigin.name,
                        createdAt = it.createdAt,
                        clientId = client.id,
                        clientName = client.name,
                        flowType = it.process.flow.type.description
                    )
                )
            }
        }

        return entries.sortedByDescending { it.createdAt }
    }

    fun getGlobalHistory(): List<ClientHistoryResponse> {
        val destinies = listOf(Notification.Destiny.HISTORY, Notification.Destiny.NOTIFICATION_AND_HISTORY)
        val entries = mutableListOf<ClientHistoryResponse>()

        clientRepository.findAll().forEach { client ->
            entries.add(
                ClientHistoryResponse(
                    type = "CLIENT_CREATED",
                    description = "Cliente cadastrado",
                    userName = client.createdBy?.name,
                    createdAt = client.createdAt,
                    clientId = client.id,
                    clientName = client.name
                )
            )
        }

        notificationRepository.findTop300ByDestinyInOrderByCreatedAtDesc(destinies).forEach {
            entries.add(
                ClientHistoryResponse(
                    type = it.type.name,
                    description = it.description,
                    userName = it.userOrigin.name,
                    createdAt = it.createdAt,
                    clientId = it.process.client?.id,
                    clientName = it.process.client?.name,
                    flowType = it.process.flow.type.description
                )
            )
        }

        return entries.sortedByDescending { it.createdAt }.take(300)
    }
}
