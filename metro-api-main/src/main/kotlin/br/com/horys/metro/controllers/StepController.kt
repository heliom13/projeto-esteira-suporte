package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.process.StepRequest
import br.com.horys.metro.controllers.response.StepResponse
import br.com.horys.metro.models.Step
import br.com.horys.metro.services.StepService
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.DeleteMapping
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
@RequestMapping("/v1/steps")
class StepController(
    private val service: StepService
) {

    @GetMapping
    fun findAll(@RequestParam(required = false) description: String?, pageable: Pageable): List<Step> {

        return service.findAll(description, pageable)
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): StepResponse {
        return service.getById(id)
    }

    @PostMapping
    fun save(
        @Valid @RequestBody request: StepRequest,
    ): StepResponse {
        return service.save(request)
    }

    @PostMapping("/nus")
    fun saves(
        @Valid @RequestBody request: StepRequest,
    ): Step {
        return service.saves(request)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: StepRequest): StepResponse {
        return service.update(id, request)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        service.delete(id)
    }
}
