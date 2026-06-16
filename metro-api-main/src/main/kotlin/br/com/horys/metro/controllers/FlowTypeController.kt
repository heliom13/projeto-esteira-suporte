package br.com.horys.metro.controllers

import br.com.horys.metro.models.FlowType
import br.com.horys.metro.repositories.FlowTypeRepository
import org.springframework.data.domain.Sort
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/flowTypes")
class FlowTypeController(
    private val flowTypeRepository: FlowTypeRepository
) {
    @GetMapping
    fun findAll(): List<FlowType> = flowTypeRepository.findAll(Sort.by(Sort.Order.asc("description")))
}