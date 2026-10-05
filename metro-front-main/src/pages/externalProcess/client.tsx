import {useEffect, useState} from 'react'
import {ExternalClass} from '../../services/external'
import {ExternalTimelineComponent} from '../../components/timeline/externalTimeLine'
import {
    Button,
    Container,
    DaysText,
    Label,
    Line,
    Spinner,
    SuccessText,
    Text,
    TextOutside,
    TextWrap,
    WarningText,
} from './externalStyles'

const ExternalProcessClient = ({loading, client}) => {
    // Processo principal do cliente (o primeiro da lista)
    const main = Array.isArray(client) ? client[0] : client

    const [steps, setSteps] = useState<any[]>([])
    const [carregandoEtapas, setCarregandoEtapas] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const [showMore, setShowMore] = useState(false)

    // Carrega as etapas junto com a pagina (nao depende do clique)
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

    // Tela de rastreamento (substitui o card)
    if (showMore) {
        return (
            <>
                <Button onClick={() => setShowMore(false)}> ← Voltar </Button>
                {carregandoEtapas && (
                    <>
                        <Spinner/>
                        <Text> Carregando etapas... </Text>
                    </>
                )}
                {!carregandoEtapas && erro && <WarningText>{erro}</WarningText>}
                {!carregandoEtapas && !erro && steps.length === 0 && (
                    <WarningText> Nenhuma etapa encontrada para este processo. </WarningText>
                )}
                {!carregandoEtapas && !erro && steps.length > 0 && (
                    <ExternalTimelineComponent steps={steps}/>
                )}
            </>
        )
    }

    // Tela inicial: informacoes + um unico botao
    return (
        <Container>
            <TextOutside>
                Cliente: <strong> {main.name} </strong>
            </TextOutside>
            <Line/>
            <TextWrap>
                <Label> Previsão: </Label>
                <DaysText> {main?.totalDays} dias</DaysText>
            </TextWrap>
            <TextWrap>
                <Label> Dias completos: </Label>
                {main?.daysCompleted > main?.totalDays ? (
                    <WarningText> {main?.daysCompleted} dias </WarningText>
                ) : (
                    <DaysText> {main?.daysCompleted} dias</DaysText>
                )}
            </TextWrap>
            <TextWrap>
                <Label> Vendedor Principal: </Label>
                <Text> {main?.sellerMain}</Text>
            </TextWrap>
            {main?.sellerSecondary && (
                <TextWrap>
                    <Label> Vendedor Secundário: </Label>
                    <Text> {main?.sellerSecondary}</Text>
                </TextWrap>
            )}
            <TextWrap>
                <Label> Status Atual: </Label>
                {main?.stepStatus === 'UNFORESEEN' ? (
                    <WarningText>{main?.stepCurrent}</WarningText>
                ) : (
                    <Text>
                        {main?.stepCurrent === '' ? 'Sem status no momento' : main?.stepCurrent}
                    </Text>
                )}
            </TextWrap>
            <TextWrap>
                <Label> Status do Processo: </Label>
                <SuccessText>
                    {main?.status === 'FINISHED' ? 'FINALIZADO' : 'ATIVO'}
                </SuccessText>
            </TextWrap>

            <Button onClick={() => setShowMore(true)}> Visão Geral </Button>
        </Container>
    )
}

export default ExternalProcessClient
