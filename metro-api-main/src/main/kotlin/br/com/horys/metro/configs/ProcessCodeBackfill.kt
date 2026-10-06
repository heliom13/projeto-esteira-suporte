package br.com.horys.metro.configs

import br.com.horys.metro.repositories.ProcessRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

/**
 * Preenche o codigo (ano-sequencia, ex: 2026-0001) dos processos criados antes
 * de a coluna existir. Idempotente: so altera processos sem codigo, entao rodar
 * de novo nao muda nada. Fail-open: qualquer erro nao impede a aplicacao de subir.
 */
@Component
class ProcessCodeBackfill(
    private val processRepository: ProcessRepository
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {
        try {
            val semCodigo = processRepository.findAll()
                .filter { it.code.isNullOrBlank() }
                .sortedBy { it.createdAt }

            if (semCodigo.isEmpty()) {
                log.info(">>> Nenhum processo sem codigo. Nada a preencher.")
                return
            }

            // Mantem uma sequencia por ano, continuando de onde o ano ja parou.
            val sequenciaPorAno = HashMap<Int, Int>()

            val atualizados = semCodigo.map { processo ->
                val ano = processo.createdAt.year
                val anterior = sequenciaPorAno.getOrPut(ano) {
                    processRepository.findMaxCodeByPrefix("$ano-")
                        ?.substringAfter("-")?.trim()?.toIntOrNull() ?: 0
                }
                val sequencia = anterior + 1
                sequenciaPorAno[ano] = sequencia
                processo.copy(code = "$ano-" + sequencia.toString().padStart(4, '0'))
            }

            processRepository.saveAll(atualizados)
            log.info(">>> Codigo gerado para ${atualizados.size} processo(s) antigo(s).")
        } catch (e: Exception) {
            log.error("Falha ao preencher o codigo dos processos antigos: ${e.message}", e)
        }
    }
}
