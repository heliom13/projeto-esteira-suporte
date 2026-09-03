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
@Table(name = "client_notes")
data class ClientNote(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @ManyToOne
    @JoinColumn(name = "client_id")
    val client: Client,
    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User,
    val content: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
