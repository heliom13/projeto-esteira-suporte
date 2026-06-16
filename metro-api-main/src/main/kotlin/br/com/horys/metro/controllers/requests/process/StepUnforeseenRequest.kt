package br.com.horys.metro.controllers.requests.process

import javax.validation.constraints.NotBlank
import javax.validation.constraints.Positive

class StepUnforeseenRequest(
    @field:NotBlank val reason: String,
    @field:Positive val deadLine: Int
)
