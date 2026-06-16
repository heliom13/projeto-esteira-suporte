package br.com.horys.metro.controllers.proposal.requests

import br.com.horys.metro.models.Contract.ContractModel
import br.com.horys.metro.models.ProposalAsset
import br.com.horys.metro.models.ProposalBank
import java.math.BigDecimal

data class ContractRequest(
    val clientId: Long,
    val bank: ProposalBank,
    val price: BigDecimal,
    val asset: ProposalAsset,
    val propertyId: Long,
    val sellerId: Long,
    val model: ContractModel,
    val entry: String
)