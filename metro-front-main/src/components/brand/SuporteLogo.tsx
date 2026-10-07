/**
 * Logo horizontal da Suporte Imobiliario (casa a esquerda + nome), sem o
 * slogan. O icone e desenhado em SVG a partir da logo oficial: fica nitido em
 * qualquer tamanho e herda a cor do texto (currentColor).
 */
export const SuporteLogo = ({altura = 42, cor = '#ffffff'}: { altura?: number; cor?: string }) => (
    <div style={{display: 'flex', alignItems: 'center', gap: Math.round(altura * 0.32), color: cor}}>
        <svg
            viewBox="0 0 380 435"
            height={altura}
            width={Math.round((altura * 380) / 435)}
            fill="none"
            stroke="currentColor"
            strokeWidth={13}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            role="img"
            aria-label="Suporte Imobiliário"
            style={{flexShrink: 0, display: 'block'}}
        >
            {/* casa: parede esquerda, base e parede direita */}
            <path d="M15 147 V423 H357 V150"/>
            {/* telhado: lado esquerdo ate o pico e o comeco do lado direito */}
            <path d="M15 147 L186 40 L204 51"/>
            {/* final do telhado direito, depois do pino */}
            <path d="M335 137 L357 150"/>
            {/* pino de localizacao */}
            <path d="M278 203 L221 115 A68 68 0 1 1 335 115 Z"/>
            {/* check dentro do pino */}
            <path d="M253 85 L273 118 L368 67"/>
        </svg>

        <div
            style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                lineHeight: 1.08,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                fontSize: Math.round(altura * 0.42),
            }}
        >
            {/* letter-spacing tambem soma espaco apos a ultima letra: a margem
                negativa compensa, para as duas linhas terminarem alinhadas */}
            <div style={{letterSpacing: '0.42em', marginRight: '-0.42em'}}>Suporte</div>
            <div style={{letterSpacing: '0.1em', marginRight: '-0.1em'}}>Imobiliário</div>
        </div>
    </div>
)

export default SuporteLogo
