package br.com.horys.metro.controllers.proposal.requests

import br.com.horys.metro.models.ProposalBank
import br.com.horys.metro.models.ProposalProduct
import java.math.BigDecimal

data class LoanRequest(
    val clientId: Long,
    val bank: ProposalBank,
    val price: BigDecimal,
    val term: Int,
    val product: ProposalProduct
)