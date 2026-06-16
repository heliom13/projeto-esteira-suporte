package br.com.horys.metro.models

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
@Table(name = "cashes")
data class Cash(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    val proposal: Proposal,
    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    val property: Property,
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    val seller: Seller,
    val zone: String,
    @Enumerated(EnumType.STRING)
    val asset: ProposalAsset
)