package br.com.horys.metro.models

import java.math.BigDecimal
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

@Entity
@Table(name = "regularizations")
data class Regularization(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @ManyToOne
    @JoinColumn(name = "proposal_id", nullable = false)
    val proposal: Proposal,
    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    val property: Property,
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    val seller: Seller,
    val registration: String,
    val service: String,
    val price: BigDecimal,
    val payment: String
) {
}