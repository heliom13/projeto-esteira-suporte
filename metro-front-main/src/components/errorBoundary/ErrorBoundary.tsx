import React from 'react'

/**
 * Barreira de erro: se qualquer componente filho quebrar durante a
 * renderizacao, mostra uma mensagem em vez de deixar a tela em branco.
 * Sem isso, um erro de renderizacao derruba a arvore inteira do React.
 */
type Props = { children: React.ReactNode }
type State = { erro: string | null }

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {erro: null}
    }

    static getDerivedStateFromError(error: any): State {
        return {erro: (error && error.message) ? String(error.message) : 'Erro inesperado'}
    }

    componentDidCatch(error: any, info: any) {
        // Fica no console do navegador para diagnostico
        console.error('Erro ao exibir o acompanhamento:', error, info)
    }

    render() {
        if (this.state.erro) {
            return (
                <div style={{
                    maxWidth: 520, margin: '24px auto', padding: '18px 20px',
                    background: '#fff6f6', border: '1px solid #f7d3d8',
                    borderRadius: 12, color: '#c9304a', textAlign: 'center',
                }}>
                    <div style={{fontWeight: 800, fontSize: 15, marginBottom: 6}}>
                        Não foi possível exibir o acompanhamento
                    </div>
                    <div style={{fontSize: 13, color: '#8a4a55'}}>
                        Tente recarregar a página. Se continuar, entre em contato com a Suporte Imobiliário.
                    </div>
                    <div style={{fontSize: 11, color: '#b08890', marginTop: 10, wordBreak: 'break-word'}}>
                        Detalhe técnico: {this.state.erro}
                    </div>
                </div>
            )
        }
        return this.props.children as any
    }
}

export default ErrorBoundary
