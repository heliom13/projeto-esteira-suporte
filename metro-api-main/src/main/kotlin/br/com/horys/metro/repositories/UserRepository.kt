package br.com.horys.metro.repositories

import br.com.horys.metro.models.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String?): Optional<User>
    fun findByUsername(username: String?): Optional<User>
    fun findByUsernameAndEmail(username: String?, email: String?): Optional<User>
    fun findByUsernameIn(usernames: MutableList<String>): List<User>
    fun findAllByIdNot(id: Long): List<User>
}