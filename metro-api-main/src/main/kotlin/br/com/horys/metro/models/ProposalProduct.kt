package br.com.horys.metro.models

import br.com.horys.metro.models.Proposal.Type.FINANCING
import br.com.horys.metro.models.Proposal.Type.LOAN

enum class ProposalProduct(vararg val types: Proposal.Type) {
    MCMV(LOAN),
    SBPE(LOAN),
    ADJUDICADO(LOAN),
    PRO_COTISTA(LOAN),
    COMUM(LOAN, FINANCING),
    CRF_CAIXA(FINANCING),
    CDC_CAIXA(FINANCING);

    companion object {
        fun getByType(type: Proposal.Type): List<ProposalProduct> {
            return values().filter { it.types.contains(type) }
        }
    }
}