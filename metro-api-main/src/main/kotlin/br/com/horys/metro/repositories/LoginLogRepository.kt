package br.com.horys.metro.repositories

import br.com.horys.metro.models.LoginLog
import org.springframework.data.jpa.repository.JpaRepository

interface LoginLogRepository : JpaRepository<LoginLog, Long> {
    fun findTop200ByOrderByCreatedAtDesc(): List<LoginLog>
}
