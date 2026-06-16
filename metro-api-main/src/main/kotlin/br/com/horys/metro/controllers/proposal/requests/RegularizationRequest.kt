package br.com.horys.metro.controllers.proposal.requests

import java.math.BigDecimal

data class RegularizationRequest(
    val clientId: Long,
    val propertyId: Long,
    val price: BigDecimal,
    val registration: String,
    val sellerId: Long,
    val service: String,
    val payment: String
)