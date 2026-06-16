package br.com.horys.metro.models

import java.math.BigDecimal
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

@Entity
@Table(name = "contracts")
data class Contract(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @ManyToOne
    @JoinColumn(name = "proposal_id", nullable = false)
    val proposal: Proposal,
    @Enumerated(EnumType.STRING)
    val bank: ProposalBank,
    val price: BigDecimal,
    @Enumerated(EnumType.STRING)
    val asset: ProposalAsset,
    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    val property: Property,
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    val seller: Seller,
    @Enumerated(EnumType.STRING)
    val model: ContractModel,
    val entry: String
) {
    enum class ContractModel {
        PRESTACAO_DE_SERVICO,
        COMPRA_E_VENDA,
        ADITIVO,
        KIT_CPS_E_CCV,
        LOCACAO
    }
}