package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.Property
import java.math.BigDecimal

class PropertyResponse(
    val id: Long,
    val externalId: String,
    val description: String,
    val address: String,
    val ownerName: String,
    val ownerDocument: String,
    val price: BigDecimal,
    val financialPrice: BigDecimal,
    val email: String,
    val bank: String?,
    val accountBank: String?,
    val accountNumberBank: String?,
    val linkDrive: String?,
    val phone: String,
    val nameSecondary: String?,
    val emailSecondary: String?,
    val phoneSecondary: String?,
    val pix: String?,
    val maritalStatus: String,
) {
    companion object {
        fun fromModel(model: Property): PropertyResponse {
            return PropertyResponse(
                id = model.id!!,
                externalId = model.externalId,
                description = model.description,
                address = model.address,
                ownerName = model.ownerName,
                ownerDocument = model.ownerDocument,
                price = model.price,
                financialPrice = model.financialPrice,
                email = model.email,
                bank = model.bank,
                accountBank = model.accountBank,
                accountNumberBank = model.accountNumberBank,
                linkDrive = model.linkDrive,
                phone = model.phone,
                nameSecondary = model.nameSecondary,
                emailSecondary = model.emailSecondary,
                phoneSecondary = model.phoneSecondary,
                maritalStatus = model.maritalStatus.toString(),
                pix = model.pix
            )
        }
    }
}