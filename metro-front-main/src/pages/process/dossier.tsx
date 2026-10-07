import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Button, Card, Col, Empty, Progress, Result, Row, Spin, Tag, Timeline, Typography, message} from 'antd'
import {ArrowLeftOutlined, CopyOutlined} from '@ant-design/icons'
import moment from 'moment'
import api from '../../services/api'

const {Title, Text} = Typography

const COR = '#4762EA'

const fmt = (d?: string | null) => (d ? moment(d).format('DD/MM/YYYY HH:mm') : '—')
const fmtDia = (d?: string | null) => (d ? moment(d).format('DD/MM/YYYY') : '—')
const dinheiro = (v?: number | null) =>
    v == null ? '—' : Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})

const STATUS_PROCESSO: Record<string, { txt: string; cor: string }> = {
    ACTIVE: {txt: 'Ativo', cor: 'green'},
    SOLD: {txt: 'Concluído', cor: 'blue'},
    CANCELLED: {txt: 'Cancelado', cor: 'red'},
}

const TIPO_PROPOSTA: Record<string, string> = {
    CASH: 'À vista',
    FINANCING: 'Financiamento',
    CONSIGNMENT: 'Consignado',
    CONSORTIUM: 'Consórcio',
    CONTRACT: 'Contrato',
    LOAN: 'Empréstimo',
    REGULARIZATION: 'Regularização',
}

const ICONE_EVENTO: Record<string, string> = {
    PROCESS_CREATED: '🆕',
    PROCESS_STEP_COMPLETED: '✅',
    PROCESS_UPDATED: '⚠️',
    PROCESS_FINISHED: '🏁',
    PROCESS_CANCELLED: '❌',
    PROCESS_CHANGED_USER: '👤',
    COMMENT_ADDED: '💬',
}

const copiar = (texto: string) => {
    navigator.clipboard
        .writeText(texto)
        .then(() => message.success('Link copiado!'))
        .catch(() => message.error('Não foi possível copiar'))
}

const Campo = ({rotulo, valor}: { rotulo: string; valor: any }) => (
    <div style={{display: 'flex', gap: 8, fontSize: 13, padding: '4px 0', borderBottom: '1px dashed #f0f0f0'}}>
        <span style={{color: '#8a8f98', minWidth: 112, flexShrink: 0}}>{rotulo}</span>
        <span style={{color: '#2b2f36', wordBreak: 'break-word'}}>{valor || '—'}</span>
    </div>
)

const LinkDrive = ({url}: { url?: string | null }) =>
    url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{display: 'inline-block', marginTop: 8}}>
            📁 Abrir pasta no Drive
        </a>
    ) : null

const CardParte = ({titulo, p}: { titulo: string; p: any }) =>
    p ? (
        <Card size="small" title={titulo} style={{marginBottom: 16}}>
            <Campo rotulo="Nome" valor={p.nome}/>
            <Campo rotulo="CPF/CNPJ" valor={p.documento}/>
            <Campo rotulo="Telefone" valor={p.telefone}/>
            <Campo rotulo="Telefone 2" valor={p.telefoneSecundario}/>
            <Campo rotulo="E-mail" valor={p.email}/>
            <Campo rotulo="Endereço" valor={p.endereco}/>
            <LinkDrive url={p.linkDrive}/>
        </Card>
    ) : null

const CardCorretor = ({titulo, c}: { titulo: string; c: any }) =>
    c ? (
        <Card size="small" title={titulo} style={{marginBottom: 16}}>
            <Campo rotulo="Nome" valor={c.nome}/>
            <Campo rotulo="CRECI" valor={c.creci}/>
            <Campo rotulo="Telefone" valor={c.telefone}/>
            <Campo rotulo="E-mail" valor={c.email}/>
        </Card>
    ) : null

const LinhaLink = ({rotulo, url}: { rotulo: string; url?: string | null }) =>
    url ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px dashed #f0f0f0'}}>
            <span style={{fontSize: 13, flex: 1}}>{rotulo}</span>
            <Button size="small" icon={<CopyOutlined/>} onClick={() => copiar(url)}>Copiar</Button>
            <Button size="small" href={url} target="_blank" rel="noopener noreferrer">Abrir</Button>
        </div>
    ) : null

