package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.Step
import br.com.horys.metro.models.StepDocument
import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
class StepResponse(
    val id: Long,
    val description: String,
    val deadline: Int,
    val requiredDocument: Boolean,
    val documents: List<String>?
) {
    companion object {
        fun fromModel(step: Step, documents: List<StepDocument>?): StepResponse {
            return StepResponse(
                id = step.id!!,
                description = step.description,
                deadline = step.deadline,
                requiredDocument = step.requiredDocument,
                documents = documents?.map { it.typeDocument.description }?.toList()
            )
        }
    }
}
