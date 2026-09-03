package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.CreateTaskRequest
import br.com.horys.metro.controllers.requests.TransferTaskRequest
import br.com.horys.metro.services.TaskService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/v1/tasks")
class TaskController(
    private val taskService: TaskService
) {
    @PostMapping
    fun create(@Valid @RequestBody request: CreateTaskRequest) = taskService.create(request)

    @GetMapping("/mine")
    fun getMine() = taskService.getMine()

    @GetMapping("/assigned-by-me")
    fun getAssignedByMe() = taskService.getAssignedByMe()

    @GetMapping("/unseen-count")
    fun getUnseenCount() = mapOf("count" to taskService.countUnseen())

    @PutMapping("/{id}/complete")
    fun complete(@PathVariable id: Long) = taskService.complete(id)

    @PutMapping("/{id}/transfer")
    fun transfer(@PathVariable id: Long, @Valid @RequestBody request: TransferTaskRequest) =
        taskService.transfer(id, request)

    @PutMapping("/seen-all")
    fun markAllSeen() = taskService.markAllMineSeen()
}
