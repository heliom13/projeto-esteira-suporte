package br.com.horys.metro.repositories

import br.com.horys.metro.models.TypeDocument
import org.springframework.data.jpa.repository.JpaRepository

interface TypeDocumentRepository : JpaRepository<TypeDocument, Long> {

}