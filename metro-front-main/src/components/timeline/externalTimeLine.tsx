import {useEffect, useState} from 'react'

// Linha do tempo (rastreio) do processo para o cliente.
// Proposital: estilo inline + um bloco <style> proprio (sem styled-components,
// sem bibliotecas de icone), para que nada possa quebrar a renderizacao.

const CSS = `
@keyframes rtkFadeUp { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform:none; } }
@keyframes rtkPulse {
  0%   { box-shadow: 0 0 0 0 rgba(71,98,234,.55); }
  70%  { box-shadow: 0 0 0 14px rgba(71,98,234,0); }
  100% { box-shadow: 0 0 0 0 rgba(71,98,234,0); }
}
@keyframes rtkPop { 0% { transform: scale(.4); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
@keyframes rtkShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes rtkShine { 0% { transform: translateX(-120%);} 100% { transform: translateX(320%);} }
@keyframes rtkFloat { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-4px);} }

/* 'backwards': durante o atraso usa o estado inicial, e ao terminar volta ao
   estilo base (visivel). Assim, se a animacao nao rodar, o conteudo aparece. */
.rtk-enter { animation: rtkFadeUp .55s cubic-bezier(.22,1,.36,1) backwards; }
.rtk-pulse { animation: rtkPulse 1.9s infinite; }
.rtk-pop   { animation: rtkPop .45s cubic-bezier(.22,1,.36,1); }
.rtk-head  { background-size: 220% 220%; animation: rtkShift 9s ease infinite; }
.rtk-float { animation: rtkFloat 3.5s ease-in-out infinite; }
.rtk-bar   { transition: width 1.2s cubic-bezier(.22,1,.36,1); }
.rtk-shine { animation: rtkShine 2.6s ease-in-out infinite; }
.rtk-card  { transition: transform .18s ease, box-shadow .18s ease; }
.rtk-card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,0,0,.10); }
`

const IconCheck = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
         strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
)

const IconClock = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
         strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 7 12 12 15.5 14"/>
    </svg>
)

const IconAlert = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
         strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="7" x2="12" y2="13"/>
        <circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
)

const IconFlag = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21V4h11l-1.5 3.5L15 11H4"/>
    </svg>
)

// Numero de WhatsApp que recebe os chamados dos clientes (55 + DDD + numero).
// Pode ser trocado pela variavel de ambiente REACT_APP_WHATSAPP_SUPORTE.
const WHATSAPP_SUPORTE = process.env.REACT_APP_WHATSAPP_SUPORTE || '5598985594554'

const IconWhats = () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6a9.3 9.3 0 0 0 3.7 3.2c1.6.6 1.9.5 2.3.5.4 0 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1z"/>
    </svg>
)

function montarLinkChamado(codigo: string | undefined, papel: string | undefined, etapa: string) {
    const quem = papel || 'cliente'
    const id = codigo ? ` de ID ${codigo}` : ''
    const texto =
        `Olá! Sou o ${quem}${id} e tenho uma dúvida sobre a etapa atual do meu processo: "${etapa}".`
    return `https://wa.me/${WHATSAPP_SUPORTE}?text=${encodeURIComponent(texto)}`
}

