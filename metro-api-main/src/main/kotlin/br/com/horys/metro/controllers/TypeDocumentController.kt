package br.com.horys.metro.controllers

import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.models.TypeDocument
import br.com.horys.metro.repositories.TypeDocumentRepository
import org.springframework.data.domain.Sort
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid
import javax.validation.constraints.NotBlank

@RestController
@RequestMapping("/v1/typesDocument")
class TypeDocumentController(
    private val typeDocumentRepository: TypeDocumentRepository
) {

    @GetMapping
    fun findAll(): MutableList<TypeDocument> {
        return typeDocumentRepository.findAll(Sort.by("description"))
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): TypeDocument {
        return typeDocumentRepository.findById(id).orElseThrow { BusinessException("Tipo de documento não encontrado") }
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody @Valid request: TypeDocumentRequest): TypeDocument {

        val type =
            typeDocumentRepository.findById(id).orElseThrow { BusinessException("Tipo de documento não encontrado") }

        return typeDocumentRepository.save(
            type.copy(
                description = request.description
            )
        )
    }

    @PostMapping
    fun save(@RequestBody @Valid request: TypeDocumentRequest): TypeDocument {
        return typeDocumentRepository.save(
            TypeDocument(
                id = null,
                description = request.description
            )
        )
    }

    class TypeDocumentRequest(
        @field:NotBlank val description: String
    )
}