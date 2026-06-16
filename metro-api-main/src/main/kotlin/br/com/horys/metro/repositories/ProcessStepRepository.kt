package br.com.horys.metro.repositories

import br.com.horys.metro.models.Process
import br.com.horys.metro.models.ProcessStep
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ProcessStepRepository : JpaRepository<ProcessStep, Long> {

    @Query("select ss from ProcessStep ss join fetch ss.process s join fetch s.stepCurrent fs where s.id= :id order by ss.orderStep")
    fun findFlowSteps(id: Long): List<ProcessStep>

    fun findTopByProcess_IdAndStep_Id(saleId: Long, stepId: Long): ProcessStep?
    fun findTopByProcessAndOrderStepGreaterThan(process: Process, orderStep: Double): ProcessStep?
}
