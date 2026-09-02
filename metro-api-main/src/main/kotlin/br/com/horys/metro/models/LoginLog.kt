package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

@Entity
@Table(name = "login_logs")
data class LoginLog(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User,
    val createdAt: LocalDateTime
)
