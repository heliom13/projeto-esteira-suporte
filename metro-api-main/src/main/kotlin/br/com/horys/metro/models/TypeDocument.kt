package br.com.horys.metro.models

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "types_document")
data class TypeDocument(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long?,
    val description: String
)