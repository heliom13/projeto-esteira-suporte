package br.com.horys.metro.controllers.proposal.requests

import br.com.horys.metro.models.ProposalAsset
import br.com.horys.metro.models.ProposalBank
import java.math.BigDecimal

data class ConsortiumRequest(
    val clientId: Long,
    val bank: ProposalBank,
    val price: BigDecimal,
    val term: Int,
    val asset: ProposalAsset
)