const ProcessDossier = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [d, setD] = useState<any>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<number | null>(null)

    useEffect(() => {
        setCarregando(true)
        setErro(null)
        api.get(`/processes/${id}/dossier`)
            .then((r) => setD(r.data))
            .catch((e) => setErro((e && e.response && e.response.status) || 500))
            .finally(() => setCarregando(false))
    }, [id])

    if (carregando) {
        return (
            <div style={{textAlign: 'center', marginTop: 80}}>
                <Spin tip="Carregando dossiê..."/>
            </div>
        )
    }
    if (erro === 403) {
        return (
            <Result status="403" title="Sem permissão" subTitle="Você não tem acesso a este processo."
                    extra={<Button onClick={() => navigate(-1)}>Voltar</Button>}/>
        )
    }
    if (erro || !d) {
        return (
            <Result status="404" title="Processo não encontrado"
                    extra={<Button onClick={() => navigate(-1)}>Voltar</Button>}/>
        )
    }

    const st = STATUS_PROCESSO[d.status] || {txt: d.status, cor: 'default'}
    const pct = d.totalEtapas ? Math.round((d.etapasConcluidas / d.totalEtapas) * 100) : 0
    const atrasado = d.status === 'ACTIVE' && d.prazoTotalDias > 0 && d.diasEmAberto > d.prazoTotalDias
    const etapas: any[] = d.etapas || []
    const historico: any[] = [...(d.historico || [])].reverse() // mais recente primeiro
    const comentarios: any[] = d.comentarios || []
    const links = d.links || {}

    return (
        <div style={{maxWidth: 1240}}>
            <Button type="link" icon={<ArrowLeftOutlined/>} onClick={() => navigate(-1)} style={{paddingLeft: 0}}>
                Voltar
            </Button>

            {/* ---------- Cabecalho ---------- */}
            <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, justifyContent: 'space-between'}}>
                <div>
                    <Title level={3} style={{margin: 0, color: COR}}>
                        Processo {d.code || `#${d.id}`}
                        <Tag color={st.cor} style={{verticalAlign: 'middle', marginLeft: 10}}>{st.txt}</Tag>
                    </Title>
                    <Text type="secondary">
                        {d.fluxo} · {d.tipoFluxo} · Responsável: <strong>{d.responsavel}</strong>
                    </Text>
                </div>
                {d.status === 'ACTIVE' ? (
                    <Button type="primary" onClick={() => navigate(`../mudar-etapa/${d.id}`)}>
                        Ir para a tela de etapas
                    </Button>
                ) : null}
            </div>

            {/* ---------- Indicadores ---------- */}
            <Row gutter={[16, 16]} style={{marginTop: 16}}>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small">
                        <Text type="secondary">Progresso</Text>
                        <div style={{fontSize: 22, fontWeight: 700}}>
                            {d.etapasConcluidas}/{d.totalEtapas} etapas
                        </div>
                        <Progress percent={pct} size="small" strokeColor={COR}/>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small">
                        <Text type="secondary">Em aberto há</Text>
                        <div style={{fontSize: 22, fontWeight: 700, color: atrasado ? '#e44258' : undefined}}>
                            {d.diasEmAberto} dias
                        </div>
                        <Text type="secondary" style={{fontSize: 12}}>
                            Prazo total: {d.prazoTotalDias} dias{atrasado ? ' · ATRASADO' : ''}
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small">
                        <Text type="secondary">Etapa atual</Text>
                        <div style={{fontSize: 15, fontWeight: 700, marginTop: 4}}>
                            {d.etapaAtual || (d.status === 'SOLD' ? 'Processo concluído' : '—')}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small">
                        <Text type="secondary">Datas</Text>
                        <div style={{fontSize: 13, marginTop: 4}}>Criado: <strong>{fmt(d.criadoEm)}</strong></div>
                        <div style={{fontSize: 13}}>Atualizado: <strong>{fmt(d.atualizadoEm)}</strong></div>
                    </Card>
                </Col>
            </Row>

            {d.motivoCancelamento ? (
                <Card size="small" style={{marginTop: 16, borderColor: '#f7d3d8', background: '#fff6f6'}}>
                    <strong style={{color: '#c9304a'}}>Motivo do cancelamento:</strong> {d.motivoCancelamento}
                </Card>
            ) : null}

            <Row gutter={[16, 16]} style={{marginTop: 16}}>
                {/* ---------- Etapas ---------- */}
                <Col xs={24} lg={15}>
                    <Card title={`Linha do tempo das etapas (${etapas.length})`} size="small">
                        <Timeline>
                            {etapas.map((e: any, i: number) => {
                                const concluida = e.status === 'COMPLETED'
                                const cor = e.imprevisto ? 'red' : concluida ? 'green' : e.atual ? 'blue' : 'gray'
                                const rotulo = e.imprevisto
                                    ? 'Imprevisto'
                                    : concluida
                                        ? 'Concluída'
                                        : e.atual
                                            ? 'Etapa atual'
                                            : e.status === 'CANCELLED'
                                                ? 'Cancelada'
                                                : 'A fazer'
                                const futura = cor === 'gray'
                                return (
                                    <Timeline.Item key={i} color={cor}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap'}}>
                                            <strong style={{color: futura ? '#9aa0a6' : '#2b2f36'}}>
                                                {e.ordem}. {e.descricao}
                                            </strong>
                                            <Tag color={futura ? 'default' : cor}>{rotulo}</Tag>
                                        </div>
                                        <div style={{fontSize: 12, color: '#8a8f98'}}>
                                            Prazo: {e.prazoDias} dia(s)
                                            {concluida ? ` · Concluída em ${fmt(e.concluidaEm)}` : ''}
                                            {concluida && e.concluidaPor ? ` por ${e.concluidaPor}` : ''}
                                        </div>
                                        {e.motivoImprevisto ? (
                                            <div style={{fontSize: 12.5, marginTop: 6, padding: '6px 9px', borderRadius: 6, background: '#fde7ea', color: '#c9304a'}}>
                                                ⚠️ {e.motivoImprevisto}
                                            </div>
                                        ) : null}
                                        {e.observacao ? (
                                            <div style={{fontSize: 12.5, marginTop: 6, padding: '6px 9px', borderRadius: 6, background: '#f5f6f8', color: '#474a51'}}>
                                                📝 {e.observacao}
                                            </div>
                                        ) : null}
                                        {(e.anotacoes || []).map((a: any, j: number) => (
                                            <div key={j} style={{fontSize: 12, marginTop: 6, padding: '5px 8px', borderRadius: 6, background: '#fffbe6', border: '1px solid #ffe58f'}}>
                                                🗒️ {a.conteudo}{' '}
                                                <span style={{color: '#8a8f98'}}>— {a.autor}, {fmt(a.em)}</span>
                                            </div>
                                        ))}
                                    </Timeline.Item>
                                )
                            })}
                        </Timeline>
                    </Card>
                </Col>

                {/* ---------- Partes, links, proposta, faturamento ---------- */}
                <Col xs={24} lg={9}>
                    <CardParte titulo="👤 Cliente comprador" p={d.cliente}/>
                    <CardParte titulo="🤝 Vendedor" p={d.vendedor}/>

                    {d.imovel ? (
                        <Card size="small" title="🏠 Imóvel" style={{marginBottom: 16}}>
                            <Campo rotulo="Descrição" valor={d.imovel.descricao}/>
                            <Campo rotulo="Endereço" valor={d.imovel.endereco}/>
                            <Campo rotulo="Proprietário" valor={d.imovel.proprietario}/>
                            <Campo rotulo="Doc. proprietário" valor={d.imovel.documentoProprietario}/>
                            <Campo rotulo="Telefone" valor={d.imovel.telefone}/>
                            <Campo rotulo="E-mail" valor={d.imovel.email}/>
                            <Campo rotulo="Valor" valor={dinheiro(d.imovel.valor)}/>
                            <Campo rotulo="Valor financiado" valor={dinheiro(d.imovel.valorFinanciado)}/>
                            <LinkDrive url={d.imovel.linkDrive}/>
                        </Card>
                    ) : null}

                    <CardCorretor titulo="🏢 Corretor principal" c={d.corretorPrincipal}/>
                    <CardCorretor titulo="🏢 Corretor secundário" c={d.corretorSecundario}/>

                    {links.cliente || links.imovel || links.corretor || d.linkDrive ? (
                        <Card size="small" title="🔗 Links de acompanhamento" style={{marginBottom: 16}}>
                            <LinhaLink rotulo="Rastreio do cliente" url={links.cliente}/>
                            <LinhaLink rotulo="Rastreio do vendedor/imóvel" url={links.imovel}/>
                            <LinhaLink rotulo="Rastreio do corretor" url={links.corretor}/>
                            <LinkDrive url={d.linkDrive}/>
                        </Card>
                    ) : null}

                    {d.proposta ? (
                        <Card size="small" title="📄 Proposta" style={{marginBottom: 16}}>
                            <Campo rotulo="Tipo" valor={TIPO_PROPOSTA[d.proposta.tipo] || d.proposta.tipo}/>
                            <Campo rotulo="Status" valor={d.proposta.status}/>
                            <Campo rotulo="Criada em" valor={fmtDia(d.proposta.criadaEm)}/>
                        </Card>
                    ) : null}

                    {d.faturamento ? (
                        <Card size="small" title="💰 Faturamento" style={{marginBottom: 16}}>
                            <Campo rotulo="Nota nº" valor={d.faturamento.numeroNota}/>
                            <Campo rotulo="Valor" valor={dinheiro(d.faturamento.valor)}/>
                            <Campo rotulo="Taxa" valor={dinheiro(d.faturamento.taxa)}/>
                            <Campo rotulo="Emitido em" valor={fmtDia(d.faturamento.emitidoEm)}/>
                            {(d.faturamento.comissoes || []).map((c: any, i: number) => (
                                <Campo key={i} rotulo={`Comissão: ${c.descricao}`} valor={dinheiro(c.valor)}/>
                            ))}
                        </Card>
                    ) : null}
                </Col>
            </Row>

            {/* ---------- Historico completo ---------- */}
            <Card title={`Histórico completo (${historico.length} eventos)`} size="small" style={{marginTop: 16}}>
                {historico.length === 0 ? (
                    <Empty description="Nenhum evento registrado"/>
                ) : (
                    <Timeline>
                        {historico.map((h: any, i: number) => (
                            <Timeline.Item key={i} dot={<span style={{fontSize: 15}}>{ICONE_EVENTO[h.tipo] || '•'}</span>}>
                                <div style={{fontSize: 13}}>
                                    <strong>{h.tipoDescricao}</strong> — {h.descricao}
                                </div>
                                <div style={{fontSize: 12, color: '#8a8f98'}}>
                                    {fmt(h.em)}
                                    {h.usuario ? ` · por ${h.usuario}` : ''}
                                    {h.etapa ? ` · etapa: ${h.etapa}` : ''}
                                </div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                )}
            </Card>

            {/* ---------- Comentarios ---------- */}
            <Card title={`Comentários (${comentarios.length})`} size="small" style={{marginTop: 16, marginBottom: 24}}>
                {comentarios.length === 0 ? (
                    <Empty description="Nenhum comentário"/>
                ) : (
                    comentarios.map((c: any, i: number) => (
                        <div key={i} style={{padding: '8px 0', borderBottom: '1px solid #f0f0f0'}}>
                            <div style={{fontSize: 13}}>
                                <strong>{c.autor}</strong>{' '}
                                <span style={{color: '#8a8f98', fontSize: 12}}>{fmt(c.em)}</span>
                            </div>
                            <div style={{fontSize: 13, whiteSpace: 'pre-wrap'}}>{c.conteudo}</div>
                            {(c.respostas || []).map((r: any, j: number) => (
                                <div key={j} style={{marginLeft: 16, marginTop: 6, paddingLeft: 10, borderLeft: '3px solid #e6e9ef', fontSize: 12.5}}>
                                    <strong>{r.autor}</strong>{' '}
                                    <span style={{color: '#8a8f98'}}>{fmt(r.em)}</span>
                                    <div style={{whiteSpace: 'pre-wrap'}}>{r.conteudo}</div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </Card>
        </div>
    )
}

export default ProcessDossier
