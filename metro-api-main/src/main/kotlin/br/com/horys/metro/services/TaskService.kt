package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.CreateTaskRequest
import br.com.horys.metro.controllers.requests.TransferTaskRequest
import br.com.horys.metro.controllers.response.TaskResponse
import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.models.Task
import br.com.horys.metro.models.User
import br.com.horys.metro.repositories.TaskRepository
import br.com.horys.metro.repositories.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val userRepository: UserRepository,
    private val userService: UserService
) {

    fun create(request: CreateTaskRequest): TaskResponse {
        val currentUser = userService.getLoggedInUser()
        if (currentUser.role != User.Role.ADMIN) {
            throw BusinessException("Apenas administradores podem atribuir tarefas")
        }

        val assignedTo = userRepository.findByUsername(request.assignedToUsername)
            .orElseThrow { BusinessException("Usuário mencionado não encontrado") }

        val task = taskRepository.save(
            Task(
                id = null,
                title = request.title,
                description = request.description,
                assignedBy = currentUser,
                assignedTo = assignedTo,
                status = Task.Status.PENDING,
                dueDate = request.dueDate?.let { LocalDate.parse(it) },
                seen = false,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        )

        return toResponse(task)
    }

    fun getMine(): List<TaskResponse> {
        val user = userService.getLoggedInUser()
        return taskRepository.findByAssignedTo_IdOrderByCreatedAtDesc(user.id!!).map { toResponse(it) }
    }

    fun getAssignedByMe(): List<TaskResponse> {
        val user = userService.getLoggedInUser()
        return taskRepository.findByAssignedBy_IdOrderByCreatedAtDesc(user.id!!).map { toResponse(it) }
    }

    fun countUnseen(): Long {
        val user = userService.getLoggedInUser()
        return taskRepository.countByAssignedTo_IdAndSeenFalse(user.id!!)
    }

    fun complete(id: Long) {
        val user = userService.getLoggedInUser()
        val task = taskRepository.findById(id).orElseThrow { BusinessException("Tarefa não encontrada") }
        if (task.assignedTo.id != user.id) {
            throw BusinessException("Você não pode concluir uma tarefa que não é sua")
        }
        taskRepository.save(task.copy(status = Task.Status.DONE, updatedAt = LocalDateTime.now()))
    }

    fun markAllMineSeen() {
        val user = userService.getLoggedInUser()
        taskRepository.findByAssignedTo_IdOrderByCreatedAtDesc(user.id!!)
            .filter { !it.seen }
            .forEach { taskRepository.save(it.copy(seen = true)) }
    }

    fun transfer(id: Long, request: TransferTaskRequest) {
        val currentUser = userService.getLoggedInUser()
        val task = taskRepository.findById(id).orElseThrow { BusinessException("Tarefa não encontrada") }

        val isOwner = task.assignedTo.id == currentUser.id
        val isAdmin = currentUser.role == User.Role.ADMIN
        if (!isOwner && !isAdmin) {
            throw BusinessException("Você não pode transferir uma tarefa que não é sua")
        }
        if (task.status == Task.Status.DONE) {
            throw BusinessException("Não é possível transferir uma tarefa já concluída")
        }

        val newAssignee = userRepository.findByUsername(request.assignedToUsername)
            .orElseThrow { BusinessException("Usuário mencionado não encontrado") }

        if (newAssignee.id == task.assignedTo.id) {
            throw BusinessException("Escolha outro usuário para transferir a tarefa")
        }

        taskRepository.save(
            task.copy(
                assignedTo = newAssignee,
                transferredBy = currentUser,
                seen = false,
                updatedAt = LocalDateTime.now()
            )
        )
    }

    private fun toResponse(task: Task) = TaskResponse(
        id = task.id!!,
        title = task.title,
        description = task.description,
        assignedByName = task.assignedBy.name,
        assignedToName = task.assignedTo.name,
        assignedToUsername = task.assignedTo.username,
        status = task.status.name,
        dueDate = task.dueDate,
        seen = task.seen,
        transferredByName = task.transferredBy?.name,
        createdAt = task.createdAt
    )
}
