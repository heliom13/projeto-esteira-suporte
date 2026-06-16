package br.com.horys.metro.controllers.requests.process

import br.com.horys.metro.models.Step
import java.time.LocalDateTime
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Positive

class StepRequest(
    @field:NotBlank val description: String,
    @field:Positive val deadLine: Int,
    val requiredDocument: Boolean,
    val documents: List<Long>
) {
    fun toModel(): Step {
        return Step(
            description = this.description,
            deadline = this.deadLine,
            requiredDocument = this.requiredDocument,
            id = null,
            status = Step.Status.NORMAL,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
    }

    fun toModel2(): Step {
        return Step(
            description = this.description,
            deadline = this.deadLine,
            requiredDocument = this.requiredDocument,
            id = null,
            status = Step.Status.UNFORESEEN,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
    }
}
