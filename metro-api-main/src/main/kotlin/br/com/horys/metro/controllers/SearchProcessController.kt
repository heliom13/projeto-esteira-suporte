package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.response.CommentResponse
import br.com.horys.metro.controllers.response.InvoiceResponse
import br.com.horys.metro.controllers.response.ProcessDocumentResponse
import br.com.horys.metro.controllers.response.ProcessExternalResponse
import br.com.horys.metro.controllers.response.ProcessResponse
import br.com.horys.metro.controllers.response.ProcessSellerExternalResponse
import br.com.horys.metro.services.InvoiceService
import br.com.horys.metro.services.SearchProcessService
import br.com.horys.metro.services.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/processes")
class SearchProcessController(
    private val service: SearchProcessService,
    private val invoiceService: InvoiceService,
    private val userService: UserService
) {
    @GetMapping("/clients/{externalId}")
    fun findByClientExternalId(@PathVariable externalId: String): List<ProcessExternalResponse> {
        return service.findByClientExternalId(externalId).map { ProcessExternalResponse.fromModel(it) }
    }

    @GetMapping("/{id}/invoices")
    fun findByIdVendas(@PathVariable id: Long): InvoiceResponse {
        return invoiceService.findByIdVenda(id)
    }

    @GetMapping("/properties/{externalId}")
    fun findSalePropertyByExternalId(@PathVariable externalId: String): List<ProcessExternalResponse> {
        return service.findByPropertyExternalId(externalId).map { ProcessExternalResponse.fromModel(it) }
    }

    @GetMapping("/sellers/{externalId}")
    fun findProcessSellerByExternalId(@PathVariable externalId: String): List<ProcessSellerExternalResponse> {
        return service.findBySellerExternalId(externalId)
            .map { ProcessSellerExternalResponse.fromModel(it, externalId) }
    }

    @GetMapping
    fun findAll(
        @RequestParam(required = false) name: String?
    ): List<ProcessResponse> {
        val user = userService.getLoggedInUser()
        return service.findAll(name, user).map {
            ProcessResponse.fromModel(it, user == it.user, emptyList(), emptyList())
        }
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): ProcessResponse {
        return service.getProcessById(id)
    }

    @GetMapping("/{id}/steps")
    fun getFlowSteps(@PathVariable id: Long) = service.getSteps(id)

    @GetMapping("/external/{externalId}/steps")
    fun findSaleByExternalId(@PathVariable externalId: String): List<ProcessExternalResponse.StepResponse> {
        return service.getByExternalId(externalId).map { ProcessExternalResponse.StepResponse.fromModel(it) }
            .sortedBy { it.orderStep }
    }

    @GetMapping("/documents")
    fun getDocumentsByClient(@RequestParam clientId: Long): List<ProcessDocumentResponse> {
        return service.getDocumentsByClient(clientId)
    }

    @GetMapping("/{id}/comments")
    fun addComment(@PathVariable id: Long): List<CommentResponse> {
        val comments = service.getComments(id)
        return comments.map { comment ->
            val replies = service.getReplies(comment.id!!)
            CommentResponse.fromModel(comment, replies)
        }
    }
}