package br.com.horys.metro.repositories

import br.com.horys.metro.models.Invoice
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface InvoiceRepository : JpaRepository<Invoice, Long> {
    fun findInvoiceByProcessId(saleId: Long): Optional<Invoice>
}