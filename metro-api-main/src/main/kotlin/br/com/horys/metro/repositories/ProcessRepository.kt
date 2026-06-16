package br.com.horys.metro.repositories

import br.com.horys.metro.models.Process
import br.com.horys.metro.models.Process.Status
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface ProcessRepository : JpaRepository<Process, Long>, JpaSpecificationExecutor<Process> {
    fun findByClient_IdAndProperty_IdAndStatus(
        clientId: Long,
        propertyId: Long,
        status: Status
    ): Process?

    fun findByExternalId(externalId: String): Process?
    fun findByClient_IdAndStatus(
        clientId: Long,
        status: Status
    ): List<Process>

    fun findByProperty_IdAndStatus(
        propertyId: Long,
        status: Status
    ): List<Process>

    fun findBySellerMain_IdAndStatus(
        sellerId: Long,
        status: Status
    ): List<Process>

    fun findBySellerSecondary_IdAndStatus(
        sellerId: Long,
        status: Status
    ): List<Process>
}
