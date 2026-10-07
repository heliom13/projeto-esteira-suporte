package br.com.horys.metro.services

import br.com.horys.metro.controllers.response.ProcessDossierResponse
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Anotacao
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Comentario
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Comissao
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Corretor
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Etapa
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Evento
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Faturamento
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Imovel
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Links
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Parte
import br.com.horys.metro.controllers.response.ProcessDossierResponse.Proposta
import br.com.horys.metro.controllers.response.ProcessLookupResponse
import br.com.horys.metro.exceptions.ProcessNotFoundException
import br.com.horys.metro.models.AuditLog
import br.com.horys.metro.models.Client
import br.com.horys.metro.models.Notification
import br.com.horys.metro.models.Process
import br.com.horys.metro.models.ProcessStep
import br.com.horys.metro.models.Seller
import br.com.horys.metro.models.Step
import br.com.horys.metro.models.User
import br.com.horys.metro.repositories.AuditLogRepository
import br.com.horys.metro.repositories.CommentReplyRepository
import br.com.horys.metro.repositories.CommentRepository
import br.com.horys.metro.repositories.InvoiceRepository
import br.com.horys.metro.repositories.NotificationRepository
import br.com.horys.metro.repositories.ProcessRepository
import br.com.horys.metro.repositories.ProcessStepNoteRepository
import br.com.horys.metro.repositories.ProcessStepRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.PageRequest
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

/**
 * Monta o dossie de um processo (tudo numa resposta so) e a busca da barra lateral.
 *
 * Regra de acesso: segue a mesma da listagem de processos — usuario com papel
 * SECRETARY so enxerga os processos dos quais e responsavel.
 */
