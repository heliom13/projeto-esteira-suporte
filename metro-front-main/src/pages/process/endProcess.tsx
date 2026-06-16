import {useCallback, useEffect, useState} from 'react'
import {largeMarginTop, marginTop, primaryText,} from '../../styles/stylesProps'
import {Button, Col, Divider, Form, Input, Row, Spin, Table, Typography,} from 'antd'
import {ProcessService} from '../../services/process'
import {useNavigate, useParams} from 'react-router-dom'
import {PropertyService} from '../../services/property'
import {required, validateMessages} from '../../utils/ValidatorFields'
import {rowProps} from '../../utils/FormUtils'
import {CheckOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import {useForm} from 'antd/lib/form/Form'
import onNotification from '../../components/notification/notification'

const {Title} = Typography
const FormItem = Form.Item

export type ComissionProps = {
    id: number
    value: number
    description: string
    percentual: number
}

const EndProcess = () => {
    const [loading, setLoading] = useState(false)
    const [process, setProcess] = useState([])
    const {id} = useParams()
    const [form] = useForm()
    const [comissions, setComissions] = useState<ComissionProps[]>([])
    const [comissionDone, setComissionsDone] = useState<ComissionProps[]>([])
    const [formComission] = useForm()
    const navigate = useNavigate()

    const fetchData = () => {
        setLoading(true)

        ProcessService.getProcessById(id).then((response) => {
            setLoading(false)
            fetchProperty(response.data.property.id)
            setProcess(response.data)
        })
    }

    const fetchProperty = (id) => {
        setLoading(true)
        try {
            PropertyService.getProperty(id)
                .then((response) => {
                    form.setFieldsValue({
                        price: response.data.price,
                        financialPrice: response.data.price,
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
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddComission = useCallback(
        async (data) => {
            const salePrice = parseInt(form.getFieldValue('price'))
            const percentual = formComission.getFieldValue('percentual')
            const finalComissionPrice = (salePrice / 100) * parseInt(percentual)
            const index = 1
            const dataComission: ComissionProps = {
                id: index + 1 || 1,
                description: formComission.getFieldValue('description'),
                percentual: parseInt(formComission.getFieldValue('percentual')),
                value: finalComissionPrice,
            }
            setComissions((value) => [...value, dataComission])
        },
        [form, formComission]
    )

    useEffect(() => {
        let newComission = comissions.map((item, index) => ({
            id: index + 1,
            value: item.value,
            description: item.description,
            percentual: item.percentual,
        }))
        setComissionsDone(newComission)
    }, [comissions])

    const orderColumn = [
        {
            title: 'Descrição',
            render: (r: ComissionProps) => <p> {r.description}</p>,
        },
        {
            title: 'Percentual',
            render: (r: ComissionProps) => <p> {r.percentual}</p>,
        },
        {
            title: 'Preço',
            render: (r: ComissionProps) => (
                <p>
                    {' '}
                    {r.value.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </p>
            ),
        },
        {
            title: '',
            render: (r: ComissionProps) => (
                <DeleteOutlined
                    style={{color: '#B22222'}}
                    onClick={() => {
                        if (id) {
                            setComissions(comissions.filter((item) => item.id !== r.id))
                        }
                    }}
                />
            ),
        },
    ]

    const handleSubmit = useCallback(async () => {
        const data = {
            fee: form.getFieldValue('fee'),
            value: form.getFieldValue('price'),
        }
        try {
            setLoading(true)
            ProcessService.addEndProcess(id, data, comissionDone)
                .then((response) => {
                    onNotification('success', {
                        message: 'Sucesso',
                        description: 'Salvo com sucesso!',
                    })
                    setLoading(false)
                    navigate('/processos')
                })
                .catch((error) => {
                    setLoading(false)
                    onNotification('error', {
                        message: 'Erro',
                        description: 'Falha ao salvar',
                    })
                })
        } catch (error) {
            setLoading(false)
            onNotification('error', {
                message: 'Erro',
                description: 'Falha ao salvar',
            })
        }
    }, [comissionDone, form, id, navigate])

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Finalizar Processo
            </Title>
            <Form layout="vertical" validateMessages={validateMessages} form={form}>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem colon={false} label="Valor" name="price">
                            <Input placeholder="Valor" disabled prefix="R$"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Valor Financiado"
                            name="financialPrice"
                        >
                            <Input placeholder="Valor Financiado" disabled prefix="R$"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem colon={false} label="Taxa" name="fee" rules={required}>
                            <Input placeholder="Taxa"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem colon={false} label="Percentual" rules={required}>
                            <Input placeholder="Percentual"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Divider/>
            <Form
                layout="vertical"
                form={formComission}
                onFinish={handleAddComission}
            >
                <Title level={4} {...primaryText}>
                    Despesas
                </Title>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Despesas"
                            name="description"
                            rules={required}
                        >
                            <Input placeholder="Despesas"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Percentual"
                            name="percentual"
                            rules={required}
                        >
                            <Input placeholder="Percentual"/>
                        </FormItem>
                    </Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        {...largeMarginTop}
                        htmlType="submit"
                    >
                        Adicionar
                    </Button>
                </Row>
            </Form>
            <Table columns={orderColumn} {...marginTop} dataSource={comissions}/>
            <Button
                type="primary"
                icon={<CheckOutlined/>}
                {...largeMarginTop}
                htmlType="submit"
                onClick={handleSubmit}
            >
                Salvar
            </Button>
        </Spin>
    )
}
export default EndProcess
