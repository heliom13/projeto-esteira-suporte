package br.com.horys.metro.controllers.response

import java.time.LocalDate
import java.time.LocalDateTime

class TaskResponse(
    val id: Long,
    val title: String,
    val description: String?,
    val assignedByName: String,
    val assignedToName: String,
    val assignedToUsername: String,
    val status: String,
    val dueDate: LocalDate?,
    val seen: Boolean,
    val createdAt: LocalDateTime
)
