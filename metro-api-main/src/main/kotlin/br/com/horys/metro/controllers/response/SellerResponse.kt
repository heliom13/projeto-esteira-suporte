package br.com.horys.metro.controllers.response

import br.com.horys.metro.models.Seller

class SellerResponse(
    val id: Long,
    val name: String,
    val document: String,
    val email: String,
    val emailOther: String?,
    val phone: String,
    val otherPhone: String?,
    val bank: String?,
    val accountBank: String?,
    val accountNumberBank: String?,
    val pix: String?,
    val externalId: String,
    val creci: String?
) {

    companion object {
        fun fromModel(seller: Seller?): SellerResponse? {
            return seller?.let {
                return SellerResponse(
                    id = seller.id!!,
                    name = seller.name,
                    document = seller.document,
                    email = seller.email,
                    emailOther = seller.emailOther,
                    phone = seller.phone,
                    otherPhone = seller.otherPhone,
                    externalId = seller.externalId,
                    bank = seller.bank,
                    accountNumberBank = seller.accountNumberBank,
                    accountBank = seller.accountBank,
                    creci = seller.creci,
                    pix = seller.pix
                )
            }
        }
    }
}