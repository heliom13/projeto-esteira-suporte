// Linha do tempo (rastreio) do processo para o cliente.
// Proposital: apenas divs com estilo inline — sem styled-components,
// sem animacoes e sem biblioteca de icones, para nao haver nada que
// possa quebrar a renderizacao.

export const ExternalTimelineComponent = ({steps}: any) => {
    const list = Array.isArray(steps) ? steps.filter(Boolean) : []

    if (list.length === 0) {
        return (
            <div style={{padding: 16, textAlign: 'center', color: '#888'}}>
                Nenhuma etapa encontrada para este processo.
            </div>
        )
    }

    const total = list.length
    const concluidas = list.filter((s: any) => s && s.stepCompleted === 'COMPLETED').length
    const pct = total ? Math.round((concluidas / total) * 100) : 0
    // Etapa atual = primeira que ainda nao foi concluida
    const atualIdx = list.findIndex((s: any) => s && s.stepCompleted !== 'COMPLETED')
    const tudoConcluido = atualIdx === -1

    return (
        <div style={{maxWidth: 560, margin: '0 auto', padding: '8px 4px 32px'}}>
            {/* Cabecalho com progresso */}
            <div
                style={{
                    background: '#4762EA',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '16px 18px',
                    marginBottom: 20,
                }}
            >
                <div style={{fontSize: 17, fontWeight: 700}}>
                    {tudoConcluido ? '🎉 Processo concluído!' : 'Acompanhe seu processo'}
                </div>
                <div style={{fontSize: 13, opacity: 0.9, marginTop: 2}}>
                    {concluidas} de {total} etapas concluídas
                </div>
                <div
                    style={{
                        height: 10,
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: 20,
                        marginTop: 12,
                        overflow: 'hidden',
                    }}
                >
                    <div style={{height: '100%', width: pct + '%', background: '#fff', borderRadius: 20}}/>
                </div>
                <div style={{textAlign: 'right', fontSize: 12, fontWeight: 700, marginTop: 4}}>
                    {pct}%
                </div>
            </div>

            {/* Etapas */}
            {list.map((s: any, i: number) => {
                const nome = (s && s.step) || 'Etapa'
                const concluida = !!(s && s.stepCompleted === 'COMPLETED')
                const pendencia = !!(s && s.stepStatus === 'UNFORESEEN')
                const atual = i === atualIdx && !pendencia

                let cor = '#c9ccd2'
                let simbolo = '○'
                let rotulo = 'A fazer'
                let fundo = '#ffffff'

                if (pendencia) {
                    cor = '#e44258'
                    simbolo = '!'
                    rotulo = 'Pendência'
                    fundo = '#fff5f5'
                } else if (concluida) {
                    cor = '#17b978'
                    simbolo = '✓'
                    rotulo = 'Concluída'
                    fundo = '#ffffff'
                } else if (atual) {
                    cor = '#4762EA'
                    simbolo = '●'
                    rotulo = '📍 Você está aqui'
                    fundo = '#eef1fe'
                }

                return (
                    <div key={i} style={{display: 'flex', gap: 12, marginBottom: 10}}>
                        {/* trilha: bolinha + linha */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    background: cor,
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                {simbolo}
                            </div>
                            {i < total - 1 && (
                                <div
                                    style={{
                                        flex: 1,
                                        width: 3,
                                        minHeight: 20,
                                        marginTop: 2,
                                        background: concluida ? '#17b978' : '#e3e5e9',
                                    }}
                                />
                            )}
                        </div>

                        {/* conteudo da etapa */}
                        <div
                            style={{
                                flex: 1,
                                background: fundo,
                                border: '1px solid #e6e9ef',
                                borderRadius: 10,
                                padding: '10px 12px',
                            }}
                        >
                            <div style={{fontWeight: 700, fontSize: 14, color: '#2b2f36'}}>{nome}</div>
                            <div style={{fontSize: 11, color: cor, fontWeight: 700, marginTop: 3}}>
                                {rotulo}
                            </div>
                            <div style={{fontSize: 11, color: '#8a8f98', marginTop: 3}}>
                                Etapa {i + 1} de {total}
                                {s && s.deadline ? ` · prazo ${s.deadline} dia(s)` : ''}
                            </div>
                            {s && s.stepUnforeseenDescription ? (
                                <div
                                    style={{
                                        fontSize: 12,
                                        marginTop: 6,
                                        background: '#fde7ea',
                                        color: '#c9304a',
                                        padding: '6px 8px',
                                        borderRadius: 6,
                                    }}
                                >
                                    ⚠️ {s.stepUnforeseenDescription}
                                </div>
                            ) : null}
                            {s && s.observation ? (
                                <div
                                    style={{
                                        fontSize: 12,
                                        marginTop: 6,
                                        background: '#f5f6f8',
                                        color: '#474a51',
                                        padding: '6px 8px',
                                        borderRadius: 6,
                                    }}
                                >
                                    📝 {s.observation}
                                </div>
                            ) : null}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
