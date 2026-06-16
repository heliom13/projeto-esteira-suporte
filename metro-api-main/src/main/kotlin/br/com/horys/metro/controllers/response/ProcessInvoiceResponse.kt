package br.com.horys.metro.controllers.response

import java.time.LocalDateTime

data class ProcessInvoiceResponse(
    val id: Long,
    val client: ProcessResponse.ProcessClientResponse,
    val stepCurrent: ProcessResponse.StepCurrentResponse,
    val status: String,
    val externalId: String,
    val property: ProcessResponse.ProcessPropertyResponse,
    val sellerMain: SellerResponse?,
    val sellerSecondary: SellerResponse?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val invoiceId: Long
)
