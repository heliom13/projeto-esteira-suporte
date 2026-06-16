package br.com.horys.metro.repositories

import br.com.horys.metro.models.Loan
import br.com.horys.metro.models.Proposal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface LoanRepository : JpaRepository<Loan, Long> {
    @Query("SELECT c FROM Loan c WHERE c.proposal.status = :status ORDER BY c.id DESC")
    fun findByProposalStatusOrderByIdDesc(@Param("status") status: Proposal.Status): List<Loan>
    fun findByProposalId(id: Long): Loan
    fun findByProposal(proposal: Proposal): Loan
}