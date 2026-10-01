package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

/**
 * Registro de auditoria (LGPD): quem alterou dados, o que e quando.
 * Guarda operacoes que modificam dados (POST/PUT/PATCH/DELETE).
 */
@Entity
@Table(name = "audit_log")
data class AuditLog(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val userEmail: String?,

    val method: String,

    @Column(columnDefinition = "TEXT")
    val path: String,

    val status: Int,

    val createdAt: LocalDateTime = LocalDateTime.now()
)
