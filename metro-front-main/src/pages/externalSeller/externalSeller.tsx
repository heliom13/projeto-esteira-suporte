import {useEffect, useState} from 'react'
import {ExternalClass} from '../../services/external'
import {
    Button,
    Container,
    Label,
    Line,
    Spinner,
    SuccessText,
    Text,
    TextOutside,
    TextWrap,
    WarningText,
} from '../externalProcess/externalStyles'
import ExternalProcessSteps from './externalProcessSeller'
import {ProcessProps} from "../externalProcess";

const ExternalSeller = ({loading, sellers}) => {
    const [sellerData, setSellerData] = useState(sellers)
    const [showMore, setShowMore] = useState(false)
    const [sellerProcessData, setSellerProcessData] = useState<ProcessProps>()

    useEffect(() => {
        setSellerData(sellers)
    }, [sellers])

    const fetchProcesses = async (saleExternalId) => {
        try {
            await ExternalClass.externalProcess(saleExternalId).then((response) => {
                setSellerProcessData(response.data)
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
                sellerData?.map(
                    (item) =>
                        !showMore && (
                            <div>
                                <Container key={item?.saleId}>
                                    <TextOutside>Imóvel: {item?.property}</TextOutside>
                                    <Line/>
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
                                        <Label> Imóvel: </Label>
                                        <Text> {item?.property}</Text>
                                    </TextWrap>
                                    <TextWrap>
                                        <Label> Cliente: </Label>
                                        <Text> {item?.client}</Text>
                                    </TextWrap>
                                    <TextWrap>
                                        <Label> Status da Processo: </Label>
                                        <SuccessText>
                                            {' '}
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
                    <ExternalProcessSteps loading={loading} processData={sellerProcessData}/>
                    <Button onClick={() => setShowMore(false)}> Voltar </Button>
                </>
            ) : (
                ''
            )}
        </>
    )
}

export default ExternalSeller
