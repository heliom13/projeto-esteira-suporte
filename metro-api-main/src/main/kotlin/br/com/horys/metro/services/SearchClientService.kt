package br.com.horys.metro.services

import br.com.horys.metro.exceptions.ClientNotFoundException
import br.com.horys.metro.models.Client
import br.com.horys.metro.repositories.ClientRepository
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root

@Service
class SearchClientService(
    private val clientRepository: ClientRepository
) {

    fun findById(id: Long): Client {
        return clientRepository.findById(id).orElseThrow { ClientNotFoundException() }
    }

    fun findByExternalId(externalId: String): Client {
        return clientRepository.findByExternalId(externalId) ?: throw ClientNotFoundException()
    }

    fun findAll(name: String?): List<Client> {
        val spec: Specification<Client> =
            Specification { root: Root<Client>, query: CriteriaQuery<*>, criteriaBuilder: CriteriaBuilder ->
                val predicates: MutableList<Predicate> = ArrayList()

                if (name != null) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("name"), "%$name%"
                        )
                    )
                }
                predicates.add(criteriaBuilder.equal(root.get<Boolean>("active"), true))

                query.orderBy(criteriaBuilder.asc(root.get<String>("name")))
                criteriaBuilder.and(*predicates.toTypedArray())
            }

        return clientRepository.findAll(spec)
    }

}
