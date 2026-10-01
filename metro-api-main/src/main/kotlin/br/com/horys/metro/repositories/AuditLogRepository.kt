package br.com.horys.metro.repositories

import br.com.horys.metro.models.AuditLog
import org.springframework.data.jpa.repository.JpaRepository

interface AuditLogRepository : JpaRepository<AuditLog, Long>
