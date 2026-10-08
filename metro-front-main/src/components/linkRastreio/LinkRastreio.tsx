import {Space, Tooltip, Typography} from 'antd'
import {AimOutlined} from '@ant-design/icons'

/**
 * Link da pagina de rastreio (a mesma que o cliente recebe no WhatsApp),
 * usado na coluna "Acesso Externo" das listas internas: o analista abre e ve
 * em que etapa o processo esta, ou copia o link para mandar a quem precisar.
 *
 * O endereco usa o dominio em que o sistema esta aberto (window.location.origin),
 * entao funciona hoje e continua funcionando se o dominio mudar.
 *
 *   cliente-comprador -> Cadastro de Cliente
 *   imovel            -> Cadastro de Imoveis (vendedor/dono do imovel)
 *   vendedor          -> Imobiliaria/Corretor
 */
export type TipoRastreio = 'cliente-comprador' | 'imovel' | 'vendedor'

export const urlRastreio = (tipo: TipoRastreio, externalId: string) =>
    `${window.location.origin}/external/${tipo}/${externalId}`

export const LinkRastreio = ({tipo, externalId}: { tipo: TipoRastreio; externalId?: string | null }) => {
    if (!externalId) return <Typography.Text type="secondary">-</Typography.Text>

    const url = urlRastreio(tipo, externalId)

    return (
        <Space size={6} style={{whiteSpace: 'nowrap'}}>
            <Tooltip title="Abre a página de rastreio do processo (a mesma que o cliente vê)">
                <a href={url} target="_blank" rel="noreferrer">
                    <AimOutlined/> Ver rastreio
                </a>
            </Tooltip>
            <Typography.Text copyable={{text: url, tooltips: ['Copiar link', 'Link copiado!']}}/>
        </Space>
    )
}

export default LinkRastreio
