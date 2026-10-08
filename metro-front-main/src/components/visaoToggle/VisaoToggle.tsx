import {ReactNode} from 'react'

/**
 * Seletor em formato de pilula com destaque deslizante (duas opcoes).
 * Usado na tela de Processos para "Todos os processos" / "Meus processos".
 *
 * Estilo em CSS proprio (classes vt-*) em vez de styled-components, seguindo
 * o mesmo padrao da timeline de rastreio.
 */

export type OpcaoVisao<T extends string> = {
    valor: T
    rotulo: string
    /** versao curta do rotulo, usada em telas estreitas (celular) */
    rotuloCurto?: string
    icone: ReactNode
    contador?: number
}

const CSS = `
.vt-grupo {
    position: relative;
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    padding: 4px;
    border-radius: 999px;
    background: #eef1fd;
    box-shadow: inset 0 1px 3px rgba(31, 45, 120, .10);
    max-width: 100%;
}
.vt-indicador {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    width: calc(50% - 4px);
    border-radius: 999px;
    background: #4762ea;
    box-shadow: 0 4px 14px rgba(71, 98, 234, .38), 0 1px 2px rgba(71, 98, 234, .3);
    transition: transform .35s cubic-bezier(.34, 1.36, .64, 1);
}
.vt-opcao {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 9px 20px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #4762ea;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .1px;
    white-space: nowrap;
    cursor: pointer;
    transition: color .25s ease, background-color .2s ease;
    -webkit-tap-highlight-color: transparent;
}
.vt-opcao:hover:not(.vt-ativa) {
    background: rgba(71, 98, 234, .09);
    color: #2f47c9;
}
.vt-opcao:focus-visible {
    outline: 2px solid #9aa9f5;
    outline-offset: 2px;
}
.vt-opcao.vt-ativa {
    color: #fff;
    cursor: default;
}
.vt-icone {
    display: inline-flex;
    font-size: 16px;
    transition: transform .35s cubic-bezier(.34, 1.56, .64, 1);
}
.vt-ativa .vt-icone {
    transform: scale(1.12);
}
.vt-contador {
    min-width: 24px;
    padding: 1px 8px;
    border-radius: 999px;
    background: #dde3fb;
    color: #3a52d6;
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
    transition: background-color .25s ease, color .25s ease;
}
.vt-opcao:hover:not(.vt-ativa) .vt-contador {
    background: #fff;
}
.vt-ativa .vt-contador {
    background: rgba(255, 255, 255, .24);
    color: #fff;
}
.vt-curto { display: none; }
@media (max-width: 520px) {
    .vt-grupo { display: grid; width: 100%; }
    .vt-opcao { padding: 9px 10px; font-size: 13px; gap: 6px; }
    .vt-tem-curto .vt-longo { display: none; }
    .vt-tem-curto .vt-curto { display: inline; }
}
@media (prefers-reduced-motion: reduce) {
    .vt-indicador, .vt-icone, .vt-opcao, .vt-contador { transition: none; }
}
`

type Props<T extends string> = {
    valor: T
    opcoes: [OpcaoVisao<T>, OpcaoVisao<T>]
    onChange: (valor: T) => void
    rotuloAcessivel?: string
}

export function VisaoToggle<T extends string>({valor, opcoes, onChange, rotuloAcessivel}: Props<T>) {
    const indiceAtivo = opcoes[1].valor === valor ? 1 : 0

    return (
        <>
            <style>{CSS}</style>
            <div className="vt-grupo" role="radiogroup" aria-label={rotuloAcessivel}>
                <span
                    className="vt-indicador"
                    aria-hidden="true"
                    style={{transform: `translateX(${indiceAtivo * 100}%)`}}
                />
                {opcoes.map((op, i) => {
                    const ativa = i === indiceAtivo
                    return (
                        <button
                            key={op.valor}
                            type="button"
                            role="radio"
                            aria-checked={ativa}
                            className={['vt-opcao', ativa ? 'vt-ativa' : '', op.rotuloCurto ? 'vt-tem-curto' : ''].join(' ').trim()}
                            onClick={() => !ativa && onChange(op.valor)}
                        >
                            <span className="vt-icone">{op.icone}</span>
                            <span className="vt-longo">{op.rotulo}</span>
                            {op.rotuloCurto ? <span className="vt-curto">{op.rotuloCurto}</span> : null}
                            {op.contador !== undefined ? <span className="vt-contador">{op.contador}</span> : null}
                        </button>
                    )
                })}
            </div>
        </>
    )
}

export default VisaoToggle
