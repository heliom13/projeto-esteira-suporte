package br.com.horys.metro.controllers.proposal

import br.com.horys.metro.controllers.proposal.requests.CashRequest
import br.com.horys.metro.controllers.proposal.requests.TurnProcessRequest
import br.com.horys.metro.models.Cash
import br.com.horys.metro.models.Proposal
import br.com.horys.metro.repositories.CashRepository
import br.com.horys.metro.services.PropertyService
import br.com.horys.metro.services.ProposalService
import br.com.horys.metro.services.SellerService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/cashs")
class CashController(
    private val repository: CashRepository,
    private val proposalService: ProposalService,
    private val propertyService: PropertyService,
    private val sellerService: SellerService
) {
    @PostMapping
    @Transactional
    fun create(@RequestBody request: CashRequest) {
        val proposal = proposalService.createProposal(
            clientId = request.clientId,
            proposalType = Proposal.Type.CASH
        )

        val property = propertyService.findById(request.propertyId)
        val seller = sellerService.findById(request.sellerId)

        val entity = Cash(
            proposal = proposal,
            asset = request.asset,
            property = property,
            seller = seller,
            zone = request.zone
        )
        repository.save(entity)
    }

    @PutMapping("/{id}")
    @Transactional
    fun update(@PathVariable id: Long, @RequestBody request: CashRequest) {
        val proposal = proposalService.findById(id)

        val property = propertyService.findById(request.propertyId)
        val seller = sellerService.findById(request.sellerId)
        val cash = repository.findByProposal(proposal)

        val entity = cash.copy(
            asset = request.asset,
            property = property,
            seller = seller,
            zone = request.zone
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