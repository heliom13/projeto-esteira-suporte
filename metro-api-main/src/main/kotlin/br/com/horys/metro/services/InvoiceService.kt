package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.process.InvoiceRequest
import br.com.horys.metro.controllers.response.CommissionResponse
import br.com.horys.metro.controllers.response.InvoiceResponse
import br.com.horys.metro.controllers.response.ProcessInvoiceResponse
import br.com.horys.metro.controllers.response.ProcessResponse
import br.com.horys.metro.controllers.response.SellerResponse
import br.com.horys.metro.controllers.response.StepResponse
import br.com.horys.metro.exceptions.InvoiceNotFoundException
import br.com.horys.metro.models.Commission
import br.com.horys.metro.models.Invoice
import br.com.horys.metro.repositories.CommissionRepository
import br.com.horys.metro.repositories.InvoiceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class InvoiceService(
    private val invoiceRepository: InvoiceRepository,
    private val commissionRepository: CommissionRepository,
    private val processService: ProcessService
) {
    @Transactional
    fun save(invoiceRequest: InvoiceRequest): InvoiceResponse {
        val sale = processService.findById(invoiceRequest.processId)

        val invoice = invoiceRepository.save(
            Invoice(
                id = null,
                fee = invoiceRequest.fee,
                invoiceNumber = 0,
                value = invoiceRequest.value,
                createdAt = LocalDateTime.now(),
                processId = sale,
                commission = null
            )
        )

        invoiceRequest.commission.forEach {
            commissionRepository.save(
                Commission(
                    id = null,
                    description = it.description,
                    value = it.value,
                    invoice = invoice
                )
            )
        }
        return InvoiceResponse(
            id = invoice.id!!,
            fee = invoice.fee,
            value = invoice.value,
            processId = sale.id!!,
            commissions = emptyList()
        )
    }

    fun findById(id: Long): InvoiceResponse {
        val invoice = invoiceRepository.findById(id).orElseThrow { InvoiceNotFoundException() }
        return InvoiceResponse(
            id = invoice.id!!,
            processId = invoice.processId.id!!,
            fee = invoice.fee,
            value = invoice.value,
            commissions = invoice.commission!!.map {
                CommissionResponse(
                    it.id!!,
                    it.description,
                    it.value
                )
            }
        )
    }


    fun findByIdVenda(id: Long): InvoiceResponse {
        val invoice = invoiceRepository.findInvoiceByProcessId(id).orElseThrow { InvoiceNotFoundException() }
        return InvoiceResponse(
            id = invoice.id!!,
            processId = invoice.processId.id!!,
            fee = invoice.fee,
            value = invoice.value,
            commissions = invoice.commission!!.map {
                CommissionResponse(
                    it.id!!,
                    it.description,
                    it.value
                )
            }
        )
    }

    fun findAll(): List<ProcessInvoiceResponse> {
        val invoices = this.invoiceRepository.findAll()
        if (invoices.isEmpty())
            throw InvoiceNotFoundException()
        val response = invoices.map {
            ProcessInvoiceResponse(
                id = it.processId.id!!,
                client = ProcessResponse.ProcessClientResponse(
                    id = it.processId.client?.id!!,
                    name = it.processId.client.name
                ),
                stepCurrent = ProcessResponse.StepCurrentResponse(
                    id = it.processId.stepCurrent.id!!,
                    orderStep = it.processId.orderCurrent,
                    deadline = it.processId.stepCurrent.deadline,
                    step = StepResponse.fromModel(it.processId.stepCurrent, null),
                    flow = it.processId.flow.description,
                    flowType = it.processId.flow.type.description,
                    status = it.processId.stepCurrent.status
                ),
                createdAt = it.processId.createdAt,
                status = it.processId.status.name,
                externalId = it.processId.externalId,
                property = ProcessResponse.ProcessPropertyResponse(
                    id = it.processId.id,
                    name = it.processId.property?.ownerName
                ),
                sellerMain = SellerResponse.fromModel(it.processId.sellerMain),
                sellerSecondary = SellerResponse.fromModel(it.processId.sellerMain),
                updatedAt = it.processId.updatedAt,
                invoiceId = it.id!!
            )
        }
        return response;
    }

    fun delete(id: Long) {
        val invoice = invoiceRepository.findById(id).orElseThrow { InvoiceNotFoundException() }
        invoice.commission?.forEach { commissionRepository.delete(it) }
        invoiceRepository.delete(invoice)
    }
}

