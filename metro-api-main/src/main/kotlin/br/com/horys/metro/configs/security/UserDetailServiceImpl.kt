package br.com.horys.metro.configs.security

import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.models.User.Companion.USER_ROLE_LIST
import br.com.horys.metro.repositories.UserRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailServiceImpl(private val userRepository: UserRepository) : UserDetailsService {
    val log: Logger = LoggerFactory.getLogger(this.javaClass)
    override fun loadUserByUsername(username: String?): UserDetails {
        try {
            val user = userRepository.findByEmail(username)

            if (!user.isPresent)
                throw UsernameNotFoundException("Usuário não encontrado: $username")

            if (!USER_ROLE_LIST.contains(user.get().role))
                throw BusinessException("O usuário não possui nenhuma permissão ativa!")

            return UserDetailsImpl(user.get())
        } catch (ex: Exception) {
            log.error(">>>> UserDetailServiceImpl >>>> loadUserByUsername >>>> Error: ${ex.message}")
            throw ex
        }
    }
}
