package br.com.horys.metro.controllers.proposal

import br.com.horys.metro.controllers.proposal.requests.RegularizationRequest
import br.com.horys.metro.controllers.proposal.requests.TurnProcessRequest
import br.com.horys.metro.models.Proposal
import br.com.horys.metro.models.Regularization
import br.com.horys.metro.repositories.RegularizationRepository
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
@RequestMapping("/v1/regularizations")
class RegularizationController(
    private val repository: RegularizationRepository,
    private val proposalService: ProposalService,
    private val propertyService: PropertyService,
    private val sellerService: SellerService
) {
    @PostMapping
    @Transactional
    fun create(@RequestBody request: RegularizationRequest) {
        val proposal = proposalService.createProposal(
            clientId = request.clientId,
            proposalType = Proposal.Type.REGULARIZATION
        )

        val property = propertyService.findById(request.propertyId)
        val seller = sellerService.findById(request.sellerId)

        val entity = Regularization(
            proposal = proposal,
            price = request.price,
            property = property,
            seller = seller,
            registration = request.registration,
            service = request.service,
            payment = request.payment
        )
        repository.save(entity)
    }

    @PutMapping("/{id}")
    @Transactional
    fun update(@PathVariable id: Long, @RequestBody request: RegularizationRequest) {
        val proposal = proposalService.findById(id)

        val entityUpdate = repository.findByProposal(proposal)
        val property = propertyService.findById(request.propertyId)
        val seller = sellerService.findById(request.sellerId)

        val entity = entityUpdate.copy(
            proposal = proposal,
            price = request.price,
            property = property,
            seller = seller,
            registration = request.registration,
            service = request.service,
            payment = request.payment
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