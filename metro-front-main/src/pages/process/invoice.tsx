import {Button, Col, Divider, Spin, Typography} from 'antd'
import {useEffect, useState} from 'react'
import {primaryText} from '../../styles/stylesProps'
import {ProcessService} from '../../services/process'
import {useNavigate, useParams} from 'react-router-dom'
import onNotification from '../../components/notification/notification'
import {buttonRadius, buttonRed} from '../../components/button'
import {ArrowLeftOutlined, DeleteOutlined} from '@ant-design/icons'

const {Text, Title} = Typography

type InvoiceProps = {
    commissions: any
    fee: number
    id: number
    processID: number
    value: number
    invoiceNumber: number
}
const ProcessInvoice = () => {
    const [loading, setLoading] = useState(false)
    const [invoiceId, setInvoiceId] = useState()
    const [invoiceData, setInvoiceData] = useState<InvoiceProps>()
    const {id} = useParams()
    const navigate = useNavigate()

    const fetchData = () => {
        let invoiceID = ''
        setLoading(true)
        ProcessService.getProcessInvoice(id)
            .then((response) => {
                invoiceID = response.data.id
                setInvoiceId(response.data.id)
                ProcessService.getInvoice(invoiceID)
                    .then((response) => {
                        setInvoiceData(response.data)
                    })
                    .catch((error) => {
                        setLoading(false)
                        
                        onNotification('error', {
                            message: 'Erro',
                            description: `${error.response.data.message}`,
                        })
                    })
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                onNotification('error', {
                    message: 'Erro',
                    description: 'Erro ao carregar os dados',
                })
            })
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const removeInvoice = (id) => {
        ProcessService.removeInvoice(id).then((response) => {
            navigate('/processos')
            onNotification('success', {
                message: 'Sucesso',
                description: 'Removido com sucesso',
            })
        })
    }

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Nota do Imóvel
            </Title>
            <br/>
            <Col lg={10}>
                <Title level={5}> Taxa:{invoiceData?.fee} % </Title>
            </Col>

            <Divider/>
            <Col lg={10}>
                <Title level={5}> Comissões: </Title>
                {invoiceData?.commissions?.map((item) => {
                    return (
                        <div key={item.id}>
                            <Text strong> Descrição: </Text>
                            <Text>{item?.description} </Text>
                            <br/>
                            <Text strong> Valor: </Text>
                            <Text>
                                {item?.value.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}
                            </Text>
                        </div>
                    )
                })}{' '}
            </Col>
            <Divider/>
            <Button
                {...buttonRadius}
                type="primary"
                icon={<ArrowLeftOutlined/>}
                onClick={() => navigate('/processos')}
            >
                Voltar
            </Button>
            <Button
                {...buttonRed}
                icon={<DeleteOutlined/>}
                onClick={() => removeInvoice(invoiceId)}
            >
                Excluir
            </Button>
        </Spin>
    )
}

export default ProcessInvoice
