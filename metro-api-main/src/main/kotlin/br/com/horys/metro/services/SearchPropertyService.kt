package br.com.horys.metro.services

import br.com.horys.metro.exceptions.PropertyNotFoundException
import br.com.horys.metro.models.Property
import br.com.horys.metro.repositories.PropertyRepository
import org.springframework.stereotype.Service

@Service
class SearchPropertyService(
    private val repository: PropertyRepository
) {

    fun findByExternalId(externalId: String): Property {
        return repository.findByExternalId(externalId) ?: throw PropertyNotFoundException()
    }
}