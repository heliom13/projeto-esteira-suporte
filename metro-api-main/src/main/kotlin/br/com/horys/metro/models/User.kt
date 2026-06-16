package br.com.horys.metro.models

import br.com.horys.metro.models.User.Role.ADMIN
import br.com.horys.metro.models.User.Role.ANALYST
import br.com.horys.metro.models.User.Role.PROCESSOR
import br.com.horys.metro.models.User.Role.SECRETARY
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String = "",
    val username: String,
    val email: String = "",
    val password: String = "",
    @Enumerated(EnumType.STRING)
    val role: Role = SECRETARY
) {

    enum class Role {
        ADMIN, SECRETARY, ANALYST, PROCESSOR
    }

    companion object {
        val USER_ROLE_LIST = listOf(ADMIN, SECRETARY, ANALYST, PROCESSOR)
    }
}