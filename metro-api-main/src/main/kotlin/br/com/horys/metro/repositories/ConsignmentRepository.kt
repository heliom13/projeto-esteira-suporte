package br.com.horys.metro.repositories

import br.com.horys.metro.models.Consignment
import br.com.horys.metro.models.Proposal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ConsignmentRepository : JpaRepository<Consignment, Long> {
    @Query("SELECT c FROM Consignment c WHERE c.proposal.status = :status ORDER BY c.id DESC")
    fun findByProposalStatusOrderByIdDesc(@Param("status") status: Proposal.Status): List<Consignment>
    fun findByProposalId(id: Long): Consignment
    fun findByProposal(proposal: Proposal): Consignment
}