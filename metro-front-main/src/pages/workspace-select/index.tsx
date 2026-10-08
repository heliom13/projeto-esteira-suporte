import React, {CSSProperties, MouseEvent, useState} from "react";
import {ArrowRightOutlined, BankOutlined, FileProtectOutlined, SwapOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useWorkspace, Workspace} from "../../contexts/WorkspaceContext";
import {useAuth} from "../../contexts/AuthContext";
import SuporteLogo from "../../components/brand/SuporteLogo";

/**
 * Tela de escolha de area (Financiamento / Regularizacao).
 *
 * Estilo em CSS proprio (classes ws-*) em vez de styled-components, no mesmo
 * padrao da timeline de rastreio e do seletor de visao dos processos.
 * Animacoes de entrada usam fill "backwards": se nao rodarem, o conteudo
 * continua visivel.
 */

type Opcao = {
    key: Workspace;
    title: string;
    description: string;
    icon: React.ReactNode;
    recursos: string[];
    // cores do cartao (variaveis CSS)
    cores: CSSProperties;
};

const OPTIONS: Opcao[] = [
    {
        key: "financiamento",
        title: "Financiamento",
        description: "Clientes, imóveis, propostas e processos de financiamento imobiliário",
        icon: <BankOutlined/>,
        recursos: ["Clientes", "Imóveis", "Propostas", "Processos"],
        cores: {
            "--cor": "#4762ea",
            "--cor-escura": "#2f47c9",
            "--cor-clara": "#eef1fd",
            "--sombra": "rgba(71, 98, 234, .38)",
            "--brilho": "rgba(71, 98, 234, .10)",
        } as CSSProperties,
    },
    {
        key: "regularizacao",
        title: "Regularização",
        description: "Clientes e processos de regularização de imóveis",
        icon: <FileProtectOutlined/>,
        recursos: ["Clientes", "Processos", "Fluxos", "Tarefas"],
        cores: {
            "--cor": "#22a565",
            "--cor-escura": "#16804c",
            "--cor-clara": "#e8f7ef",
            "--sombra": "rgba(34, 165, 101, .38)",
            "--brilho": "rgba(34, 165, 101, .10)",
        } as CSSProperties,
    },
];

