package br.com.horys.metro.controllers.response

import java.math.BigDecimal
import java.time.LocalDateTime

/** Resultado curto da busca de processos (barra lateral). */
data class ProcessLookupResponse(
    val id: Long,
    val code: String?,
    val cliente: String?,
    val fluxo: String,
    val status: String,
    val etapaAtual: String?
)

/** Dossie completo de um processo: tudo o que o analista precisa numa tela so. */
data class ProcessDossierResponse(
    val id: Long,
    val code: String?,
    val status: String,
    val criadoEm: LocalDateTime,
    val atualizadoEm: LocalDateTime,
    val diasEmAberto: Long,
    val prazoTotalDias: Int,
    val totalEtapas: Int,
    val etapasConcluidas: Int,
    val fluxo: String,
    val tipoFluxo: String,
    val responsavel: String,
    val responsavelEmail: String,
    val etapaAtual: String?,
    val motivoCancelamento: String?,
    val linkDrive: String?,
    val cliente: Parte?,
    val vendedor: Parte?,
    val imovel: Imovel?,
    val corretorPrincipal: Corretor?,
    val corretorSecundario: Corretor?,
    val proposta: Proposta?,
    val links: Links,
    val etapas: List<Etapa>,
    val historico: List<Evento>,
    val comentarios: List<Comentario>,
    val faturamento: Faturamento?
) {
    data class Parte(
        val nome: String,
        val documento: String?,
        val email: String?,
        val telefone: String?,
        val telefoneSecundario: String?,
        val endereco: String?,
        val linkDrive: String?
    )

    data class Imovel(
        val descricao: String,
        val endereco: String?,
        val proprietario: String,
        val documentoProprietario: String?,
        val telefone: String?,
        val email: String?,
        val valor: BigDecimal?,
        val valorFinanciado: BigDecimal?,
        val linkDrive: String?
    )

    data class Corretor(
        val nome: String,
        val creci: String?,
        val telefone: String?,
        val email: String?
    )

    data class Proposta(
        val id: Long,
        val tipo: String,
        val status: String,
        val criadaEm: LocalDateTime
    )

    data class Links(
        val cliente: String?,
        val imovel: String?,
        val corretor: String?
    )

    data class Etapa(
        val ordem: Int,
        val descricao: String,
        val status: String,
        val atual: Boolean,
        val imprevisto: Boolean,
        val prazoDias: Int,
        val concluidaEm: LocalDateTime?,
        val concluidaPor: String?,
        val observacao: String?,
        val motivoImprevisto: String?,
        val anotacoes: List<Anotacao>
    )

    data class Anotacao(
        val conteudo: String,
        val autor: String,
        val em: LocalDateTime
    )

    data class Evento(
        val tipo: String,
        val tipoDescricao: String,
        val descricao: String,
        val etapa: String?,
        val usuario: String?,
        val em: LocalDateTime
    )

    data class Comentario(
        val conteudo: String,
        val autor: String,
        val em: LocalDateTime,
        val respostas: List<Anotacao>
    )

    data class Faturamento(
        val numeroNota: Long,
        val valor: Double,
        val taxa: BigDecimal,
        val emitidoEm: LocalDateTime,
        val comissoes: List<Comissao>
    )

    data class Comissao(
        val descricao: String,
        val valor: Double
    )
}
