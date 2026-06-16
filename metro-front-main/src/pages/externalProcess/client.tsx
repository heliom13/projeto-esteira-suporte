import {useEffect, useState} from 'react'
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
    const [clientProcess, setClientProcess] = useState(client)
    const [processData, setProcessData] = useState<ProcessProps>()
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        setClientProcess(client)
    }, [client])

    const fetchProcesses = async (processExternalId) => {
        try {
            await ExternalClass.externalProcess(processExternalId).then((response) => {
                setProcessData(response.data)
                setShowMore(true)
            })
        } catch (error) {
        }
    }

    return (
        <>
            {loading ? (
                <Spinner/>
            ) : (
                clientProcess?.map(
                    (item) =>
                        !showMore && (
                            <div key={item.processId}>
                                <Container>
                                    <TextOutside>
                                        {' '}
                                        Cliente: <strong> {item.name} </strong>
                                    </TextOutside>
                                    <Line/>
                                    <TextWrap>
                                        <Label> Previsão: </Label>
                                        <DaysText> {item?.totalDays} dias</DaysText>
                                    </TextWrap>
                                    <TextWrap>
                                        <Label> Dias completos: </Label>
                                        {item?.daysCompleted > item?.totalDays ? (
                                            <WarningText> {item?.daysCompleted} dias </WarningText>
                                        ) : (
                                            <DaysText> {item?.daysCompleted} dias</DaysText>
                                        )}
                                    </TextWrap>
                                    <TextWrap>
                                        <Label> Vendedor Principal: </Label>
                                        <Text> {item?.sellerMain}</Text>
                                    </TextWrap>
                                    {item?.sellerSecondary && (
                                        <TextWrap>
                                            <Label> Vendedor Secudário: </Label>
                                            <Text> {item?.sellerSecondary}</Text>
                                        </TextWrap>
                                    )}
                                    <TextWrap>
                                        <Label> Status Atual: </Label>
                                        {item?.stepStatus === 'UNFORESEEN' ? (
                                            <WarningText>{item?.stepCurrent}</WarningText>
                                        ) : (
                                            <Text>
                                                {item?.stepCurrent === ''
                                                    ? 'Sem status no momento'
                                                    : item?.stepCurrent}
                                            </Text>
                                        )}
                                    </TextWrap>
                                    <TextWrap>
                                        <Label> Status do Processo: </Label>
                                        <SuccessText>
                                            {item?.status === 'FINISHED' ? 'FINALIZADO' : 'ATIVO'}
                                        </SuccessText>
                                    </TextWrap>
                                    <Button onClick={() => fetchProcesses(item.processId)}>
                                        Visão Geral
                                    </Button>
                                </Container>
                                <br/>
                            </div>
                        )
                )
            )}
            {showMore ? (
                <>
                    <ExternalProcessSteps loading={loading} processData={processData}/>
                    <Button onClick={() => setShowMore(false)}> Voltar </Button>
                </>
            ) : (
                ''
            )}
        </>
    )
}

export default ExternalProcessClient
