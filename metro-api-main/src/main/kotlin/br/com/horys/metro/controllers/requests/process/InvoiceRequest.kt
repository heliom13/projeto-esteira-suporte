package br.com.horys.metro.controllers.requests.process

import br.com.horys.metro.controllers.requests.CommissionRequest
import java.math.BigDecimal

class InvoiceRequest(
    val fee: BigDecimal,
    val value: Double,
    val processId: Long,
    val commission: List<CommissionRequest>
)