package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.FlowType

class FlowResponse(
    val id: Long,
    val description: String,
    val typeFlow: FlowType,
    val sendMessage: Boolean,
    val steps: List<Step>
) {
    class Step(
        val id: Long,
        val description: String,
        val order: Double,
        val deadline: Int,
        val requiredDocument: Boolean
    )

}
