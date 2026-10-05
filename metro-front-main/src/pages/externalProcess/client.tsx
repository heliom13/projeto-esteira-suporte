import {useState} from 'react'
import {ProcessProps} from '.'
import {ExternalClass} from '../../services/external'
import ExternalProcessSteps from './externalProcess'
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
    const [processData, setProcessData] = useState<ProcessProps>()
    const [showMore, setShowMore] = useState(false)

    // Processo principal do cliente (o primeiro da lista)
    const main = Array.isArray(client) ? client[0] : client

    const fetchProcesses = async (processExternalId) => {
        try {
            await ExternalClass.externalProcess(processExternalId).then((response) => {
                setProcessData(response.data)
                setShowMore(true)
            })
        } catch (error) {
        }
    }

    if (loading) return <Spinner/>
    if (!main) return <WarningText> Nenhum processo encontrado 😔 </WarningText>

    return (
        <>
            {!showMore ? (
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
                    <Button onClick={() => fetchProcesses(main.processId)}>
                        Visão Geral
                    </Button>
                </Container>
            ) : (
                <>
                    <ExternalProcessSteps loading={loading} processData={processData}/>
                    <Button onClick={() => setShowMore(false)}> Voltar </Button>
                </>
            )}
        </>
    )
}

export default ExternalProcessClient
