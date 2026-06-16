package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.CreatePropertyRequest
import br.com.horys.metro.controllers.requests.UpdatePropertyRequest
import br.com.horys.metro.exceptions.ResourceNotFoundException
import br.com.horys.metro.models.Property
import br.com.horys.metro.repositories.PropertyRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.Optional
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root

@Service
class PropertyService(
    private val repository: PropertyRepository
) {
    val log: Logger = LoggerFactory.getLogger(this::class.java)
    fun findById(id: Long): Property {
        return repository.findById(id).orElseThrow { ResourceNotFoundException("Property not found") }
    }

    fun findByIdOptional(id: Long): Optional<Property> {
        return repository.findById(id)
    }

    @Transactional
    fun save(request: CreatePropertyRequest): Property {
        return repository.save(request.toModel())
    }

    fun findAll(description: String?, ownerName: String?): List<Property> {
        val spec: Specification<Property> =
            Specification { root: Root<Property>, query: CriteriaQuery<*>, criteriaBuilder: CriteriaBuilder ->
                val predicates: MutableList<Predicate> = ArrayList()

                if (!ownerName.isNullOrBlank()) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("ownerName"), "%$ownerName%"
                        )
                    )
                }
                if (!description.isNullOrBlank()) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("description"), "%$description%"
                        )
                    )
                }
                predicates.add(criteriaBuilder.equal(root.get<Boolean>("active"), true))

                query.orderBy(criteriaBuilder.asc(root.get<String>("description")))
                criteriaBuilder.and(*predicates.toTypedArray())
            }

        return repository.findAll(spec)
    }

    fun update(id: Long, request: UpdatePropertyRequest): Property {
        val property = findById(id)
        return repository.save(
            property.copy(
                description = request.description,
                address = request.address,
                ownerName = request.ownerName,
                ownerDocument = request.ownerDocument,
                price = request.price,
                financialPrice = request.financialPrice,
                email = request.email,
                bank = request.bank,
                accountNumberBank = request.accountNumberBank,
                maritalStatus = request.maritalStatus,
                updatedAt = LocalDateTime.now(),
                pix = request.pix,
                linkDrive = request.linkDrive
            )
        )
    }

    fun delete(id: Long) {
        val property = findById(id)
        repository.save(
            property.copy(
                active = false,
                deletedAt = LocalDateTime.now()
            )
        )
    }
}
