package br.com.horys.metro.repositories

import br.com.horys.metro.models.Client
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface ClientRepository : JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {
    fun findByExternalId(externalId: String): Client?
    fun findAllByActiveIsTrueOrderByName(): List<Client>
}
