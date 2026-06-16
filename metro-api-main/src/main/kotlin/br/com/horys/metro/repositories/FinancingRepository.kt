package br.com.horys.metro.repositories

import br.com.horys.metro.models.Financing
import br.com.horys.metro.models.Proposal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface FinancingRepository : JpaRepository<Financing, Long> {
    @Query("SELECT c FROM Financing c WHERE c.proposal.status = :status ORDER BY c.id DESC")
    fun findByProposalStatusOrderByIdDesc(@Param("status") status: Proposal.Status): List<Financing>
    fun findByProposal(proposal: Proposal): Financing
    fun findByProposalId(id: Long): Financing
}