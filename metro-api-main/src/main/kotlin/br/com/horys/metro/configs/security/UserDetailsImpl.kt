package br.com.horys.metro.configs.security

import br.com.horys.metro.models.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserDetailsImpl(private val user: User) : UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> {
        val auths = ArrayList<GrantedAuthority>()
        auths.add(SimpleGrantedAuthority("ROLE_${user.role}"))
        return auths
    }

    override fun isEnabled() = true

    override fun getUsername() = user.email

    override fun isCredentialsNonExpired() = true

    override fun getPassword() = user.password

    override fun isAccountNonExpired() = true

    override fun isAccountNonLocked() = true

    fun getId() = user.id
    fun getDisplayName(): String {
        return user.name
    }

    fun getRole(): User.Role {
        return user.role
    }

}