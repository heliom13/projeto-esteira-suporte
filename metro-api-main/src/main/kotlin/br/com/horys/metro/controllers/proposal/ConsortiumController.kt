package br.com.horys.metro.controllers.proposal

import br.com.horys.metro.controllers.proposal.requests.ConsortiumRequest
import br.com.horys.metro.controllers.proposal.requests.TurnProcessRequest
import br.com.horys.metro.models.Consortium
import br.com.horys.metro.models.Proposal
import br.com.horys.metro.repositories.ConsortiumRepository
import br.com.horys.metro.services.ProposalService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/consortiums")
class ConsortiumController(
    private val repository: ConsortiumRepository,
    private val proposalService: ProposalService
) {

    @PostMapping
    @Transactional
    fun create(@RequestBody request: ConsortiumRequest): Consortium {
        val proposal = proposalService.createProposal(
            clientId = request.clientId,
            proposalType = Proposal.Type.CONSORTIUM
        )
        val consortium = Consortium(
            proposal = proposal,
            bank = request.bank,
            price = request.price,
            term = request.term,
            asset = request.asset
        )
        return repository.save(consortium)
    }

    @PutMapping("/{id}")
    @Transactional
    fun update(@PathVariable id: Long, @RequestBody request: ConsortiumRequest) {
        val proposal = proposalService.findById(id)

        val entityUpdate = repository.findByProposal(proposal)

        val entity = entityUpdate.copy(
            bank = request.bank,
            price = request.price,
            term = request.term,
            asset = request.asset
        )
        repository.save(entity)
    }

    @GetMapping
    fun list(): List<Consortium> {
        return repository.findByProposalStatusOrderByIdDesc(Proposal.Status.PENDING)
    }

    @PostMapping("/approve")
    fun approve(@RequestBody request: TurnProcessRequest) {
        proposalService.turnProcess(request.id, request.flowId)
    }

    @PostMapping("/cancel/{id}")
    fun cancel(@PathVariable id: Long) {
        proposalService.cancelProposal(id)
    }

}