const CSS = `
.ws-pagina {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    background: #f4f6fd;
}
.ws-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: .6;
    pointer-events: none;
    animation: ws-flutua 18s ease-in-out infinite alternate;
}
.ws-blob-1 { width: 440px; height: 440px; background: #c9d2fb; top: -140px; left: -120px; }
.ws-blob-2 { width: 400px; height: 400px; background: #c4ecd7; bottom: -150px; right: -100px; animation-delay: -6s; }
.ws-blob-3 { width: 260px; height: 260px; background: #dde3ff; top: 38%; left: 62%; animation-duration: 24s; }
.ws-pontos {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(rgba(71, 98, 234, .13) 1px, transparent 1px);
    background-size: 22px 22px;
    -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 72%);
    mask-image: radial-gradient(ellipse at center, #000 30%, transparent 72%);
}
.ws-conteudo {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 840px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.ws-logo { animation: ws-desce .7s cubic-bezier(.2, .8, .2, 1) backwards; }
.ws-ola {
    margin: 22px 0 4px;
    color: #1d2a6b;
    font-size: 26px;
    font-weight: 700;
    animation: ws-sobe .7s .1s cubic-bezier(.2, .8, .2, 1) backwards;
}
.ws-sub {
    margin-bottom: 36px;
    color: #6b7393;
    font-size: 15px;
    animation: ws-sobe .7s .18s cubic-bezier(.2, .8, .2, 1) backwards;
}
.ws-cartoes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    width: 100%;
    perspective: 1200px;
}
.ws-cartao {
    --rx: 0deg;
    --ry: 0deg;
    --mx: 50%;
    --my: 50%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 28px 26px 24px;
    border: 1px solid rgba(29, 42, 107, .08);
    border-radius: 20px;
    background: #fff;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(20, 30, 80, .04), 0 8px 24px rgba(20, 30, 80, .06);
    transform: rotateX(var(--rx)) rotateY(var(--ry)) translateY(0);
    transition: transform .2s ease-out, box-shadow .3s ease, border-color .3s ease, opacity .3s ease;
    animation: ws-entra .7s cubic-bezier(.2, .8, .2, 1) backwards;
}
.ws-cartao:nth-child(1) { animation-delay: .25s; }
.ws-cartao:nth-child(2) { animation-delay: .37s; }
.ws-cartao::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(420px circle at var(--mx) var(--my), var(--brilho), transparent 45%);
    opacity: 0;
    transition: opacity .3s ease;
    pointer-events: none;
}
.ws-cartao::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--cor);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .45s cubic-bezier(.2, .8, .2, 1);
}
.ws-cartao:hover, .ws-cartao:focus-visible {
    border-color: transparent;
    box-shadow: 0 22px 44px -16px var(--sombra), 0 2px 6px rgba(20, 30, 80, .05);
    transform: rotateX(var(--rx)) rotateY(var(--ry)) translateY(-6px);
}
.ws-cartao:hover::before, .ws-cartao:focus-visible::before { opacity: 1; }
.ws-cartao:hover::after, .ws-cartao:focus-visible::after { transform: scaleX(1); }
.ws-cartao:focus-visible { outline: 3px solid var(--cor-clara); outline-offset: 3px; }
.ws-topo {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
}
.ws-icone {
    position: relative;
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: var(--cor);
    color: #fff;
    font-size: 30px;
    box-shadow: 0 12px 24px -10px var(--sombra);
    transition: transform .45s cubic-bezier(.34, 1.56, .64, 1);
}
.ws-icone::after {
    content: "";
    position: absolute;
    inset: -6px;
    border: 2px solid var(--cor);
    border-radius: 22px;
    opacity: 0;
    animation: ws-pulso 2.6s ease-out infinite;
}
.ws-cartao:nth-child(2) .ws-icone::after { animation-delay: 1.3s; }
.ws-cartao:hover .ws-icone { transform: rotate(-8deg) scale(1.08); }
.ws-selo {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--cor-clara);
    color: var(--cor-escura);
    font-size: 12px;
    font-weight: 600;
}
.ws-selo::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--cor);
    animation: ws-pisca 1.8s ease-in-out infinite;
}
.ws-titulo {
    position: relative;
    margin: 18px 0 6px;
    color: #1d2a6b;
    font-size: 22px;
    font-weight: 700;
}
.ws-desc {
    position: relative;
    color: #6b7393;
    font-size: 14px;
    line-height: 1.55;
}
.ws-chips {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 16px 0 22px;
}
.ws-chip {
    padding: 3px 10px;
    border-radius: 999px;
    background: var(--cor-clara);
    color: var(--cor-escura);
    font-size: 12px;
    font-weight: 600;
    transition: transform .3s cubic-bezier(.34, 1.56, .64, 1);
}
.ws-cartao:hover .ws-chip { transform: translateY(-2px); }
.ws-entrar {
    position: relative;
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    background: var(--cor-clara);
    color: var(--cor-escura);
    font-size: 14px;
    font-weight: 700;
    transition: background-color .3s ease, color .3s ease, box-shadow .3s ease;
}
.ws-seta { display: inline-flex; transition: transform .3s cubic-bezier(.34, 1.56, .64, 1); }
.ws-cartao:hover .ws-entrar, .ws-cartao:focus-visible .ws-entrar {
    background: var(--cor);
    color: #fff;
    box-shadow: 0 8px 18px -8px var(--sombra);
}
.ws-cartao:hover .ws-seta { transform: translateX(5px); }
.ws-cartao.ws-escolhido {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 26px 50px -16px var(--sombra);
}
.ws-cartao.ws-escolhido .ws-entrar { background: var(--cor); color: #fff; }
.ws-cartao.ws-apagado { opacity: .35; transform: scale(.96); }
.ws-dica {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 30px;
    padding: 8px 14px;
    border-radius: 18px;
    background: rgba(255, 255, 255, .7);
    color: #6b7393;
    font-size: 13px;
    animation: ws-sobe .6s .6s ease backwards;
}
.ws-dica b { color: #4762ea; font-weight: 600; }
@keyframes ws-flutua {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(40px, -30px) scale(1.08); }
    100% { transform: translate(-30px, 25px) scale(.95); }
}
@keyframes ws-desce { from { opacity: 0; transform: translateY(-16px); } }
@keyframes ws-sobe { from { opacity: 0; transform: translateY(14px); } }
@keyframes ws-entra { from { opacity: 0; transform: translateY(36px) scale(.96); } }
@keyframes ws-pulso {
    0% { opacity: .55; transform: scale(.92); }
    100% { opacity: 0; transform: scale(1.28); }
}
@keyframes ws-pisca { 50% { opacity: .35; } }
@media (max-width: 640px) {
    .ws-cartoes { grid-template-columns: 1fr; }
    .ws-ola { font-size: 22px; }
}
@media (prefers-reduced-motion: reduce) {
    .ws-pagina *, .ws-pagina *::before, .ws-pagina *::after {
        animation: none !important;
        transition: none !important;
    }
}
`;

