package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.Notification
import br.com.horys.metro.models.Process
import br.com.horys.metro.models.Step
import java.time.LocalDateTime

data class ProcessResponse(
    val id: Long,
    val client: ProcessClientResponse?,
    val stepCurrent: StepCurrentResponse,
    val status: String,
    val externalId: String,
    val property: ProcessPropertyResponse?,
    val sellerMain: SellerResponse?,
    val sellerSecondary: SellerResponse?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val nameUser: String,
    val isUserProcessOwner: Boolean,
    val notifications: List<NotificationResponse>,
    val sendMessage: Boolean,
    val comments: List<CommentResponse>
) {

    class ProcessClientResponse(
        val id: Long,
        val name: String
    )

    class ProcessPropertyResponse(
        val id: Long,
        val name: String?
    )

    class StepCurrentResponse(
        val id: Long,
        val orderStep: Double,
        val deadline: Int,
        val step: StepResponse,
        val flow: String,
        val flowType: String,
        val status: Step.Status
    )

    companion object {
        fun fromModel(
            process: Process,
            isUserProcessOwner: Boolean,
            notifications: List<Notification>,
            comments: List<CommentResponse>
        ): ProcessResponse {
            return ProcessResponse(
                id = process.id!!,
                client = process.client?.let {
                    ProcessClientResponse(
                        id = it.id!!,
                        name = it.name
                    )
                },
                stepCurrent = StepCurrentResponse(
                    id = process.stepCurrent.id!!,
                    orderStep = process.orderCurrent,
                    deadline = process.stepCurrent.deadline,
                    step = StepResponse.fromModel(process.stepCurrent, null),
                    flow = process.flow.description,
                    flowType = process.flow.type.description,
                    status = process.stepCurrent.status
                ),
                createdAt = process.createdAt,
                updatedAt = process.updatedAt,
                status = process.status.name,
                property = process.property?.let {
                    ProcessPropertyResponse(
                        id = it.id!!,
                        name = it.ownerName
                    )
                },
                sellerMain = SellerResponse.fromModel(process.sellerMain),
                sellerSecondary = SellerResponse.fromModel(process.sellerMain),
                externalId = process.externalId,
                isUserProcessOwner = isUserProcessOwner,
                nameUser = process.user.name,
                notifications = notifications.map { NotificationResponse.fromModel(it) },
                sendMessage = process.flow.sendMessage,
                comments = comments
            )
        }
    }
}