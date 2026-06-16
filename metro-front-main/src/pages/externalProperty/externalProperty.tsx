import {useEffect, useState} from 'react'
import {ExternalClass} from '../../services/external'
import {ProcessProps} from '../externalProcess'
import ExternalProcessSteps from '../externalProcess/externalProcess'
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
} from '../externalProcess/externalStyles'

const ExternalProperty = ({loading, property}) => {
    const [propertyData, setPropertyData] = useState(property)
    const [processData, setProcessData] = useState<ProcessProps>()
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        setPropertyData(property)
    }, [property])

    const fetchProcesses = async (saleExternalId) => {
        try {
            await ExternalClass.externalProcess(saleExternalId).then((response) => {
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
                propertyData?.map(
                    (item) =>
                        !showMore && (
                            <div key={item.saleId}>
                                <Container>
                                    <TextOutside>
                                        Imóvel <strong>{item?.name}</strong>
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
                                    <Button onClick={() => fetchProcesses(item.saleId)}>
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

export default ExternalProperty
