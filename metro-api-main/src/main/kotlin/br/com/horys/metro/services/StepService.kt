package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.process.StepRequest
import br.com.horys.metro.controllers.response.StepResponse
import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.exceptions.ResourceNotFoundException
import br.com.horys.metro.models.Step
import br.com.horys.metro.models.StepDocument
import br.com.horys.metro.repositories.StepDocumentRepository
import br.com.horys.metro.repositories.StepRepository
import br.com.horys.metro.repositories.TypeDocumentRepository
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root

@Service
class StepService(
    private val repository: StepRepository,
    private val stepDocumentRepository: StepDocumentRepository,
    private val typeDocumentRepository: TypeDocumentRepository
) {

    @Transactional
    fun save(request: StepRequest): StepResponse {
        val step = repository.save(request.toModel())

        val documents = saveDocuments(request, step)
        return StepResponse.fromModel(step, documents)
    }

    private fun saveDocuments(
        request: StepRequest,
        step: Step
    ): List<StepDocument> {
        val documents = request.documents.map {
            StepDocument(
                id = null,
                step = step,
                typeDocument = typeDocumentRepository.findById(it)
                    .orElseThrow { BusinessException("Tipo documento inválido!") },
                deleted = false,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
            )
        }.also {
            stepDocumentRepository.saveAll(it)
        }
        return documents
    }

    fun findAllByStatusOrderByDescription(status: Step.Status): List<Step> {
        return repository.findAllByStatusOrderByDescription(status)
    }

    @Transactional
    fun update(id: Long, request: StepRequest): StepResponse {
        val step = findById(id).also {
            repository.save(
                it.copy(
                    description = request.description,
                    deadline = request.deadLine,
                    requiredDocument = request.requiredDocument,
                    updatedAt = LocalDateTime.now()
                )
            )

        }

        stepDocumentRepository.findByStep_IdAndDeletedFalse(step.id!!).map {
            it.copy(
                deleted = true
            )
        }.also {
            stepDocumentRepository.saveAll(it)
        }

        val documents = saveDocuments(request, step)

        return StepResponse.fromModel(step, documents)
    }

    fun delete(id: Long) {
        val step = findById(id)
        repository.save(
            step.copy(
                status = Step.Status.INACTIVE,
                updatedAt = LocalDateTime.now()
            )
        )
    }

    fun findById(id: Long): Step {
        return repository.findById(id).orElseThrow { ResourceNotFoundException("Passo não encontrado") }
    }

    fun getById(id: Long): StepResponse {
        val step = findById(id)
        val documents = stepDocumentRepository.findByStep_IdAndDeletedFalse(step.id!!)
        return StepResponse.fromModel(step, documents)
    }


    fun saves(request: StepRequest): Step {
        return repository.save(request.toModel2())
    }

    fun findAll(description: String?, pageable: Pageable): List<Step> {
        val spec: Specification<Step> =
            Specification { root: Root<Step>, query: CriteriaQuery<*>, criteriaBuilder: CriteriaBuilder ->
                val predicates: MutableList<Predicate> = ArrayList()

                if (!description.isNullOrBlank()) {
                    predicates.add(
                        criteriaBuilder.like(
                            root.get("description"), "%$description%"
                        )
                    )
                }
                predicates.add(criteriaBuilder.equal(root.get<Boolean>("status"), Step.Status.NORMAL))

                query.orderBy(criteriaBuilder.asc(root.get<String>("description")))
                criteriaBuilder.and(*predicates.toTypedArray())
            }

        return repository.findAll(spec)
    }
}