@Service
class ProcessDossierService(
    private val processRepository: ProcessRepository,
    private val processStepRepository: ProcessStepRepository,
    private val processStepNoteRepository: ProcessStepNoteRepository,
    private val notificationRepository: NotificationRepository,
    private val commentRepository: CommentRepository,
    private val commentReplyRepository: CommentReplyRepository,
    private val invoiceRepository: InvoiceRepository,
    private val auditLogRepository: AuditLogRepository,
    private val userService: UserService,
    @Value("\${app.front-url:https://metro-front-tuna.onrender.com}") private val frontUrl: String
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun lookup(q: String): List<ProcessLookupResponse> {
        val termo = q.trim()
        if (termo.isEmpty()) return emptyList()
        val user = userService.getLoggedInUser()
        return processRepository.lookup(termo, PageRequest.of(0, 25))
            .filter { podeVer(it, user) }
            .take(10)
            .map {
                ProcessLookupResponse(
                    id = it.id!!,
                    code = it.code,
                    cliente = it.client?.name,
                    fluxo = it.flow.description,
                    status = it.status.name,
                    etapaAtual = it.processStepCurrent?.getDescriptionStep() ?: it.stepCurrent.description
                )
            }
    }

    @Transactional(readOnly = true)
    fun dossier(id: Long): ProcessDossierResponse {
        val user = userService.getLoggedInUser()
        val p = processRepository.findById(id).orElseThrow { ProcessNotFoundException() }
        if (!podeVer(p, user)) throw AccessDeniedException("Sem permissão para ver este processo")

        registrarAcesso(user, id)

        val etapas = processStepRepository.findFlowSteps(id)
        val anotacoesPorEtapa = processStepNoteRepository.findAllByProcessId(id).groupBy { it.processStep.id }

        // Historico completo (todos os destinos), sem duplicatas: um mesmo evento
        // pode gerar varias notificacoes (uma por usuario avisado).
        val eventos = notificationRepository
            .findByProcessIdOrderByCreatedAtDesc(id, Notification.Destiny.values().toList())
            .distinctBy { Triple(it.type, it.description, it.createdAt.truncatedTo(ChronoUnit.SECONDS)) }
            .sortedBy { it.createdAt }

        // As etapas sao todas criadas junto com o processo, entao a data real de
        // conclusao vem do evento "Etapa concluida" registrado no historico.
        val conclusoes = eventos
            .filter { it.type == Notification.Type.PROCESS_STEP_COMPLETED }
            .groupBy { it.stepCurrent }

        val ativo = p.status == Process.Status.ACTIVE

        return ProcessDossierResponse(
            id = p.id!!,
            code = p.code,
            status = p.status.name,
            criadoEm = p.createdAt,
            atualizadoEm = p.updatedAt,
            diasEmAberto = ChronoUnit.DAYS.between(p.createdAt, LocalDateTime.now()),
            prazoTotalDias = p.totalDays,
            totalEtapas = etapas.size,
            etapasConcluidas = etapas.count { it.status == ProcessStep.Status.COMPLETED },
            fluxo = p.flow.description,
            tipoFluxo = p.flow.type.description,
            responsavel = p.user.name,
            responsavelEmail = p.user.email,
            etapaAtual = if (ativo) p.processStepCurrent?.getDescriptionStep() ?: p.stepCurrent.description else null,
            motivoCancelamento = p.reasonCancel,
            linkDrive = p.linkDrive,
            cliente = p.client?.let { parte(it) },
            vendedor = p.proposal.sellerClient?.let { parte(it) },
            imovel = p.property?.let {
                Imovel(
                    descricao = it.description,
                    endereco = it.address,
                    proprietario = it.ownerName,
                    documentoProprietario = it.ownerDocument,
                    telefone = it.phone,
                    email = it.email,
                    valor = it.price,
                    valorFinanciado = it.financialPrice,
                    linkDrive = it.linkDrive
                )
            },
            corretorPrincipal = p.sellerMain?.let { corretor(it) },
            corretorSecundario = p.sellerSecondary?.let { corretor(it) },
            proposta = Proposta(
                id = p.proposal.id!!,
                tipo = p.proposal.type.name,
                status = p.proposal.status.name,
                criadaEm = p.proposal.createdAt
            ),
            links = Links(
                cliente = p.client?.let { "${base()}/cliente-comprador/${it.externalId}" },
                imovel = p.property?.let { "${base()}/imovel/${it.externalId}" },
                corretor = p.sellerMain?.let { "${base()}/vendedor/${it.externalId}" }
            ),
            etapas = etapas.map { ps ->
                val conclusao = if (ps.status == ProcessStep.Status.COMPLETED)
                    conclusoes[ps.step.description]?.firstOrNull() else null
                Etapa(
                    ordem = ps.orderStep.toInt(),
                    descricao = ps.getDescriptionStep(),
                    status = ps.status.name,
                    atual = ativo && p.processStepCurrent?.id == ps.id,
                    imprevisto = ps.step.status == Step.Status.UNFORESEEN,
                    prazoDias = ps.step.deadline,
                    concluidaEm = conclusao?.createdAt,
                    concluidaPor = conclusao?.userOrigin?.name,
                    observacao = ps.observation,
                    motivoImprevisto = ps.reasonUnforeseen,
                    anotacoes = (anotacoesPorEtapa[ps.id] ?: emptyList()).map {
                        Anotacao(conteudo = it.content, autor = it.userName, em = it.createdAt)
                    }
                )
            },
            historico = eventos.map {
                Evento(
                    tipo = it.type.name,
                    tipoDescricao = it.type.description,
                    descricao = it.description,
                    etapa = it.stepCurrent,
                    usuario = it.userOrigin.name,
                    em = it.createdAt
                )
            },
            comentarios = commentRepository.findByProcessIdOrderByCreatedAtDesc(id).map { c ->
                Comentario(
                    conteudo = c.content,
                    autor = c.user.name,
                    em = c.createdAt,
                    respostas = commentReplyRepository.findByCommentIdOrderByIdDesc(c.id!!).map {
                        Anotacao(conteudo = it.content, autor = it.user.name, em = it.createdAt)
                    }
                )
            },
            faturamento = invoiceRepository.findInvoiceByProcessId(id).orElse(null)?.let { inv ->
                Faturamento(
                    numeroNota = inv.invoiceNumber,
                    valor = inv.value,
                    taxa = inv.fee,
                    emitidoEm = inv.createdAt,
                    comissoes = (inv.commission ?: emptyList()).map { Comissao(it.description, it.value) }
                )
            }
        )
    }

    private fun podeVer(p: Process, user: User): Boolean =
        user.role != User.Role.SECRETARY || p.user.id == user.id

    private fun base() = "${frontUrl.trimEnd('/')}/external"

    private fun parte(c: Client) = Parte(
        nome = c.name,
        documento = c.document,
        email = c.email,
        telefone = c.phone,
        telefoneSecundario = c.phoneSecondary,
        endereco = c.address,
        linkDrive = c.linkDrive
    )

    private fun corretor(s: Seller) = Corretor(
        nome = s.name,
        creci = s.creci,
        telefone = s.phone,
        email = s.email
    )

    /** LGPD: o dossie exibe dados pessoais, entao registra quem abriu. Fail-open. */
    private fun registrarAcesso(user: User, processId: Long) {
        try {
            auditLogRepository.save(
                AuditLog(
                    userEmail = user.email,
                    method = "GET",
                    path = "/v1/processes/$processId/dossier",
                    status = 200
                )
            )
        } catch (e: Exception) {
            log.warn("Nao foi possivel registrar acesso ao dossie: ${e.message}")
        }
    }
}
