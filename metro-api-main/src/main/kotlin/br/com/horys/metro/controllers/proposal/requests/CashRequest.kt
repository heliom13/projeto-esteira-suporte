package br.com.horys.metro.controllers.proposal.requests

import br.com.horys.metro.models.ProposalAsset

data class CashRequest(
    val clientId: Long,
    val propertyId: Long,
    val sellerId: Long,
    val zone: String,
    val asset: ProposalAsset
)