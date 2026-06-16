package br.com.horys.metro.controllers.response

import com.fasterxml.jackson.annotation.JsonInclude
import java.math.BigDecimal

class InvoiceResponse(
    val id: Long,
    val fee: BigDecimal,
    val value: Double,
    val processId: Long,
    @JsonInclude(JsonInclude.Include.NON_EMPTY) val commissions: List<CommissionResponse>
) {
}