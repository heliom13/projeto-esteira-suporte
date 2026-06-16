package br.com.horys.metro.repositories

import br.com.horys.metro.models.Flow
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface FlowRepository : JpaRepository<Flow, Long>, JpaSpecificationExecutor<Flow>
