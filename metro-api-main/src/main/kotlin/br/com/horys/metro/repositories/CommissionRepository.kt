package br.com.horys.metro.repositories

import br.com.horys.metro.models.Commission
import org.springframework.data.jpa.repository.JpaRepository

interface CommissionRepository : JpaRepository<Commission, Long> {
}