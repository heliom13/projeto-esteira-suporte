package br.com.horys.metro.repositories

import br.com.horys.metro.models.Property
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface PropertyRepository : JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    fun findByExternalId(externalId: String): Property?
    fun findAllByActiveIsTrueOrderByDescription(): List<Property>
}
