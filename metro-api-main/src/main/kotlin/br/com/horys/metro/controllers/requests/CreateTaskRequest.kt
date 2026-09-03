package br.com.horys.metro.controllers.requests

import javax.validation.constraints.NotBlank

class CreateTaskRequest(
    @field:NotBlank val title: String,
    val description: String?,
    @field:NotBlank val assignedToUsername: String,
    val dueDate: String?
)
