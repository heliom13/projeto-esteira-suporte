package br.com.horys.metro.controllers.proposal

import br.com.horys.metro.controllers.proposal.requests.LoanRequest
import br.com.horys.metro.controllers.proposal.requests.TurnProcessRequest
import br.com.horys.metro.models.Loan
import br.com.horys.metro.models.Proposal
import br.com.horys.metro.repositories.LoanRepository
import br.com.horys.metro.services.ProposalService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/loans")
class LoanController(
    private val repository: LoanRepository,
    private val proposalService: ProposalService
) {
    @PostMapping
    @Transactional
    fun create(@RequestBody request: LoanRequest) {
        val proposal = proposalService.createProposal(
            clientId = request.clientId,
            proposalType = Proposal.Type.LOAN
        )
        val entity = Loan(
            proposal = proposal,
            bank = request.bank,
            price = request.price,
            product = request.product,
            term = request.term
        )
        repository.save(entity)
    }

    @PutMapping("/{id}")
    @Transactional
    fun update(@PathVariable id: Long, @RequestBody request: LoanRequest) {
        val proposal = proposalService.findById(id)

        val entityUpdate = repository.findByProposal(proposal)

        val entity = entityUpdate.copy(
            bank = request.bank,
            price = request.price,
            product = request.product,
            term = request.term
        )
        repository.save(entity)
    }

    @GetMapping
    fun list() = repository.findByProposalStatusOrderByIdDesc(Proposal.Status.PENDING)


    @PostMapping("/approve")
    fun approve(@RequestBody request: TurnProcessRequest) {
        proposalService.turnProcess(request.id, request.flowId)
    }

    @PostMapping("/cancel/{id}")
    fun cancel(@PathVariable id: Long) {
        proposalService.cancelProposal(id)
    }
}