package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.SellerRequest
import br.com.horys.metro.controllers.response.SellerResponse
import br.com.horys.metro.services.SellerService
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
@RequestMapping("/v1/sellers")
class SellerController(
    private val service: SellerService
) {
    @GetMapping
    fun findAll(
        @RequestParam(required = false) name: String?
    ): List<SellerResponse> {
        return service.findAll(name).map { SellerResponse.fromModel(it)!! }
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): SellerResponse {
        return SellerResponse.fromModel(service.findById(id))!!
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody @Valid request: SellerRequest): SellerResponse {
        return SellerResponse.fromModel(service.update(id, request))!!
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        return service.delete(id)
    }

    @PostMapping
    fun save(@RequestBody @Valid request: SellerRequest): SellerResponse {
        return SellerResponse.fromModel(service.save(request))!!
    }

}