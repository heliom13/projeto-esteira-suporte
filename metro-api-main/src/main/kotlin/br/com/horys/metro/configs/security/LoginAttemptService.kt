package br.com.horys.metro.configs.security

import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

/**
 * Proteção simples contra força bruta no login (em memória).
 * Após [maxFalhas] tentativas erradas, bloqueia aquele e-mail por [bloqueioMs].
 * Projetado para ser "fail-open": qualquer erro interno libera (nunca trava o login por bug).
 */
@Service
class LoginAttemptService {

    private data class Registro(var falhas: Int, var bloqueadoAte: Long)

    private val mapa = ConcurrentHashMap<String, Registro>()
    private val maxFalhas = 5
    private val bloqueioMs = 15 * 60 * 1000L // 15 minutos

    fun estaBloqueado(chave: String?): Boolean {
        if (chave.isNullOrBlank()) return false
        return try {
            val r = mapa[chave.lowercase()] ?: return false
            r.bloqueadoAte > System.currentTimeMillis()
        } catch (e: Exception) {
            false // fail-open
        }
    }

    fun registrarFalha(chave: String?) {
        if (chave.isNullOrBlank()) return
        try {
            val k = chave.lowercase()
            val r = mapa.getOrPut(k) { Registro(0, 0L) }
            r.falhas += 1
            if (r.falhas >= maxFalhas) {
                r.bloqueadoAte = System.currentTimeMillis() + bloqueioMs
                r.falhas = 0
            }
        } catch (e: Exception) {
            // fail-open: ignora
        }
    }

    fun registrarSucesso(chave: String?) {
        if (chave.isNullOrBlank()) return
        try {
            mapa.remove(chave.lowercase())
        } catch (e: Exception) {
            // ignora
        }
    }
}
