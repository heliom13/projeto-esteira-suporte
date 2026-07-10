package br.com.horys.metro.controllers.requests.process

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.Positive

class FlowBatchRequest(
    @field:Positive val typeFlowId: Long,
    @field:NotBlank val description: String,
    val sendMessage: Boolean = false,
    @field:NotEmpty val steps: List<StepBatchItem>
) {
    class StepBatchItem(
        @field:NotBlank val description: String,
        val observation: String? = null
    )
}
