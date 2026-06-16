package br.com.horys.metro.controllers.requests.process

class FlowRequest(
    val typeFlowId: Long,
    val sendMessage: Boolean,
    val description: String,
    val steps: List<StepOrderRequest>
) {
}
