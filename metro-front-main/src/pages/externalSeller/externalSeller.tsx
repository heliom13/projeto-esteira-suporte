import {useEffect, useState} from 'react'
import {ExternalClass} from '../../services/external'
import {ExternalTimelineComponent} from '../../components/timeline/externalTimeLine'
import {Spinner, Text, WarningText} from '../externalProcess/externalStyles'

const ExternalSeller = ({loading, sellers}) => {
    // Processo principal do vendedor (o primeiro da lista)
    const main = Array.isArray(sellers) ? sellers[0] : sellers

    const [steps, setSteps] = useState<any[]>([])
    const [carregandoEtapas, setCarregandoEtapas] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    // Carrega as etapas assim que a pagina abre: ja cai direto no rastreio.
    // Atencao: nesta resposta o id do processo vem em "saleId".
    useEffect(() => {
        if (!main?.saleId) return
        setCarregandoEtapas(true)
        setErro(null)
        ExternalClass.externalProcess(main.saleId)
            .then((response) => {
                setSteps(Array.isArray(response.data) ? response.data : [])
            })
            .catch(() => {
                setErro('Não foi possível carregar as etapas agora. Tente novamente mais tarde.')
            })
            .finally(() => setCarregandoEtapas(false))
    }, [main?.saleId])

    if (loading) return <Spinner/>
    if (!main) return <WarningText> Nenhum processo encontrado 😔 </WarningText>

    if (carregandoEtapas) {
        return (
            <>
                <Spinner/>
                <Text> Carregando o processo... </Text>
            </>
        )
    }

    if (erro) return <WarningText>{erro}</WarningText>

    const info = [
        main?.code ? {label: 'Código', value: main.code} : null,
        main?.client ? {label: 'Cliente', value: main.client} : null,
        main?.property ? {label: 'Imóvel', value: main.property} : null,
        {label: 'Processo', value: main?.status === 'FINISHED' ? 'Finalizado' : 'Ativo'},
    ].filter(Boolean)

    return (
        <ExternalTimelineComponent
            steps={steps}
            titulo={main?.property ? `Imóvel ${main.property}` : 'Acompanhe o processo'}
            info={info}
            codigo={main?.code}
            papel="corretor responsável"
        />
    )
}

export default ExternalSeller
