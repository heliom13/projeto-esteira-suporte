package br.com.horys.metro.repositories

import br.com.horys.metro.models.Cash
import br.com.horys.metro.models.Proposal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface CashRepository : JpaRepository<Cash, Long> {
    fun findByProposal(proposal: Proposal): Cash

    @Query("SELECT c FROM Cash c WHERE c.proposal.status = :status ORDER BY c.id DESC")
    fun findByProposalStatusOrderByIdDesc(@Param("status") status: Proposal.Status): List<Cash>
    fun findByProposalId(id: Long): Cash
}