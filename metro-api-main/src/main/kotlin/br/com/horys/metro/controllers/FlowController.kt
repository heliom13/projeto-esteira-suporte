package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.process.FlowBatchRequest
import br.com.horys.metro.controllers.requests.process.FlowRequest
import br.com.horys.metro.controllers.response.FlowResponse
import br.com.horys.metro.models.FlowStep
import br.com.horys.metro.services.FlowService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/v1/flows")
class FlowController(
    private val service: FlowService
) {
    @PostMapping
    fun save(@Valid @RequestBody request: FlowRequest): FlowResponse {
        return service.save(request)
    }

    @PostMapping("/batch")
    fun saveBatch(@Valid @RequestBody request: FlowBatchRequest): FlowResponse {
        return service.saveBatch(request)
    }

    @PostMapping("/batch/upsert")
    fun upsertBatch(@Valid @RequestBody request: FlowBatchRequest): FlowResponse {
        return service.upsertBatch(request)
    }

    @PutMapping("/batch/{id}")
    fun updateBatch(@PathVariable id: Long, @Valid @RequestBody request: FlowBatchRequest): FlowResponse {
        return service.updateBatch(id, request)
    }

    @GetMapping
    fun findAll(
        @RequestParam(required = false) description: String?
    ) = service.findAll(description)

    @GetMapping("/{id}/steps")
    fun getSteps(@PathVariable id: Long): List<FlowStep> {
        return service.getSteps(id)
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): FlowResponse {
        return service.findById(id)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: FlowRequest): FlowResponse {
        return service.update(id, request)
    }

}
