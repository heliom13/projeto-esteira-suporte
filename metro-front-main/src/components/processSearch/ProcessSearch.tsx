import {useEffect, useRef, useState} from 'react'
import {AutoComplete, Input} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'
import api from '../../services/api'

type Achado = {
    id: number
    code?: string | null
    cliente?: string | null
    fluxo: string
    status: string
    etapaAtual?: string | null
}

const STATUS: Record<string, { txt: string; cor: string }> = {
    ACTIVE: {txt: 'Ativo', cor: '#00a86b'},
    SOLD: {txt: 'Concluído', cor: '#4762EA'},
    CANCELLED: {txt: 'Cancelado', cor: '#e44258'},
}

/**
 * Busca de processo na barra lateral: pelo codigo (ex: 2026-0001) ou pelo
 * nome do cliente. Mostra sugestoes enquanto digita e abre o dossie.
 */
export const ProcessSearch = ({basePath = '/processos'}: { basePath?: string }) => {
    const navigate = useNavigate()
    const [texto, setTexto] = useState('')
    const [achados, setAchados] = useState<Achado[]>([])
    const [buscando, setBuscando] = useState(false)
    const timer = useRef<any>(null)

    // espera o usuario parar de digitar (300ms) antes de consultar
    useEffect(() => {
        clearTimeout(timer.current)
        const q = texto.trim()
        if (!q) {
            setAchados([])
            return
        }
        timer.current = setTimeout(() => {
            setBuscando(true)
            api.get('/processes/lookup', {params: {q}})
                .then((r) => setAchados(Array.isArray(r.data) ? r.data : []))
                .catch(() => setAchados([]))
                .finally(() => setBuscando(false))
        }, 300)
        return () => clearTimeout(timer.current)
    }, [texto])

    const abrir = (id: number | string) => {
        setTexto('')
        setAchados([])
        navigate(`${basePath}/dossie/${id}`)
    }

    const options = achados.map((a) => {
        const st = STATUS[a.status] || {txt: a.status, cor: '#888'}
        return {
            value: String(a.id),
            label: (
                <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.35, padding: '2px 0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: 8}}>
                        <strong style={{color: '#4762EA'}}>{a.code || `#${a.id}`}</strong>
                        <span style={{fontSize: 11, fontWeight: 700, color: st.cor}}>{st.txt}</span>
                    </div>
                    <span style={{fontSize: 12, color: '#333'}}>
                        {a.cliente || 'Sem cliente'} · {a.fluxo}
                    </span>
                    {a.etapaAtual ? (
                        <span style={{fontSize: 11, color: '#8a8f98'}}>📍 {a.etapaAtual}</span>
                    ) : null}
                </div>
            ),
        }
    })

    return (
        <div style={{padding: '12px 12px 8px'}}>
            <AutoComplete
                value={texto}
                options={options}
                onChange={(v) => setTexto(String(v ?? ''))}
                onSelect={(v) => abrir(String(v))}
                style={{width: '100%'}}
                dropdownMatchSelectWidth={300}
                notFoundContent={texto.trim() && !buscando ? 'Nenhum processo encontrado' : null}
            >
                <Input
                    allowClear
                    prefix={<SearchOutlined style={{color: '#4762EA'}}/>}
                    placeholder="Buscar processo (ex: 2026-0001)"
                    onPressEnter={() => {
                        if (achados.length > 0) abrir(achados[0].id)
                    }}
                />
            </AutoComplete>
        </div>
    )
}

export default ProcessSearch
