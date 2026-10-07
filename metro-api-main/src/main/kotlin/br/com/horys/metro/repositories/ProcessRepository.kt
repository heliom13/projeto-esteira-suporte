package br.com.horys.metro.repositories

import br.com.horys.metro.models.Process
import br.com.horys.metro.models.Process.Status
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query

interface ProcessRepository : JpaRepository<Process, Long>, JpaSpecificationExecutor<Process> {
    fun findByClient_IdAndProperty_IdAndStatus(
        clientId: Long,
        propertyId: Long,
        status: Status
    ): Process?

    fun findByExternalId(externalId: String): Process?

    /** Busca da barra lateral: codigo (ex: 2026-0001) ou nome do cliente, em qualquer status. */
    @Query(
        "select p from Process p left join p.client c " +
            "where lower(coalesce(p.code, '')) like lower(concat('%', :q, '%')) " +
            "or lower(coalesce(c.name, '')) like lower(concat('%', :q, '%')) " +
            "order by p.id desc"
    )
    fun lookup(q: String, pageable: Pageable): List<Process>

    /** Maior codigo ja gerado para o ano (prefixo "2026-"), para seguir a sequencia. */
    @Query("select max(p.code) from Process p where p.code like concat(:prefix, '%')")
    fun findMaxCodeByPrefix(prefix: String): String?
    fun findByClient_Id(clientId: Long): List<Process>
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
