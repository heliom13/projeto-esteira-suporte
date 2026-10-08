package br.com.horys.metro.configs.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.security.SecureRandom
import java.util.Base64
import java.util.Date
import javax.servlet.http.HttpServletRequest

@Component
class JWTUtil {

    private val log = LoggerFactory.getLogger(this::class.java)

    /**
     * Segredo de assinatura dos tokens, lido de JWT_SECRET.
     *
     * Nao existe mais segredo fixo no codigo: o antigo ficou exposto no
     * historico do repositorio e permitia forjar tokens de administrador.
     * Sem a variavel definida, um segredo aleatorio e gerado a cada
     * inicializacao — o sistema continua funcionando, mas as sessoes caem a
     * cada reinicio. DEFINA JWT_SECRET no Render para ter sessoes estaveis.
     */
    private val secret: String = System.getenv("JWT_SECRET")?.takeIf { it.isNotBlank() }
        ?: run {
            val aleatorio = ByteArray(48).also { SecureRandom().nextBytes(it) }
            log.warn(
                ">>> [SEGURANCA] JWT_SECRET nao definido. Usando um segredo aleatorio " +
                    "gerado agora: as sessoes serao encerradas a cada reinicio. " +
                    "Defina JWT_SECRET nas variaveis de ambiente."
            )
            Base64.getEncoder().encodeToString(aleatorio)
        }

    // Validade do token de login: usa JWT_EXPIRATION_MS se definido; padrao 12h
    // (um dia de trabalho). Antes o padrao era ~7 dias.
    private val expiration: Long = System.getenv("JWT_EXPIRATION_MS")?.toLongOrNull() ?: 43200000

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
        // O token do link "esqueci a senha" serve SO para redefinir a senha,
        // nunca como login (os dois sao assinados com a mesma chave).
        if (claims != null && claims[PASSWORD_RESET_CLAIM] == true) return false
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

        if (authorizationHeader != null && authorizationHeader.length > 7 && authorizationHeader.startsWith("Bearer ")) {
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
