package br.com.horys.metro.repositories

import br.com.horys.metro.models.FlowType
import org.springframework.data.jpa.repository.JpaRepository

interface FlowTypeRepository : JpaRepository<FlowType, Long> {
}