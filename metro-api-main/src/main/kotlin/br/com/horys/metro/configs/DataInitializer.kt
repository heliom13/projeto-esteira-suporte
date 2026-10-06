package br.com.horys.metro.configs

import br.com.horys.metro.models.FlowType
import br.com.horys.metro.models.User
import br.com.horys.metro.repositories.FlowTypeRepository
import br.com.horys.metro.repositories.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class DataInitializer(
    private val userRepository: UserRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
    private val flowTypeRepository: FlowTypeRepository
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {
        // Cria um administrador inicial APENAS numa instalacao nova (sem nenhum usuario).
        // Nunca usa senha fixa no codigo: o repositorio e publico, entao qualquer senha
        // escrita aqui seria conhecida por todos (era o caso do antigo "admin123").
        if (userRepository.count() == 0L) {
            val senhaInformada = System.getenv("ADMIN_INITIAL_PASSWORD")?.takeIf { it.isNotBlank() }
            val senha = senhaInformada ?: gerarSenhaAleatoria()
            val email = System.getenv("ADMIN_INITIAL_EMAIL")?.takeIf { it.isNotBlank() } ?: "admin@metro.com"
            val user = userRepository.save(
                User(
                    name = "Administrador",
                    username = "admin",
                    email = email,
                    password = bCryptPasswordEncoder.encode(senha),
                    role = User.Role.ADMIN
                )
            )
            if (senhaInformada == null) {
                log.warn(">>> [PRIMEIRO ACESSO] Administrador criado (${user.email}). " +
                    "Senha gerada: $senha  -- troque-a logo apos o primeiro login.")
            } else {
                log.info(">>> Administrador inicial criado (${user.email}) com a senha de ADMIN_INITIAL_PASSWORD.")
            }
        } else {
            log.info(">>> Ja existem usuarios cadastrados; nenhum administrador inicial sera criado.")
        }

        val hasRegularizacao = flowTypeRepository.findAll()
            .any { it.description.lowercase().contains("regulariz") }
        if (!hasRegularizacao) {
            flowTypeRepository.save(
                FlowType(
                    id = null,
                    description = "Regularização",
                    createdAt = LocalDateTime.now(),
                    updatedAt = LocalDateTime.now()
                )
            )
            log.info(">>> FlowType 'Regularização' criado.")
        } else {
            log.info(">>> FlowType 'Regularização' já existe.")
        }
    }

    private fun gerarSenhaAleatoria(): String {
        // Sem caracteres ambiguos (0/O, 1/l/I) para facilitar a digitacao
        val chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
        val rnd = java.security.SecureRandom()
        return (1..16).map { chars[rnd.nextInt(chars.length)] }.joinToString("")
    }
}
