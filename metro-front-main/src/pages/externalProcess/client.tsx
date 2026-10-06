import {useEffect, useState} from 'react'
import {ExternalClass} from '../../services/external'
import {ExternalTimelineComponent} from '../../components/timeline/externalTimeLine'
import {Spinner, Text, WarningText} from './externalStyles'

const ExternalProcessClient = ({loading, client}) => {
    // Processo principal do cliente (o primeiro da lista)
    const main = Array.isArray(client) ? client[0] : client

    const [steps, setSteps] = useState<any[]>([])
    const [carregandoEtapas, setCarregandoEtapas] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    // Carrega as etapas assim que a pagina abre: o cliente ja cai no rastreio
    useEffect(() => {
        if (!main?.processId) return
        setCarregandoEtapas(true)
        setErro(null)
        ExternalClass.externalProcess(main.processId)
            .then((response) => {
                setSteps(Array.isArray(response.data) ? response.data : [])
            })
            .catch(() => {
                setErro('Não foi possível carregar as etapas agora. Tente novamente mais tarde.')
            })
            .finally(() => setCarregandoEtapas(false))
    }, [main?.processId])

    if (loading) return <Spinner/>
    if (!main) return <WarningText> Nenhum processo encontrado 😔 </WarningText>

    if (carregandoEtapas) {
        return (
            <>
                <Spinner/>
                <Text> Carregando seu processo... </Text>
            </>
        )
    }

    if (erro) return <WarningText>{erro}</WarningText>

    const info = [
        main?.totalDays ? {label: 'Previsão', value: `${main.totalDays} dias`} : null,
        main?.daysCompleted != null ? {label: 'Em andamento há', value: `${main.daysCompleted} dias`} : null,
        main?.sellerMain ? {label: 'Responsável', value: main.sellerMain} : null,
    ].filter(Boolean)

    return (
        <ExternalTimelineComponent
            steps={steps}
            titulo={main?.name ? `Olá, ${main.name}` : 'Acompanhe seu processo'}
            info={info}
        />
    )
}

export default ExternalProcessClient
