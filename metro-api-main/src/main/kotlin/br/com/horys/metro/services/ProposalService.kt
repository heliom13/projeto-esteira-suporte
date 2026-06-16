package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.process.ProcessRequest
import br.com.horys.metro.models.Property
import br.com.horys.metro.models.Proposal
import br.com.horys.metro.models.Seller
import br.com.horys.metro.repositories.CashRepository
import br.com.horys.metro.repositories.ContractRepository
import br.com.horys.metro.repositories.FinancingRepository
import br.com.horys.metro.repositories.ProposalRepository
import br.com.horys.metro.repositories.RegularizationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProposalService(
    private val proposalRepository: ProposalRepository,
    private val clientService: ClientService,
    private val userService: UserService,
    private val processService: ProcessService,
    private val cashRepository: CashRepository,
    private val financingRepository: FinancingRepository,
    private val contractRepository: ContractRepository,
    private val regularizationRepository: RegularizationRepository
) {

    fun createProposal(clientId: Long, proposalType: Proposal.Type): Proposal {
        val client = clientService.findById(clientId)
        val user = userService.getLoggedInUser();

        return proposalRepository.save(
            Proposal(
                client = client,
                user = user,
                type = proposalType,
                status = Proposal.Status.PENDING
            )
        )
    }


    @Transactional
    fun turnProcess(proposalId: Long, flowId: Long) {
        val proposal =
            proposalRepository.findById(proposalId).orElseThrow { throw RuntimeException("Proposal not found") }

        val (property, seller) = findByProposal(proposal.type, proposal)

        proposalRepository.save(
            proposal.copy(
                status = Proposal.Status.APPROVED
            )
        )

        processService.save(
            ProcessRequest(
                flowId = flowId,
                propertyId = property?.id,
                clientId = proposal.client.id,
                sellerMainId = seller?.id,
                sellerSecondaryId = null,
                linkDrive = null
            ),
            proposal
        )
    }

    private fun findByProposal(type: Proposal.Type, proposal: Proposal): Pair<Property?, Seller?> {
        return when (type) {
            Proposal.Type.FINANCING -> {
                val financing = financingRepository.findByProposal(proposal)
                financing.property to financing.seller
            }

            Proposal.Type.CONTRACT -> {
                val contract = contractRepository.findByProposal(proposal)
                contract.property to contract.seller
            }

            Proposal.Type.CASH -> {
                val cash = cashRepository.findByProposal(proposal)
                cash.property to cash.seller
            }

            Proposal.Type.REGULARIZATION -> {
                val regularization = regularizationRepository.findByProposal(proposal)
                regularization.property to regularization.seller
            }

            else -> null to null
        }
    }

    fun cancelProposal(id: Long) {
        val proposal = proposalRepository.findById(id).orElseThrow { throw RuntimeException("Proposal not found") }
        proposalRepository.save(
            proposal.copy(
                status = Proposal.Status.REJECTED
            )
        )
    }

    fun findById(id: Long): Proposal {
        return proposalRepository.findById(id).orElseThrow { throw RuntimeException("Proposal not found") }
    }


}
