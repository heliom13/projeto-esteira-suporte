package br.com.horys.metro.models

import javax.persistence.*

@Entity
@Table(name = "commissions")
data class Commission(
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id val id: Long?,
    val description: String,
    val value: Double,
    @ManyToOne
    val invoice: Invoice
)
