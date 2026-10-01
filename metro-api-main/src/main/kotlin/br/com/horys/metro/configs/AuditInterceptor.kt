package br.com.horys.metro.configs

import br.com.horys.metro.models.AuditLog
import br.com.horys.metro.repositories.AuditLogRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Auditoria LGPD: registra operacoes que modificam dados (POST/PUT/PATCH/DELETE).
 * Projetado como fail-open: qualquer erro ao auditar NAO afeta a requisicao.
 */
@Component
class AuditInterceptor(
    private val auditLogRepository: AuditLogRepository
) : HandlerInterceptor {

    private val metodosEscrita = setOf("POST", "PUT", "PATCH", "DELETE")

    override fun afterCompletion(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
        ex: Exception?
    ) {
        try {
            val metodo = request.method ?: return
            if (metodo !in metodosEscrita) return

            val path = request.requestURI ?: ""
            // Nao auditar fluxos de login/recuperacao de senha e webhooks
            if (path.startsWith("/v1/users/forgot") ||
                path.startsWith("/v1/users/reset") ||
                path.startsWith("/v1/webhook") ||
                path == "/login"
            ) return

            val auth = SecurityContextHolder.getContext()?.authentication
            val email = auth?.name

            auditLogRepository.save(
                AuditLog(
                    userEmail = email,
                    method = metodo,
                    path = path,
                    status = response.status
                )
            )
        } catch (e: Exception) {
            // fail-open: nunca interrompe a requisicao por causa da auditoria
        }
    }
}
