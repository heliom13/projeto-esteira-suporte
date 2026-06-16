package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.process.ChangeUsersRequest
import br.com.horys.metro.controllers.requests.process.CommentRequest
import br.com.horys.metro.controllers.requests.process.NextStepRequest
import br.com.horys.metro.controllers.requests.process.ProcessRequest
import br.com.horys.metro.controllers.requests.process.StepUnforeseenRequest
import br.com.horys.metro.controllers.response.ProcessResponse
import br.com.horys.metro.services.ProcessService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/v1/processes")
class ProcessController(
    private val service: ProcessService
) {
    

    @PutMapping("/{id}/nexts")
    fun nextStep(@PathVariable id: Long, @RequestBody request: NextStepRequest): ProcessResponse {
        return ProcessResponse.fromModel(
            service.nextStep(id, request),
            isUserProcessOwner = true,
            emptyList(),
            emptyList()
        )
    }

    @PutMapping("/{id}/nexts/unforeseens")
    fun nextStep(@PathVariable id: Long, @Valid @RequestBody request: StepUnforeseenRequest) {
        service.createUnforeseen(id, request)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        service.delete(id)
    }

    @PatchMapping("/{id}/change-users")
    fun changeUsers(@PathVariable id: Long, @RequestBody request: ChangeUsersRequest) {
        service.changeUsers(id, request)
    }

    @PostMapping("/{id}/comments")
    fun addComment(@PathVariable id: Long, @RequestBody request: CommentRequest) {
        service.addComment(id, request)
    }
}
