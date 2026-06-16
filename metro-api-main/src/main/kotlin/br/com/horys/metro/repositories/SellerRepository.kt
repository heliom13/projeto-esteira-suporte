package br.com.horys.metro.repositories

import br.com.horys.metro.models.Seller
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface SellerRepository : JpaRepository<Seller, Long>, JpaSpecificationExecutor<Seller> {
    fun findByDocument(document: String): Seller?
    fun findAllByActiveIsTrueOrderByName(): List<Seller>
    fun findByExternalId(externalId: String): Seller?
}