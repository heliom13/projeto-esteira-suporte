package br.com.horys.metro.controllers.proposal

import br.com.horys.metro.controllers.proposal.requests.FinancingRequest
import br.com.horys.metro.controllers.proposal.requests.TurnProcessRequest
import br.com.horys.metro.models.Financing
import br.com.horys.metro.models.Proposal
import br.com.horys.metro.repositories.FinancingRepository
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
@RequestMapping("/v1/financings")
class FinancingController(
    private val repository: FinancingRepository,
    private val proposalService: ProposalService,
    private val propertyService: PropertyService,
    private val sellerService: SellerService
) {
    @PostMapping
    @Transactional
    fun create(@RequestBody request: FinancingRequest) {
        val proposal = proposalService.createProposal(
            clientId = request.clientId,
            proposalType = Proposal.Type.FINANCING
        )

        val property = propertyService.findById(request.propertyId)
        val seller = sellerService.findById(request.sellerId)

        val entity = Financing(
            proposal = proposal,
            bank = request.bank,
            price = request.price,
            product = request.product,
            term = request.term,
            asset = request.asset,
            property = property,
            seller = seller,
            modality = request.modality
        )
        repository.save(entity)
    }

    @PutMapping("/{id}")
    @Transactional
    fun update(@PathVariable id: Long, @RequestBody request: FinancingRequest) {
        val proposal = proposalService.findById(id)

        val entityUpdate = repository.findByProposal(proposal)
        val property = propertyService.findById(request.propertyId)
        val seller = sellerService.findById(request.sellerId)

        val entity = entityUpdate.copy(
            proposal = proposal,
            bank = request.bank,
            price = request.price,
            product = request.product,
            term = request.term,
            asset = request.asset,
            property = property,
            seller = seller,
            modality = request.modality
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