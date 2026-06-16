package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.Notification
import java.time.LocalDateTime

class NotificationResponse(
    val id: Long?,
    val description: String,
    val stepCurrent: String,
    val destiny: String,
    val type: String,
    val processId: Long?,
    val userOriginId: Long?,
    val userOriginName: String?,
    val userDestinyId: Long?,
    val userDestinyName: String?,
    val flowType: String?,
    val currentStepName: String?,
    val deadlineStatus: String?,
    val read: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun fromModel(notification: Notification) = NotificationResponse(
            id = notification.id,
            description = notification.description,
            stepCurrent = notification.stepCurrent,
            destiny = notification.destiny.name,
            type = notification.type.description,
            processId = notification.process.id,
            userOriginId = notification.userOrigin.id,
            userOriginName = notification.userOrigin.name,
            userDestinyId = notification.userDestiny.id,
            userDestinyName = notification.userDestiny.name,
            flowType = notification.process.flow.type.description,
            currentStepName = notification.process.processStepCurrent?.getDescriptionStep(),
            deadlineStatus = calculateDeadlineStatus(notification),
            read = notification.read,
            createdAt = notification.createdAt,
            updatedAt = notification.updatedAt
        )

        private fun calculateDeadlineStatus(notification: Notification): String? {
            val processStepCurrent = notification.process.processStepCurrent ?: return null
            val stepDeadline = processStepCurrent.step.deadline
            val deadlineDate = processStepCurrent.createdAt.plusDays(stepDeadline.toLong())
            return if (LocalDateTime.now().isAfter(deadlineDate)) "Atrasado" else "No Prazo"
        }
    }


}