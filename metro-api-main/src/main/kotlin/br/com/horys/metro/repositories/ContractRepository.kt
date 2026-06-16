package br.com.horys.metro.repositories

import br.com.horys.metro.models.Contract
import br.com.horys.metro.models.Proposal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ContractRepository : JpaRepository<Contract, Long> {
    @Query("SELECT c FROM Contract c WHERE c.proposal.status = :status ORDER BY c.id DESC")
    fun findByProposalStatusOrderByIdDesc(@Param("status") status: Proposal.Status): List<Contract>
    fun findByProposal(proposal: Proposal): Contract
    fun findByProposalId(id: Long): Contract
}