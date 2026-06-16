package br.com.horys.metro.repositories

import br.com.horys.metro.models.Board
import org.springframework.data.jpa.repository.JpaRepository

interface BoardRepository : JpaRepository<Board, Long> {
    fun findByExternalId(externalId: String): Board?
}