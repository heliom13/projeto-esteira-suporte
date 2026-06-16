package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.Process
import java.time.LocalDateTime

class ProcessSellerExternalResponse(
    val id: String,
    val saleId: String,
    val stepCurrentId: Long,
    val stepCurrent: String,
    val stepStatus: String,
    val status: String,
    val client: String?,
    val property: String?,
    val createdAt: LocalDateTime
) {
    companion object {
        fun fromModel(model: Process, externalId: String) =
            ProcessSellerExternalResponse(
                id = externalId,
                stepCurrentId = model.stepCurrent.id!!,
                stepCurrent = model.processStepCurrent?.getDescriptionStep() ?: "",
                stepStatus = model.stepCurrent.status.toString(),
                status = model.status.toString(),
                client = model.client?.name,
                property = model.property?.description,
                createdAt = model.createdAt,
                saleId = model.externalId
            )
    }
}