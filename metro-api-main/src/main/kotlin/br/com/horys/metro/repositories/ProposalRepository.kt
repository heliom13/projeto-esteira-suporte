package br.com.horys.metro.repositories

import br.com.horys.metro.models.Proposal
import org.springframework.data.jpa.repository.JpaRepository

interface ProposalRepository : JpaRepository<Proposal, Long> {
}