package br.com.horys.metro.controllers.handlers

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.OffsetDateTime

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Problem(
    val status: Int,
    val timestamp: OffsetDateTime,
    val message: String? = null,
    val objects: List<Object>? = null
) {
    data class Object(
        val name: String,
        val message: String
    )
}
