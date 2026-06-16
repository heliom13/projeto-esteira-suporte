package br.com.horys.metro.configs

import br.com.horys.metro.models.User
import br.com.horys.metro.repositories.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component

@Component
class DataInitializer(
    private val userRepository: UserRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {
        if (userRepository.findByEmail("admin@metro.com").isEmpty) {
            val user = userRepository.save(
                User(
                    name = "Administrador",
                    username = "admin",
                    email = "admin@metro.com",
                    password = bCryptPasswordEncoder.encode("admin123"),
                    role = User.Role.ADMIN
                )
            )
            log.info(">>> Usuário admin criado com ID: ${user.id}")
        } else {
            log.info(">>> Usuário admin já existe no banco.")
        }
    }
}
