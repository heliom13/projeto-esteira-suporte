import {Button, Checkbox, Col, Form, Input, Row, Select, Spin, Table, Typography,} from 'antd'
import {useCallback, useEffect, useState} from 'react'
import {buttonProps} from '../../components/button'
import {rowProps} from '../../utils/FormUtils'
import {CheckOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import {StepService} from '../../services/step'
import onNotification from '../../components/notification/notification'
import {largeMarginTop, primaryText,} from '../../styles/stylesProps'
import {FlowService} from '../../services/flow'
import {useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'antd/lib/form/Form'
import type {DragEndEvent} from '@dnd-kit/core';
import {DndContext, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import type {ColumnsType} from 'antd/es/table';
import {required} from "../../utils/ValidatorFields";

const FormItem = Form.Item
const {Option} = Select
const {Title} = Typography

type StepOrderProps = {
    id: number
    order: number
    label: string
    description: string
}

type StepProps = {
    id: number
    description: string
}
type FlowProps = {
    stepId: number
    order: number
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const FlowForm = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [steps, setSteps] = useState<StepProps[]>([])
    const [stepsOrder, setStepsOrder] = useState<any[]>([])
    const [flowTypes, setFlowTypes] = useState<StepProps[]>([])
    const [flow, setFlow] = useState<FlowProps[]>([])
    const [form] = useForm()
    const navigate = useNavigate()

    const optionsSteps = steps.map(
        (step: { id: number; description: string }) => (
            <Option value={step.id} id={step.id}>
                {step.description}
            </Option>
        )
    )

    const optionsFlowTypes = flowTypes.map(
        (flowType: { id: number; description: string }) => (
            <Option value={flowType.id} id={flowType.id}>
                {flowType.description}
            </Option>
        )
    )

    const handleAddStep = useCallback(async () => {
        let value = form.getFieldValue('steps')
        setStepsOrder((documents) => [...documents, value])
    }, [form])

    useEffect(() => {
        let newFlow = stepsOrder.map((item, index) => ({
            stepId: item.value ? item.value : item.key,
            order: index + 1,
        }))

        setFlow(newFlow)
    }, [stepsOrder])

    const fetchSteps = () => {
        setLoading(true)
        StepService.getSteps()
            .then((response) => {
                setSteps(response.data)
                setLoading(false)
            })
            .catch((error) => {
                onNotification('error', {
                    message: 'Erro',
                    description: 'Erro ao buscar passos',
                })
            })
    }

    const fetchFlowTypes = () => {
        setLoading(true)
        try {
            FlowService.getFlowTypes().then((response) => {
                setFlowTypes(response.data)
                setLoading(false)
            })
        } catch (error) {

            onNotification('error', {
                message: 'Erro',
                description: 'Erro ao carregar',
            })
            setLoading(false)
        }
    }

    const fetchStep = () => {
        setLoading(true)
        try {
            FlowService.getFlow(id).then((response) => {
                setLoading(false)
                form.setFieldsValue({
                    description: response.data.description,
                    hasClient: response.data.hasClient,
                    hasProperty: response.data.hasProperty,
                    hasSellerMain: response.data.hasSellerMain,
                    hasSellerSecondary: response.data.hasSellerSecondary,
                    sendMessage: response.data.sendMessage,
                    flowType: {key: response.data.typeFlow.id, label: response.data.typeFlow.description},
                })

                let data = (response.data.steps.map((item, index) => ({
                    deadline: item.deadline,
                    description: item.description,
                    key: item.id,
                    order: index + 1,
                    requiredDocument: item.requiredDocument
                })))

                setStepsOrder(data)
            })
        } catch (error) {

            onNotification('error', {
                message: 'Erro',
                description: 'Erro ao carregar',
            })
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchSteps()
        fetchFlowTypes()
        if (id) {
            fetchStep()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const orderColumn: ColumnsType<StepOrderProps> = [
        {
            title: 'Passo',
            render: (r: StepOrderProps) => (
                <p> {r.label ? r.label : r.description}</p>
            ),
        },
        {
            title: 'Ordem',
            render: (r: StepOrderProps) => stepsOrder.indexOf(r) + 1,
        },
        {
            title: '',
            render: (r: StepOrderProps) => (
                <DeleteOutlined
                    style={{color: '#B22222'}}
                    onClick={() => {
                        if (id) {
                            setStepsOrder(
                                stepsOrder.filter((item) => item.description !== r.description)
                            )
                        } else {
                            setStepsOrder(stepsOrder.filter((item) => item.label !== r.label))
                        }
                    }}
                />
            ),
        },
    ]


    const RowTable = (props: RowProps) => {
        const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
            id: props['data-row-key'],
        });

        const style: React.CSSProperties = {
            ...props.style,
            transform: CSS.Translate.toString(transform),
            transition,
            cursor: 'move',
            ...(isDragging ? {position: 'relative', zIndex: 9999} : {}),
        };

        return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
                distance: 1,
            },
        }),
    );

    const onDragEnd = ({active, over}: DragEndEvent) => {

        if (active.id !== over?.id) {
            setStepsOrder((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const handleSubmit = useCallback(
        async (data) => {
            if (id) {
                try {
                    setLoading(true)
                    FlowService.updateFlow(data, flow, id)
                        .then((response) => {
                            onNotification('success', {
                                message: 'Sucesso',
                                description: 'Atualizado com sucesso!',
                            })
                            setLoading(false)
                            navigate('/bancos')
                        })
                        .catch(error => {
                            setLoading(false)
                            onNotification('error', {
                                message: 'ERR0:',
                                description: `Ocorreu um erro inesperado. ${error.response.data.message}`
                            });
                            if (error.response.data.objects) {
                                error.response.data.objects.forEach((obj) => {
                                    onNotification('error', {
                                        description: obj.message,
                                    });
                                });
                            }

                        })
                } catch (error) {

                }
            } else {
                try {
                    setLoading(true)
                    FlowService.createFlow(data, flow)
                        .then((response) => {
                            onNotification('success', {
                                message: 'Sucesso',
                                description: 'Salvo com sucesso!',
                            })
                            setLoading(false)
                            navigate('/bancos')
                        })
                        .catch((error) => {

                            onNotification('error', {
                                message: 'ERR0:',
                                description: `Ocorreu um erro inesperado. ${error.response.data.message}`,
                            });

                            if (error.response.data.objects) {
                                error.response.data.objects.forEach((obj) => {
                                    onNotification('error', {
                                        description: obj.message,
                                    });
                                });
                            }
                            setLoading(false)
                        })
                } catch (error) {
                    setLoading(false);
                    onNotification('error', {
                        message: 'ERR0:',
                        description: 'Ocorreu um erro inesperado, por favor tente novamente.',
                    });
                }
            }
        },
        [flow, id, navigate]
    )

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Cadastro de Fluxos
            </Title>
            <Form layout="vertical" onFinish={handleSubmit} id="flowForm" form={form}>
                <Row {...rowProps}>
                    <Col md={12}>
                        <FormItem colon={false} label="Descrição" name="description" rules={required}>
                            <Input placeholder="Descrição"/>
                        </FormItem>
                    </Col>
                    <Col md={6}>
                        <FormItem colon={false} label="Tipo de fluxo" name="flowType" rules={required}>
                            <Select
                                showSearch
                                labelInValue
                                placeholder="Escolha"
                                optionFilterProp="children"
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                                allowClear
                            >
                                {optionsFlowTypes}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col md={4}>
                        <FormItem colon={false} label="Envia mensagem" name="sendMessage" valuePropName="checked">
                            <Checkbox/>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col md={12}>
                        <FormItem colon={false} label="Passos" name="steps">
                            <Select
                                showSearch
                                labelInValue
                                placeholder="Escolha"
                                optionFilterProp="children"
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                                allowClear
                            >
                                {optionsSteps}
                            </Select>
                        </FormItem>
                    </Col>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined/>}
                        {...largeMarginTop}
                        onClick={() => handleAddStep()}
                    />
                </Row>
            </Form>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={stepsOrder.map((i) => i.order)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        components={{
                            body: {
                                row: RowTable,
                            },
                        }}
                        rowKey="key"
                        columns={orderColumn}
                        dataSource={stepsOrder}
                    />
                </SortableContext>
            </DndContext>
            {/* <Table
        columns={orderColumn}
        dataSource={stepsOrder}
        {...marginTop}
        rowKey={(r: StepOrderProps) => r.id}
      /> */}

            <Button
                type="primary"
                icon={<CheckOutlined/>}
                {...buttonProps}
                htmlType="submit"
                form="flowForm"
            >
                Salvar
            </Button>
        </Spin>
    )
}
export default FlowForm
