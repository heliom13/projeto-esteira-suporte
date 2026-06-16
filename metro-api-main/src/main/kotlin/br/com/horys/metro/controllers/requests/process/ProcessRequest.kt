package br.com.horys.metro.controllers.requests.process

class ProcessRequest(
    val flowId: Long,
    val propertyId: Long?,
    val clientId: Long?,
    val sellerMainId: Long?,
    val sellerSecondaryId: Long?,
    val linkDrive: String?
)
