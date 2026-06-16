package br.com.horys.metro.controllers.proposal.requests

import br.com.horys.metro.models.ProposalBank
import java.math.BigDecimal

data class ConsignmentRequest(
    val clientId: Long,
    val bank: ProposalBank,
    val price: BigDecimal,
    val term: Int
)