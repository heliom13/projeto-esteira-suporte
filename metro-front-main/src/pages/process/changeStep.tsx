import {Button, Col, Divider, Form, Input, List, Mentions, Modal, Row, Spin, Tabs, Typography, Alert,} from 'antd'
import {useForm} from 'antd/lib/form/Form'
import moment from 'moment'
import {useCallback, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import onNotification from '../../components/notification/notification'
import {TimelineComponent} from '../../components/timeline'
import {ProcessService} from '../../services/process'
import {primaryText} from '../../styles/stylesProps'
import {rowProps} from '../../utils/FormUtils'
import DelayForm from './delayForm'
import {AuthService} from "../../services/auth";
import api from "../../services/api";

const {Title} = Typography
const {TabPane} = Tabs;
const FormItem = Form.Item
const {Option} = Mentions;

type StepProps = {
    step: string
    deadline: string
    orderStep: string
    statusStep: string
}
const ChangeStep = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [process, setProcess] = useState<any>({})
    const [form] = useForm()
    const [formDelay] = useForm()
    const [formModal] = useForm()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalDelay, setModalDelay] = useState(false)
    const [flowDays, setFlowDays] = useState(0)
    const [steps, setSteps] = useState<StepProps[]>([])
    const [stepId, setStepId] = useState(0)
    const navigate = useNavigate()
    const [isUserProcessOwner, setIsUserProcessOwner] = useState(false)
    const [users, setUsers] = useState([]);
    const [replies, setReplies] = useState({});
    const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
    const [currentCommentId, setCurrentCommentId] = useState(null);
    const [replyForm] = Form.useForm();
    const [isConfirmNextVisible, setIsConfirmNextVisible] = useState(false);
    const [nextStepNote, setNextStepNote] = useState('');

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setModalDelay(false)
        formModal.resetFields()
        formDelay.resetFields()
    }

    const fetchData = () => {
        setLoading(true)
        AuthService.findAll().then((response) => {
            setUsers(response.data);
        });
        ProcessService.getProcessSteps(id).then((response) => {
            setSteps(response.data)
            setLoading(false)
        })
        ProcessService.getProcessById(id).then((response) => {
            setLoading(false)
            setProcess(response.data)
            setStepId(response.data.stepCurrent.id)
            setIsUserProcessOwner(response.data.isUserProcessOwner);

            const commentReplies = response.data.comments.reduce((acc, comment) => {
                acc[comment.id] = comment.replies;
                return acc;
            }, {});
            setReplies(commentReplies);

            const flowUpdated = moment(
                response.data.stepCurrent.updatedAt,
                'YYYY-MM-DD'
            )
            const flowCreated = moment(
                response.data.stepCurrent.updatedAt,
                'YYYY-MM-DD'
            )

            setFlowDays(moment.duration(flowCreated.diff(flowUpdated)).asDays())

            if (response.data.client) {
                form.setFieldsValue({
                    client: response.data.client.name,
                });
            }

            if (response.data.property) {
                form.setFieldsValue({
                    description: response.data.property.name,
                });
            }

            form.setFieldsValue({
                currentStatus: response.data.stepCurrent.step.description,
            });
        })
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const submitModal = useCallback(
        async (data) => {
            setLoading(false)
            try {
                await ProcessService.addUnforeseen(id, data)
                    .then((response) => {
                        onNotification('success', {
                            message: 'Sucesso',
                            description: 'Salvo com sucesso',
                        })
                        setLoading(false)
                        setIsModalVisible(false)
                        navigate('/processos')
                    })
                    .catch((error) => {
                        onNotification('error', {
                            message: 'Erro',
                            description: error.response.data.message,
                        })
                        setLoading(false)
                    })
            } catch (error) {
                onNotification('error', {
                    message: 'Erro',
                    description: 'Falha ao salvar.',
                })
                setLoading(false)

            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [stepId]
    )

    const nextStep = useCallback(
        async (data) => {
            setLoading(true)
            try {
                ProcessService.nextStepProcess(id, { ...data, observation: nextStepNote })
                    .then(() => {
                        onNotification('success', {
                            message: 'SUCESSO',
                            description: 'Salvo com sucesso',
                        })
                        setLoading(false)
                        setModalDelay(false)
                        setIsConfirmNextVisible(false)
                        setNextStepNote('')
                        navigate('/processos')
                    })
                    .catch((error) => {
                        onNotification('error', {
                            message: 'ERRO',
                            description: error.response.data.message,
                        })
                        setLoading(false)
                    })
            } catch (error) {
                setLoading(false)
            }
        },
        [id, navigate, nextStepNote]
    )

    const handleReplySubmit = async (commentId, reply) => {
        try {
            setLoading(true)
            api.post('/comment-replies', {
                commentId,
                reply,
            }).then((response) => {
                onNotification('success', {
                    message: 'SUCESSO',
                    description: 'Salvo com sucesso',
                })
                fetchData()
                form.setFieldsValue({content: '', reply: ''});
                setLoading(false)
            })
                .catch((error) => {
                    onNotification('error', {
                        message: 'ERRO',
                        description: error.response.data.message,
                    })
                    setLoading(false)
                })

        } catch (error) {
            onNotification('error', {
                message: 'ERRO',
                description: 'Falha ao salvar.',
            });
            setLoading(false);
            
        }
    };

    const showReplyModal = (commentId) => {
        setCurrentCommentId(commentId);
        setIsReplyModalVisible(true);
    };

    const handleReplyModalCancel = () => {
        setIsReplyModalVisible(false);
        replyForm.resetFields();
    };

    const handleReplyFormFinish = (data) => {
        handleReplySubmit(currentCommentId, data.reply);
        setIsReplyModalVisible(false);
        replyForm.resetFields();
    };

    // @ts-ignore
    return (
        <Spin tip="Carregando..." spinning={loading}>
            <Title level={3} {...primaryText}>
                Processo de {process?.stepCurrent?.flowType} - N {process.id}
            </Title>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Mudar Status" key="1">
                    <Form layout="vertical" form={form} colon={false}>
                        <Row {...rowProps}>
                            <Col sm={10} md={8}>
                                <FormItem label="Descrição" name="description">
                                    <Input disabled/>
                                </FormItem>
                            </Col>
                            <Col sm={10} md={8}>
                                <FormItem label="Cliente" name="client">
                                    <Input disabled/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row {...rowProps}>
                            <Col span={8}>
                                <FormItem label="Status Atual" name="currentStatus">
                                    <Input disabled/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Divider/>
                    <Title level={4}> Passos do Processo </Title>
                    <br/>
                    <TimelineComponent process={process} steps={steps}/>
                    <Divider/>
                    <Row
                        {...rowProps}
                        style={{
                            justifyContent: 'center',
                            marginTop: '22px',
                        }}
                    >
                        <Col span={8}>
                            <Button
                                block
                                style={{
                                    backgroundColor: isUserProcessOwner ? '#4169E1' : '#808080',
                                    color: '#fff',
                                    borderRadius: '4px',
                                }}
                                onClick={() => {
                                    setNextStepNote('')
                                    setIsConfirmNextVisible(true)
                                }}
                                disabled={!isUserProcessOwner}
                            >
                                Próxima Etapa
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Button
                                block
                                style={{
                                    backgroundColor: isUserProcessOwner ? '#B22222' : '#808080',
                                    color: '#fff',
                                    borderRadius: '4px',
                                }}
                                onClick={showModal}
                                disabled={!isUserProcessOwner}
                            >
                                Imprevisto
                            </Button>
                        </Col>
                    </Row>
                    <Modal
                        title="Confirmar mudança de etapa"
                        visible={isConfirmNextVisible}
                        onCancel={() => {
                            setIsConfirmNextVisible(false)
                            setNextStepNote('')
                        }}
                        footer={[
                            <Button key="cancel" onClick={() => {
                                setIsConfirmNextVisible(false)
                                setNextStepNote('')
                            }}>
                                Cancelar
                            </Button>,
                            <Button
                                key="confirm"
                                type="primary"
                                loading={loading}
                                onClick={() => {
                                    setIsConfirmNextVisible(false)
                                    const data = { reason: null }
                                    flowDays > process?.flowStepCurrent?.deadline
                                        ? setModalDelay(true)
                                        : nextStep(data)
                                }}
                            >
                                Confirmar e Avançar
                            </Button>,
                        ]}
                    >
                        <Alert
                            message={`Etapa atual: ${process?.stepCurrent?.step?.description ?? process?.stepCurrent?.description ?? '—'}`}
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                        <div style={{ marginBottom: 8, fontWeight: 500 }}>
                            Observação para o cliente <span style={{ color: '#999', fontWeight: 400 }}>(opcional)</span>
                        </div>
                        <Input.TextArea
                            rows={3}
                            value={nextStepNote}
                            onChange={e => setNextStepNote(e.target.value)}
                            placeholder="Ex: Aguardamos o envio dos documentos até sexta-feira..."
                        />
                        <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
                            Se preenchida, esta mensagem será incluída no WhatsApp enviado ao cliente, vendedor e corretor.
                        </div>
                    </Modal>
                    <Modal
                        visible={modalDelay}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Cancelar
                            </Button>,
                            <Button
                                htmlType="submit"
                                form="delayForm"
                                type="primary"
                                loading={loading}
                            >
                                Salvar
                            </Button>,
                        ]}
                    >
                        <DelayForm form={formDelay} onFinish={nextStep}/>
                    </Modal>
                    <Modal
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Cancelar
                            </Button>,
                            <Button
                                htmlType="submit"
                                form="unforeseenForm"
                                type="primary"
                                loading={loading}
                            >
                                Salvar
                            </Button>,
                        ]}
                    >
                        <Form
                            id="unforeseenForm"
                            layout="vertical"
                            colon={false}
                            form={formModal}
                            onFinish={submitModal}
                        >
                            <Title level={4}>Imprevisto</Title>
                            <Row {...rowProps}>
                                <Col span={18}>
                                    <FormItem label="Motivo" name="reason">
                                        <Input placeholder="Motivo"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row {...rowProps}>
                                <Col md={8}>
                                    <FormItem label="Prazo (em dias)" name="deadline">
                                        <Input placeholder="Novo prazo"/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </TabPane>
                <TabPane tab="Histórico" key="2">
                    <List
                        itemLayout="horizontal"
                        dataSource={process.notifications}
                        renderItem={(item: any) => (
                            <List.Item style={{color: 'red !important', marginTop: '20px'}}>
                                <List.Item.Meta
                                    style={{color: 'red !important'}}
                                    title={<Typography.Text strong>{item.description}</Typography.Text>}
                                    description={
                                        <div style={{
                                            color: 'black',
                                        }}>
                                            <div><strong>Passo:</strong> {item.stepCurrent}</div>
                                            {item.destiny === 'NOTIFICATION' ? (
                                                <>
                                                    <div><strong>Usuário de Origem:</strong> {item.userOriginName}</div>
                                                    <div><strong>Usuário de Destino:</strong> {item.userDestinyName}
                                                    </div>
                                                </>
                                            ) : (
                                                <div><strong>Usuário:</strong> {item.userOriginName}</div>
                                            )}
                                            <div><strong>Data de
                                                Criação:</strong> {new Date(item.createdAt).toLocaleString()}</div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </TabPane>
                <TabPane tab="Comentários" key="3">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={(data) => {
                            setLoading(true)
                            ProcessService.addComment(id, data)
                                .then(() => {
                                    setLoading(false)
                                    onNotification('success', {
                                        message: 'SUCESSO',
                                        description: 'Comentário adicionado com sucesso',
                                    });

                                    fetchData()
                                    form.setFieldsValue({content: ''});
                                })
                                .catch((error) => {
                                    setLoading(false)
                                    onNotification('error', {
                                        message: 'ERRO',
                                        description: error.response.data.message,
                                    });
                                });
                        }}
                    >
                        <Row {...rowProps}>
                            <Col span={18}>
                                <FormItem label="Comentário" name="content"
                                          rules={[{required: true, message: 'Por favor, insira um comentário!'}]}>
                                    <Mentions
                                        rows={5}
                                        placeholder="Insira seu comentário aqui. Use @ para mencionar usuários."

                                    >
                                        {users?.map((user: { id: string, username: string }) => (
                                            <Option key={user.id} value={user.username}>
                                                {user.username}
                                            </Option>
                                        ))}
                                    </Mentions>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row {...rowProps}>
                            <Col span={8}>
                                <Button type="primary" htmlType="submit">
                                    Enviar Comentário
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <List
                        itemLayout="horizontal"
                        dataSource={process?.comments}
                        renderItem={(item: any) => (
                            <List.Item style={{marginTop: '20px'}}>
                                <List.Item.Meta
                                    title={<Typography.Text strong>Autor: {item.username}</Typography.Text>}
                                    description={
                                        <div style={{
                                            color: 'black',
                                        }}>
                                            <div><strong>Comentário:</strong> {item.content}</div>
                                            <div><strong>Data:</strong> {new Date(item.createdAt).toLocaleString()}
                                            </div>
                                            <Button
                                                type="primary"
                                                onClick={() => showReplyModal(item.id)}
                                                style={{
                                                    backgroundColor: 'white',
                                                    color: 'rgb(64, 150, 255)',
                                                    borderColor: 'rgb(64, 150, 255)',
                                                    marginTop: '10px',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                Responder
                                            </Button>
                                            {replies[item.id] && replies[item.id].map(reply => (
                                                <div style={{
                                                    marginLeft: '20px',
                                                    marginTop: '10px'
                                                }}> {/* Adicione marginTop para adicionar espaço acima das respostas */}
                                                    <p style={{color: 'gray'}}>
                                                        <strong>Resposta:</strong> {reply.content}
                                                    </p> {/* Altere a cor do texto para cinza */}
                                                    <p style={{color: 'gray'}}><strong>Autor:</strong> {reply.username}
                                                    </p>
                                                    <p style={{color: 'gray'}}>
                                                        <strong>Data:</strong> {new Date(reply.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </TabPane>

            </Tabs>
            <Modal
                title="Responder ao Comentário"
                visible={isReplyModalVisible}
                onCancel={handleReplyModalCancel}
                footer={null}
            >
                <Form
                    form={replyForm}
                    onFinish={handleReplyFormFinish}
                >
                    <Form.Item name="reply" rules={[{required: true, message: 'Por favor, insira sua resposta!'}]}>
                        <Input.TextArea rows={4} placeholder="Insira sua resposta aqui"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Enviar Resposta
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}

// @ts-ignore
export default ChangeStep
