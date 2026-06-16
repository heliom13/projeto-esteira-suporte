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
@Table(name = "consignments")
data class Consignment(
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
)
