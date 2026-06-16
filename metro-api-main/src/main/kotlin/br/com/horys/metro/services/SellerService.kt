package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.SellerRequest
import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.models.Seller
import br.com.horys.metro.repositories.SellerRepository
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root

@Service
class SellerService(
    private val repository: SellerRepository
) {

    fun findById(id: Long): Seller {
        return repository.findById(id).orElseThrow { BusinessException("Vendedor não encontrado") }
    }

    fun findOptionalSeller(id: Long?): Seller? {
        return id?.let {
            return@let repository.findByIdOrNull(id)
        }
    }

    fun findAll(name: String?): List<Seller> {
        val spec: Specification<Seller> =
            Specification { root: Root<Seller>, query: CriteriaQuery<*>, criteriaBuilder: CriteriaBuilder ->
                val predicates: MutableList<Predicate> = ArrayList()

                if (!name.isNullOrBlank()) {
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

        return repository.findAll(spec)

    }

    fun findByDocument(document: String): Seller? {
        return repository.findByDocument(document)
    }

    fun update(id: Long, request: SellerRequest): Seller {
        val seller =
            repository.findById(id).orElseThrow { BusinessException("Vendedor não encontrado") }

        findByDocument(request.document)?.let {
            if (it.id != seller.id) {
                throw BusinessException("CPF/CNPJ inválido")
            }
        }

        return repository.save(
            seller.copy(
                name = request.name,
                document = request.document,
                email = request.email,
                emailOther = request.emailOther,
                phone = request.phone,
                otherPhone = request.otherPhone,
                bank = request.bank,
                accountBank = request.accountBank,
                accountNumberBank = request.accountNumberBank,
                pix = request.pix,
            )
        )

    }

    fun save(request: SellerRequest): Seller {

        findByDocument(request.document)?.let {
            throw BusinessException("Document is invalid")
        }

        return repository.save(request.toModel())
    }

    fun findByExternalId(externalId: String): Seller {
        return repository.findByExternalId(externalId) ?: throw BusinessException("Vendedor não encontrado")
    }

    fun delete(id: Long) {
        val seller = findById(id)
        repository.save(
            seller.copy(
                deletedAt = LocalDateTime.now(),
                active = false
            )
        )
    }
}