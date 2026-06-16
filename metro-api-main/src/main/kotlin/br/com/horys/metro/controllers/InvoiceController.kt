package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.process.InvoiceRequest
import br.com.horys.metro.controllers.response.InvoiceResponse
import br.com.horys.metro.services.InvoiceService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/invoices")
class InvoiceController(val invoiceService: InvoiceService) {

    @PostMapping
    fun save(@RequestBody invoiceRequest: InvoiceRequest): InvoiceResponse {
        return invoiceService.save(invoiceRequest)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        invoiceService.delete(id);
    }


    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): InvoiceResponse {
        return invoiceService.findById(id);
    }

}