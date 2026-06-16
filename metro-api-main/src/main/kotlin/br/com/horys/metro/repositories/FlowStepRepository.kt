package br.com.horys.metro.repositories

import br.com.horys.metro.models.Flow
import br.com.horys.metro.models.FlowStep
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface FlowStepRepository : JpaRepository<FlowStep, Long> {
    @Query("select fs from FlowStep fs join fetch fs.flow f join fetch fs.step s where f.id= :id and fs.status= 'ACTIVE' order by fs.orderStep")
    fun findByFlowOrderedSteps(id: Long): List<FlowStep>
    fun findTopByFlowAndOrderStepGreaterThan(flow: Flow, orderCurrent: Double): FlowStep?
}