const reduzirMovimento = () => {
    try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
        return false;
    }
};

// Inclinacao 3D + brilho que acompanham o mouse (direto no estilo do
// elemento, sem re-renderizar o React a cada movimento).
const moverMouse = (e: MouseEvent<HTMLButtonElement>) => {
    if (reduzirMovimento()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
};

const sairMouse = (e: MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
};

const WorkspaceSelect: React.FC = () => {
    const navigate = useNavigate();
    const {workspace: ultimaArea, setWorkspace} = useWorkspace();
    const {user} = useAuth();
    const [escolhido, setEscolhido] = useState<Workspace | null>(null);

    const primeiroNome = (user?.name || "").trim().split(/\s+/)[0];

    const handleSelect = (workspace: Workspace) => {
        if (escolhido) return;
        setEscolhido(workspace);
        // pequena transicao antes de entrar na area
        setTimeout(() => {
            setWorkspace(workspace);
            navigate(workspace === "regularizacao" ? "/regularizacao" : "/");
        }, reduzirMovimento() ? 0 : 320);
    };

    return (
        <div className="ws-pagina">
            <style>{CSS}</style>
            <span className="ws-blob ws-blob-1" aria-hidden="true"/>
            <span className="ws-blob ws-blob-2" aria-hidden="true"/>
            <span className="ws-blob ws-blob-3" aria-hidden="true"/>
            <span className="ws-pontos" aria-hidden="true"/>

            <div className="ws-conteudo">
                <div className="ws-logo">
                    <SuporteLogo altura={58} cor="#4762ea"/>
                </div>
                <div className="ws-ola">{primeiroNome ? `Olá, ${primeiroNome}!` : "Boas-vindas!"}</div>
                <div className="ws-sub">Escolha em qual área você quer entrar</div>

                <div className="ws-cartoes">
                    {OPTIONS.map((option) => {
                        const classes = ["ws-cartao"];
                        if (escolhido === option.key) classes.push("ws-escolhido");
                        else if (escolhido) classes.push("ws-apagado");

                        return (
                            <button
                                key={option.key}
                                type="button"
                                className={classes.join(" ")}
                                style={option.cores}
                                onClick={() => handleSelect(option.key)}
                                onMouseMove={moverMouse}
                                onMouseLeave={sairMouse}
                            >
                                <div className="ws-topo">
                                    <span className="ws-icone">{option.icon}</span>
                                    {ultimaArea === option.key ? <span className="ws-selo">Último acesso</span> : null}
                                </div>
                                <div className="ws-titulo">{option.title}</div>
                                <div className="ws-desc">{option.description}</div>
                                <div className="ws-chips">
                                    {option.recursos.map((recurso, i) => (
                                        <span key={recurso} className="ws-chip" style={{transitionDelay: `${i * 45}ms`}}>
                                            {recurso}
                                        </span>
                                    ))}
                                </div>
                                <span className="ws-entrar">
                                    Entrar <span className="ws-seta"><ArrowRightOutlined/></span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="ws-dica">
                    <SwapOutlined/>
                    <span>Dá para mudar de área a qualquer momento pelo botão <b>Trocar de área</b>, no topo.</span>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceSelect;