export const ExternalTimelineComponent = ({steps, titulo, info, codigo, papel}: any) => {
    const list = Array.isArray(steps) ? steps.filter(Boolean) : []
    const chips = Array.isArray(info) ? info.filter(Boolean) : []

    const total = list.length
    const concluidas = list.filter((s: any) => s && s.stepCompleted === 'COMPLETED').length
    const pct = total ? Math.round((concluidas / total) * 100) : 0
    const atualIdx = list.findIndex((s: any) => s && s.stepCompleted !== 'COMPLETED')
    const tudoConcluido = total > 0 && atualIdx === -1

    // barra de progresso anima de 0 ate o valor
    const [barra, setBarra] = useState(0)
    useEffect(() => {
        const t = setTimeout(() => setBarra(pct), 120)
        return () => clearTimeout(t)
    }, [pct])

    if (total === 0) {
        return (
            <div style={{padding: 16, textAlign: 'center', color: '#888'}}>
                Nenhuma etapa encontrada para este processo.
            </div>
        )
    }

    return (
        <div style={{maxWidth: 580, margin: '0 auto', padding: '6px 14px 36px'}}>
            <style>{CSS}</style>

            {/* ---------- Cabecalho ---------- */}
            <div
                className="rtk-head rtk-enter"
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(120deg,#4762EA 0%,#7B5CF0 45%,#22A6F2 100%)',
                    color: '#fff',
                    borderRadius: 18,
                    padding: '20px 22px 18px',
                    boxShadow: '0 12px 30px rgba(71,98,234,.32)',
                    marginBottom: 26,
                }}
            >
                {/* brilho passando */}
                <div
                    className="rtk-shine"
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '45%', height: '100%',
                        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)',
                        pointerEvents: 'none',
                    }}
                />
                <div style={{display: 'flex', alignItems: 'center', gap: 10, position: 'relative'}}>
                    <div className="rtk-float" style={{opacity: .95}}>
                        <IconFlag/>
                    </div>
                    <div style={{fontSize: 18, fontWeight: 800, letterSpacing: .2}}>
                        {titulo
                            ? titulo
                            : tudoConcluido ? 'Processo concluído! 🎉' : 'Acompanhe seu processo'}
                    </div>
                </div>

                <div style={{fontSize: 13, opacity: .93, marginTop: 6, position: 'relative'}}>
                    {tudoConcluido
                        ? `🎉 Todas as ${total} etapas foram concluídas`
                        : `Etapa ${Math.min(concluidas + 1, total)} de ${total} · ${concluidas} já concluída(s)`}
                </div>

                <div
                    style={{
                        height: 12, background: 'rgba(255,255,255,.28)', borderRadius: 20,
                        marginTop: 14, overflow: 'hidden', position: 'relative',
                    }}
                >
                    <div
                        className="rtk-bar"
                        style={{
                            height: '100%', width: barra + '%', borderRadius: 20,
                            background: 'linear-gradient(90deg,#ffffff,#d8e4ff)',
                            boxShadow: '0 0 12px rgba(255,255,255,.7)',
                        }}
                    />
                </div>
                <div style={{textAlign: 'right', fontSize: 13, fontWeight: 800, marginTop: 6}}>
                    {barra}%
                </div>

                {chips.length > 0 && (
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, position: 'relative',
                    }}>
                        {chips.map((c: any, idx: number) => (
                            <div
                                key={idx}
                                style={{
                                    background: 'rgba(255,255,255,.18)',
                                    border: '1px solid rgba(255,255,255,.28)',
                                    borderRadius: 20,
                                    padding: '4px 11px',
                                    fontSize: 11.5,
                                    lineHeight: 1.35,
                                }}
                            >
                                <span style={{opacity: .85}}>{c.label}: </span>
                                <strong>{c.value}</strong>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ---------- Etapas ---------- */}
            {list.map((s: any, i: number) => {
                const nome = (s && s.step) || 'Etapa'
                const concluida = !!(s && s.stepCompleted === 'COMPLETED')
                const pendencia = !!(s && s.stepStatus === 'UNFORESEEN')
                const atual = i === atualIdx && !pendencia
                const futura = !concluida && !atual && !pendencia

                let cor = '#c2c6cf'
                let fundo = '#ffffff'
                let borda = '#eceef2'
                let rotulo = 'A fazer'
                let rotuloBg = '#f1f2f4'
                let rotuloFg = '#9aa0a6'
                let icone: any = <span style={{width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'block'}}/>

                if (pendencia) {
                    cor = '#e44258'; fundo = '#fff6f6'; borda = '#f7d3d8'
                    rotulo = 'Pendência'; rotuloBg = '#fde7ea'; rotuloFg = '#c9304a'
                    icone = <IconAlert/>
                } else if (concluida) {
                    cor = '#17b978'; fundo = '#ffffff'; borda = '#e4f3ec'
                    rotulo = 'Concluída'; rotuloBg = '#e6f8f0'; rotuloFg = '#0f8a5f'
                    icone = <IconCheck/>
                } else if (atual) {
                    cor = '#4762EA'; fundo = '#eef1fe'; borda = '#c9d4fb'
                    rotulo = 'Você está aqui'; rotuloBg = '#4762EA'; rotuloFg = '#ffffff'
                    icone = <IconClock/>
                }

                return (
                    <div
                        key={i}
                        className="rtk-enter"
                        style={{
                            display: 'flex',
                            gap: 14,
                            animationDelay: Math.min(i, 14) * 55 + 'ms',
                        }}
                    >
                        {/* trilha */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0}}>
                            <div
                                className={atual ? 'rtk-pulse' : concluida ? 'rtk-pop' : ''}
                                style={{
                                    width: 34, height: 34, borderRadius: '50%',
                                    background: futura ? '#ffffff' : cor,
                                    border: futura ? '2px solid #e1e4e9' : 'none',
                                    color: futura ? '#c2c6cf' : '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: futura ? 'none' : '0 3px 8px rgba(0,0,0,.14)',
                                }}
                            >
                                {futura
                                    ? <span style={{width: 8, height: 8, borderRadius: '50%', background: '#d3d7dd', display: 'block'}}/>
                                    : icone}
                            </div>
                            {i < total - 1 && (
                                <div
                                    style={{
                                        flex: 1, width: 4, minHeight: 26, marginTop: 3, borderRadius: 3,
                                        background: concluida
                                            ? 'linear-gradient(180deg,#17b978,#9fe6c8)'
                                            : '#e6e8ec',
                                    }}
                                />
                            )}
                        </div>

                        {/* cartao da etapa */}
                        <div
                            className="rtk-card"
                            style={{
                                flex: 1,
                                marginBottom: 12,
                                background: fundo,
                                border: '1px solid ' + borda,
                                borderLeft: '4px solid ' + (futura ? '#e6e8ec' : cor),
                                borderRadius: 14,
                                padding: '12px 14px',
                                boxShadow: atual
                                    ? '0 8px 22px rgba(71,98,234,.18)'
                                    : '0 1px 3px rgba(0,0,0,.05)',
                                opacity: futura ? .72 : 1,
                            }}
                        >
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8}}>
                                <div style={{
                                    fontWeight: 700, fontSize: 15, lineHeight: 1.3,
                                    color: futura ? '#9aa0a6' : '#2b2f36',
                                }}>
                                    {nome}
                                </div>
                                <span style={{
                                    flexShrink: 0, fontSize: 10.5, fontWeight: 800,
                                    padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
                                    background: rotuloBg, color: rotuloFg,
                                }}>
                                    {rotulo}
                                </span>
                            </div>

                            <div style={{fontSize: 11.5, color: '#9aa0a6', marginTop: 4}}>
                                Etapa {i + 1} de {total}
                                {s && s.deadline ? ' · prazo ' + s.deadline + ' dia(s)' : ''}
                            </div>

                            {s && s.stepUnforeseenDescription ? (
                                <div style={{
                                    fontSize: 12.5, marginTop: 8, padding: '7px 10px', borderRadius: 9,
                                    background: '#fde7ea', color: '#c9304a',
                                }}>
                                    ⚠️ {s.stepUnforeseenDescription}
                                </div>
                            ) : null}

                            {s && s.observation ? (
                                <div style={{
                                    fontSize: 12.5, marginTop: 8, padding: '7px 10px', borderRadius: 9,
                                    background: '#f5f6f8', color: '#474a51',
                                }}>
                                    📝 {s.observation}
                                </div>
                            ) : null}

                            {atual && WHATSAPP_SUPORTE ? (
                                <a
                                    href={montarLinkChamado(codigo, papel, nome)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 8, marginTop: 12, padding: '10px 12px', borderRadius: 10,
                                        background: '#25D366', color: '#fff', fontWeight: 800,
                                        fontSize: 13, textDecoration: 'none',
                                        boxShadow: '0 4px 12px rgba(37,211,102,.35)',
                                    }}
                                >
                                    <IconWhats/> Tenho uma dúvida nesta etapa
                                </a>
                            ) : null}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
