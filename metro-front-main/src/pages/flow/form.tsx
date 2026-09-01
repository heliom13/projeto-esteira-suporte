import {Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Table, Typography,} from 'antd'
import {useCallback, useEffect, useState} from 'react'
import {buttonProps} from '../../components/button'
import {rowProps} from '../../utils/FormUtils'
import {CheckOutlined, DeleteOutlined, PlusCircleOutlined, PlusOutlined} from '@ant-design/icons'
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
import {useWorkspace} from "../../contexts/WorkspaceContext";
import styled from "styled-components";

const FormItem = Form.Item
const {Option} = Select
const {Title} = Typography

const AddStepTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 6px 2px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px dashed #4762EA;
  color: #4762EA;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #f0f5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(71, 98, 234, 0.25);
  }

  &:active {
    transform: scale(0.97);
  }

  .anticon {
    font-size: 16px;
    animation: addStepPulse 1.8s ease-in-out infinite;
  }

  @keyframes addStepPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }
`

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
    const [newStepForm] = useForm()
    const [newStepModalOpen, setNewStepModalOpen] = useState(false)
    const [creatingStep, setCreatingStep] = useState(false)
    const navigate = useNavigate()
    const {workspace} = useWorkspace()
    const bancosPath = workspace === "regularizacao" ? "/regularizacao/fluxos" : "/bancos"

    const optionsSteps = steps
        .filter((step, index, all) => all.findIndex((s) => s.id === step.id) === index)
        .map(
            (step: { id: number; description: string }) => (
                <Option key={step.id} value={step.id} id={step.id}>
                    {step.description}
                </Option>
            )
        )

    const optionsFlowTypes = flowTypes
        .filter((flowType, index, all) => all.findIndex((f) => f.id === flowType.id) === index)
        .map(
            (flowType: { id: number; description: string }) => (
                <Option key={flowType.id} value={flowType.id} id={flowType.id}>
                    {flowType.description}
                </Option>
            )
        )

    const handleAddStep = useCallback(async () => {
        const value = form.getFieldValue('steps')
        if (!value) return
        setStepsOrder((documents) => [
            ...documents,
            {
                key: value.value,
                order: documents.length + 1,
                label: value.label,
                description: value.label,
            },
        ])
        form.setFieldsValue({steps: undefined})
    }, [form])

    const handleCreateStep = useCallback(async () => {
        try {
            const data = await newStepForm.validateFields()
            setCreatingStep(true)
            StepService.createStep({...data, requiredDocument: false}, [])
                .then((response) => {
                    const created = response.data
                    setSteps((prev) => [...prev, {id: created.id, description: created.description}])
                    form.setFieldsValue({steps: {value: created.id, label: created.description}})
                    onNotification('success', {
                        message: 'Sucesso',
                        description: 'Passo criado com sucesso',
                    })
                    newStepForm.resetFields()
                    setNewStepModalOpen(false)
                    setCreatingStep(false)
                })
                .catch(() => {
                    onNotification('error', {
                        message: 'Erro',
                        description: 'Erro ao criar passo, tente novamente em alguns instantes',
                    })
                    setCreatingStep(false)
                })
        } catch (error) {
            // validation error, keep modal open
        }
    }, [newStepForm, form])

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
                            navigate(bancosPath)
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
                            navigate(bancosPath)
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
                                virtual={false}
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
                                virtual={false}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <AddStepTrigger
                                            onClick={() => setNewStepModalOpen(true)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            <PlusCircleOutlined/>
                                            Não achou o passo? Adicionar novo passo
                                        </AddStepTrigger>
                                    </>
                                )}
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

            <Modal
                title="✨ Novo Passo"
                visible={newStepModalOpen}
                onCancel={() => {
                    setNewStepModalOpen(false)
                    newStepForm.resetFields()
                }}
                onOk={() => handleCreateStep()}
                okText="Criar passo"
                cancelText="Cancelar"
                confirmLoading={creatingStep}
                destroyOnClose
            >
                <Form layout="vertical" form={newStepForm}>
                    <FormItem colon={false} label="Descrição" name="description" rules={required}>
                        <Input placeholder="Descrição do passo"/>
                    </FormItem>
                    <FormItem colon={false} label="Prazo em Dias" name="deadline" rules={required}>
                        <Input placeholder="Prazo" type="number" min={1}/>
                    </FormItem>
                </Form>
            </Modal>
        </Spin>
    )
}
export default FlowForm
