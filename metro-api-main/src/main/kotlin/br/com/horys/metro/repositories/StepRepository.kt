package br.com.horys.metro.repositories

import br.com.horys.metro.models.Step
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import java.util.Optional

interface StepRepository : JpaRepository<Step, Long>, JpaSpecificationExecutor<Step> {
    fun findAllByStatusOrderByDescription(status: Step.Status): List<Step>
    fun findByStatus(status: Step.Status): Optional<Step>
}
