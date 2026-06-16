package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.Process
import br.com.horys.metro.models.ProcessStep
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit


class ProcessExternalResponse(
    val id: String,
    val stepCurrentId: Long,
    val stepCurrent: String,
    val stepStatus: String,
    val status: String,
    val name: String,
    val processId: String,
    val sellerMain: String,
    val sellerSecondary: String,
    val totalDays: Int,
    val daysCompleted: Int,
    val createdAt: LocalDateTime
) {
    class StepResponse(
        val id: Long,
        val orderStep: Double,
        val deadline: Int,
        val daysCompleted: Int,
        val stepWay: String,
        val step: String,
        val flow: String,
        val stepCurrentId: Long,
        val stepCurrent: String,
        val stepStatus: String,
        val stepUnforeseenDescription: String?,
        val stepCompleted: String
    ) {
        companion object {
            fun fromModel(model: ProcessStep) =
                StepResponse(
                    id = model.step.id!!,
                    orderStep = model.orderStep,
                    deadline = model.step.deadline,
                    step = model.step.description,
                    flow = model.process.flow.description,
                    daysCompleted = ChronoUnit.DAYS.between(model.createdAt, model.updatedAt).toInt(),
                    stepWay = "${model.orderStep.toInt()}/${model.process.totalSteps}",
                    stepCurrentId = model.step.id,
                    stepCurrent = model.getDescriptionStep(),
                    stepStatus = model.step.status.toString(),
                    stepCompleted = model.status.toString(),
                    stepUnforeseenDescription = model.reasonUnforeseen
                )
        }
    }

    companion object {
        fun fromModel(model: Process) =
            ProcessExternalResponse(
                id = model.id.toString(),
                stepCurrentId = model.processStepCurrent!!.step.id!!,
                stepCurrent = model.processStepCurrent.getDescriptionStep(),
                stepStatus = model.stepCurrent.status.toString(),
                status = model.status.toString(),
                name = model.property?.description ?: "",
                sellerMain = model.sellerMain?.name ?: "",
                sellerSecondary = model.sellerSecondary?.name ?: "",
                createdAt = model.createdAt,
                processId = model.externalId,
                totalDays = model.totalDays,
                daysCompleted = ChronoUnit.DAYS.between(model.createdAt, model.updatedAt).toInt()
            )
    }
}
