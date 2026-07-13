package br.com.horys.metro.models

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "process_step_notes")
data class ProcessStepNote(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @ManyToOne
    @JoinColumn(name = "process_step_id")
    val processStep: ProcessStep,
    val content: String,
    val userName: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
