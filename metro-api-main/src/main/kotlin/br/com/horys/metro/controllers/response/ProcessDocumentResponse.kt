package br.com.horys.metro.controllers.response

class ProcessDocumentResponse(
    val processId: Long,
    val clientId: Long,
    val clientName: String,
    val propertyId: Long,
    val propertyName: String,
    val documents: List<String>
)
