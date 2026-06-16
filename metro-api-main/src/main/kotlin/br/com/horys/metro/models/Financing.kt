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
@Table(name = "financings")
data class Financing(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @ManyToOne
    @JoinColumn(name = "proposal_id", nullable = false)
    val proposal: Proposal,
    @Enumerated(EnumType.STRING)
    val bank: ProposalBank,
    val price: BigDecimal,
    val term: Int,
    @Enumerated(EnumType.STRING)
    val asset: ProposalAsset,
    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    val property: Property,
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    val seller: Seller,
    val modality: String,
    @Enumerated(EnumType.STRING)
    val product: ProposalProduct
)