package br.com.horys.metro.controllers.proposal.requests

import br.com.horys.metro.models.ProposalAsset
import br.com.horys.metro.models.ProposalBank
import br.com.horys.metro.models.ProposalProduct
import java.math.BigDecimal

data class FinancingRequest(
    val clientId: Long,
    val bank: ProposalBank,
    val price: BigDecimal,
    val term: Int,
    val asset: ProposalAsset,
    val propertyId: Long,
    val sellerId: Long,
    val modality: String,
    val product: ProposalProduct
)