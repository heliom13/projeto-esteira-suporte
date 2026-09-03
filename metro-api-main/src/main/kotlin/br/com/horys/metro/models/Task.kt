package br.com.horys.metro.models

import java.time.LocalDate
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

@Entity
@Table(name = "tasks")
data class Task(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val title: String,
    val description: String?,
    @ManyToOne
    @JoinColumn(name = "assigned_by_id")
    val assignedBy: User,
    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    val assignedTo: User,
    @Enumerated(EnumType.STRING)
    val status: Status,
    val dueDate: LocalDate?,
    val seen: Boolean = false,
    @ManyToOne
    @JoinColumn(name = "transferred_by_id")
    val transferredBy: User? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    enum class Status {
        PENDING, DONE
    }
}
