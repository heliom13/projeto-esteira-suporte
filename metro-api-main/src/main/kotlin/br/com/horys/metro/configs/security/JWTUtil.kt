package br.com.horys.metro.configs.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.stereotype.Component
import java.util.Date
import javax.servlet.http.HttpServletRequest

@Component
class JWTUtil {

    private val secret = "pGy7dvj15VGiIffMhXFZRt2VII7bbrTO"

    private val expiration: Long = 600000000

    fun generateToken(userDetailsImpl: UserDetailsImpl): String {
        val username = userDetailsImpl.username
        val displayName = userDetailsImpl.getDisplayName()
        val role = userDetailsImpl.getRole().name
        val claims = mutableMapOf<String, Any>("role" to role)

        return Jwts.builder()
            .setClaims(claims)
            .setSubject(username)
            .setIssuer(displayName)
            .setExpiration(Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS256, secret.toByteArray())
            .compact()
    }

    fun isTokenValid(token: String): Boolean {
        val claims = getClaimsToken(token)
        if (claims != null) {
            val username = claims.subject
            val expirationDate = claims.expiration
            val now = Date(System.currentTimeMillis())
            if (username != null && expirationDate != null && now.before(expirationDate)) {
                return true
            }
        }
        return false
    }

    private fun getClaimsToken(token: String): Claims? {
        return try {
            Jwts.parser().setSigningKey(secret.toByteArray()).parseClaimsJws(token).body
        } catch (e: Exception) {
            null
        }
    }

    fun getUserName(token: String): String? {
        val claims = getClaimsToken(token)
        return claims?.subject
    }

    fun getTokenFromHttpServletRequest(request: HttpServletRequest): String? {
        val authorizationHeader = request.getHeader("Authorization")

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
            return authorizationHeader.substring(7)
        }
        return null
    }

    fun generatePasswordResetToken(email: String): String {
        val claims = mutableMapOf<String, Any>(PASSWORD_RESET_CLAIM to true)

        return Jwts.builder()
            .setClaims(claims)
            .setSubject(email)
            .setExpiration(Date(System.currentTimeMillis() + passwordResetExpiration))
            .signWith(SignatureAlgorithm.HS256, secret.toByteArray())
            .compact()
    }

    fun getEmailFromPasswordResetToken(token: String): String? {
        val claims = getClaimsToken(token) ?: return null
        val isResetToken = claims[PASSWORD_RESET_CLAIM] as? Boolean ?: false
        val expirationDate = claims.expiration
        val now = Date(System.currentTimeMillis())

        if (!isResetToken || expirationDate == null || !now.before(expirationDate)) {
            return null
        }

        return claims.subject
    }

    companion object {
        private const val PASSWORD_RESET_CLAIM = "passwordReset"
        private const val passwordResetExpiration: Long = 1800000 // 30 minutos
    }
}
