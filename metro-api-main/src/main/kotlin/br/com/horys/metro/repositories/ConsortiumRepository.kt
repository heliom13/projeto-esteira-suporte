package br.com.horys.metro.repositories

import br.com.horys.metro.models.Consortium
import br.com.horys.metro.models.Proposal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ConsortiumRepository : JpaRepository<Consortium, Long> {
    @Query("SELECT c FROM Consortium c WHERE c.proposal.status = :status ORDER BY c.id DESC")
    fun findByProposalStatusOrderByIdDesc(@Param("status") status: Proposal.Status): List<Consortium>
    fun findByProposal(proposal: Proposal): Consortium
    fun findByProposalId(id: Long): Consortium
}