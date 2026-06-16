package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.CreatePropertyRequest
import br.com.horys.metro.controllers.requests.UpdatePropertyRequest
import br.com.horys.metro.controllers.response.PropertyResponse
import br.com.horys.metro.models.Property
import br.com.horys.metro.services.PropertyService
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
@RequestMapping("/v1/properties")
class PropertyController(
    private val service: PropertyService
) {

    @PostMapping
    fun save(
        @Valid @RequestBody request: CreatePropertyRequest
    ): PropertyResponse {
        return PropertyResponse.fromModel(service.save(request))
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long) = PropertyResponse.fromModel(service.findById(id))

    @GetMapping
    fun findAll(
        @RequestParam(required = false) description: String?,
        @RequestParam(required = false) ownerName: String?,
    ) = service.findAll(
        description = description,
        ownerName = ownerName
    ).map { PropertyResponse.fromModel(it) }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: UpdatePropertyRequest): Property {
        return service.update(id, request)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        return service.delete(id)
    }
}