package br.com.horys.metro.services

import br.com.horys.metro.controllers.requests.CreateUserRequest
import br.com.horys.metro.controllers.requests.ListUserRequest
import br.com.horys.metro.controllers.requests.UpdateUserRequest
import br.com.horys.metro.controllers.requests.UserRequest
import br.com.horys.metro.controllers.response.UserResponse
import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.models.User
import br.com.horys.metro.repositories.UserRepository
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.domain.Pageable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import java.util.Locale
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root

@Service
class UserService(
    private val userRepository: UserRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
    @PersistenceContext private val manager: EntityManager
) {

    fun getLoggedInUser(): User {
        val username = SecurityContextHolder.getContext().authentication.name
        return userRepository.findByEmail(username).orElseThrow { BusinessException(USER_NOT_FOUND_MESSAGE) }
    }

    fun findById(userDestiny: Long): User {
        return userRepository.findById(userDestiny).orElseThrow { BusinessException(USER_NOT_FOUND_MESSAGE) }
    }

    fun delete(id: Long) {
        userRepository.findById(id).orElseThrow { BusinessException(USER_NOT_FOUND_MESSAGE) }
        try {
            userRepository.deleteById(id)
        } catch (e: DataIntegrityViolationException) {
            throw BusinessException("Usuário não pode ser excluído pois possui processos, propostas ou notificações vinculados.")
        }
    }

    fun reset(email: String, password: String) {
        val user = userRepository.findByEmail(email).orElseThrow { BusinessException("user not found") }
        userRepository.save(
            user.copy(
                password = bCryptPasswordEncoder.encode(password)
            )
        )
    }

    fun create(request: UserRequest): User {
        return userRepository.save(
            User(
                name = request.name,
                email = request.email,
                username = request.username,
                id = null,
                password = bCryptPasswordEncoder.encode(request.password),
                role = User.Role.SECRETARY
            )
        )
    }

    fun findAll(request: ListUserRequest, page: Pageable): List<UserResponse> {
        return try {
            val builder = manager.criteriaBuilder
            val query = builder.createQuery(User::class.java)
            val user = query.from(User::class.java)

            query.select(user)
                .where(builder.and(*getPredicates(request, builder, user)))
            val users = manager.createQuery(query)
                .setFirstResult(page.pageNumber)
                .setMaxResults(page.pageSize)
                .resultList

            val userResponseList = users.map {
                UserResponse(
                    name = it.name,
                    id = it.id!!,
                    username = it.username,
                    email = it.email,
                    role = it.role
                )
            }

            userResponseList
        } catch (ex: Exception) {
            emptyList()
        }


    }

    private fun getPredicates(
        request: ListUserRequest,
        builder: CriteriaBuilder,
        user: Root<User>
    ): Array<Predicate> {
        val predicates: MutableList<Predicate> = ArrayList()

        if (request.name?.isNotBlank() == true)
            predicates.add(
                builder.like(
                    builder.upper(user.get("name")),
                    "%${request.name.uppercase(Locale.getDefault())}%"
                )
            )

        if (request.role?.isNotBlank() == true)
            predicates.add(builder.equal(user.get<User.Role>("role"), User.Role.valueOf(request.role)))

        return predicates.toTypedArray()
    }

    fun executeAdmin(request: CreateUserRequest): UserResponse {
        try {

            userRepository.findByEmail(request.email)
                .ifPresent { throw BusinessException("Já existe um usuário com o mesmo email!") }

            userRepository.findByUsername(request.username)
                .ifPresent { throw BusinessException("Já existe um usuário com o mesmo login!") }


            request.password = bCryptPasswordEncoder.encode(request.password)
            val userInserted = userRepository.save(request.toModel())

            return UserResponse(
                id = userInserted.id!!,
                name = userInserted.name,
                username = userInserted.username,
                email = userInserted.email,
                role = userInserted.role
            )
        } catch (ex: Exception) {
            throw ex
        }
    }

    fun update(id: Long, updateUserRequest: UpdateUserRequest): User {
        val user = userRepository.findById(id).orElseThrow { RuntimeException("Usuário não encontrado id: $id") }

        if (user.email != updateUserRequest.email) {
            userRepository.findByEmail(updateUserRequest.email)
                .ifPresent { throw BusinessException("Já existe um usuário com o mesmo email!") }
        }

        if (user.username != updateUserRequest.username) {
            userRepository.findByUsername(updateUserRequest.username)
                .ifPresent { throw BusinessException("Já existe um usuário com o mesmo login!") }
        }
        
        return userRepository.save(
            user.copy(
                name = updateUserRequest.name,
                username = updateUserRequest.username,
                email = updateUserRequest.email,
                role = User.Role.valueOf(updateUserRequest.role)
            )
        )
    }

    companion object {
        private const val USER_NOT_FOUND_MESSAGE = "user not found"
    }
}