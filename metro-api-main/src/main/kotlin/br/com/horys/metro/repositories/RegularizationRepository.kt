package br.com.horys.metro.repositories

import br.com.horys.metro.models.Proposal
import br.com.horys.metro.models.Regularization
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface RegularizationRepository : JpaRepository<Regularization, Long> {
    fun findByProposal(proposal: Proposal): Regularization

    @Query("SELECT c FROM Regularization c WHERE c.proposal.status = :status ORDER BY c.id DESC")
    fun findByProposalStatusOrderByIdDesc(@Param("status") status: Proposal.Status): List<Regularization>
    fun findByProposalId(id: Long): Regularization
}