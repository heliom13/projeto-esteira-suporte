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
@Table(name = "consortiums")
data class Consortium(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    val proposal: Proposal,
    @Enumerated(EnumType.STRING)
    val bank: ProposalBank,
    val price: BigDecimal,
    val term: Int,
    @Enumerated(EnumType.STRING)
    val asset: ProposalAsset
)