package br.com.horys.metro.controllers.response

import java.time.LocalDateTime

class ClientHistoryResponse(
    val type: String,
    val description: String,
    val userName: String?,
    val createdAt: LocalDateTime,
    val clientId: Long? = null,
    val clientName: String? = null,
    val flowType: String? = null
)
