package br.com.horys.metro.models

import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.OneToMany
import javax.persistence.OneToOne
import javax.persistence.Table

@Entity
@Table(name = "invoices")
data class Invoice(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val fee: BigDecimal,
    val invoiceNumber: Long,
    val createdAt: LocalDateTime,
    val value: Double,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", referencedColumnName = "id")
    val processId: Process,
    @OneToMany(mappedBy = "invoice", fetch = FetchType.LAZY)
    val commission: List<Commission>? = emptyList()
)
