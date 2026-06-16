package br.com.horys.metro.controllers.proposal

import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.models.Proposal
import br.com.horys.metro.repositories.CashRepository
import br.com.horys.metro.repositories.ConsignmentRepository
import br.com.horys.metro.repositories.ConsortiumRepository
import br.com.horys.metro.repositories.ContractRepository
import br.com.horys.metro.repositories.FinancingRepository
import br.com.horys.metro.repositories.LoanRepository
import br.com.horys.metro.repositories.ProposalRepository
import br.com.horys.metro.repositories.RegularizationRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/proposals")
class ProposalController(
    private val proposalRepository: ProposalRepository,
    private val cashRepository: CashRepository,
    private val loanRepository: LoanRepository,
    private val consignmentRepository: ConsignmentRepository,
    private val financingRepository: FinancingRepository,
    private val contractRepository: ContractRepository,
    private val regularizationRepository: RegularizationRepository,
    private val consortiumRepository: ConsortiumRepository

) {

    @GetMapping("/{id}")
    fun getProposalById(@PathVariable id: Long): Proposal =
        proposalRepository.findById(id).orElseThrow { BusinessException("Proposal not found") }

    @GetMapping("/{id}/cashs")
    fun getCashsByProposalId(@PathVariable id: Long) =
        cashRepository.findByProposalId(id)

    @GetMapping("/{id}/loans")
    fun getLoansByProposalId(@PathVariable id: Long) =
        loanRepository.findByProposalId(id)

    @GetMapping("/{id}/consignments")
    fun getConsignmentsByProposalId(@PathVariable id: Long) =
        consignmentRepository.findByProposalId(id)

    @GetMapping("/{id}/financings")
    fun getFinancingsByProposalId(@PathVariable id: Long) =
        financingRepository.findByProposalId(id)

    @GetMapping("/{id}/contracts")
    fun getContractsByProposalId(@PathVariable id: Long) =
        contractRepository.findByProposalId(id)

    @GetMapping("/{id}/regularizations")
    fun getRegularizationsByProposalId(@PathVariable id: Long) =
        regularizationRepository.findByProposalId(id)

    @GetMapping("/{id}/consortiums")
    fun getConsortiumsByProposalId(@PathVariable id: Long) =
        consortiumRepository.findByProposalId(id)

}