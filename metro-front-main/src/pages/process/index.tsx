import {Button, Col, Form, Input, Modal, Popconfirm, Row, Space, Spin, Table, Tooltip, Typography,} from "antd";
import {useCallback, useEffect, useState} from "react";
import "moment/locale/pt-br";
import {buttonLeft, buttonRadius} from "../../components/button";
import {
    DeleteOutlined,
    DoubleRightOutlined,
    PaperClipOutlined,
    SearchOutlined,
    SendOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import {validateMessages} from "../../utils/ValidatorFields";
import {rowProps} from "../../utils/FormUtils";
import {marginTop, primaryText} from "../../styles/stylesProps";
import {useNavigate} from "react-router-dom";
import {ProcessService} from "../../services/process";
import moment from "moment";
import onNotification from "../../components/notification/notification";
import {useForm} from "antd/lib/form/Form";
import {AuthService} from "../../services/auth";
import api from "../../services/api";

const {Title} = Typography;
const FormItem = Form.Item;

type ProcessProps = {
    id: number;
    status: string;
    nameUser: string;
    createdAt: any;
    client: {
        name: string;
    };
    externalId: string;
    stepCurrent: {
        description: string;
        deadline: any;
        flow: string;
        step: {
            description: string;
        };
    };
    existInvoice: boolean;
    property: {
        description: string;
    };
};

const Processes = () => {
    const [loading, setLoading] = useState(false);
    const [processData, setProcessData] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const [form] = useForm();
    const [selectedUser, setSelectedUser] = useState<{ id: number | null }>({id: null});
    const [processId, setProcessId] = useState(null);

    moment.locale("pt-br");

    const fetchData = () => {
        setLoading(true);

        ProcessService.getProcess()
            .then((response) => {
                setProcessData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Erro ao carregar os dados",
                });
            });
    };

    const deleteProcess = useCallback((id) => {
        setLoading(true);
        ProcessService.deleteProcess(id)
            .then((response) => {
                setLoading(false);
                fetchData();
                onNotification("success", {
                    message: "Sucesso",
                    description: "Sucesso ao deletar.",
                });
            })
            .catch((error) => {

                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Falha ao deletar.",
                });
            });
    }, []);

    const onSubmit = useCallback(async (client: string) => {
        setLoading(true);

        ProcessService.getProcessByName(client)
            .then((response) => {
                setProcessData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Não encontrado.",
                });
            });
    }, []);


    const fetchUsers = async () => {
        setLoading(true);
        AuthService.findAll()
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Usuarios não encontrados.",
                });
            });
    };
    const showModal = (processId) => {
        setLoading(true)
        setIsModalVisible(true);
        setProcessId(processId);
        fetchUsers();
    };

    const handleUserSelect = (selectedUser) => {
        setSelectedUser(selectedUser);
    };


    const handleOk = async () => {
        setIsModalVisible(false);
        api.patch(`/processes/${processId}/change-users`, {
            userDestiny: selectedUser.id
        }).then((response) => {
            onNotification("success", {
                message: "Sucesso",
                description: "Usuario trocado com sucesso",
            });
            fetchData();
            setSelectedUser({id: null});
        })
            .catch((error) => {
                onNotification("error", {
                    message: "Erro",
                    description: "Ao trocar o usuario",
                });
            });

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: "ID do Processo",
            render: (r: ProcessProps) => <p>{r.id}</p>,
            sorter: (a: any, b: any) => a.id.localeCompare(b.id),
        },
        {
            title: "Cliente",
            render: (r: ProcessProps) => <p>{r.client.name}</p>,
            sorter: (a: any, b: any) => a.client.name.localeCompare(b.client.name),
        },
        {
            title: "Fluxo",
            render: (r: ProcessProps) => <p>{r.stepCurrent.flow}</p>,
            sorter: (a: any, b: any) =>
                a.stepCurrent.flow.localeCompare(b.stepCurrent.flow),
        },
        {
            title: "Etapa",
            render: (r: ProcessProps) => <p>{r.stepCurrent.step.description}</p>,
        },
        {
            title: "Dias do Processo",
            render: (r: ProcessProps) => <p> {moment(r.createdAt).fromNow()}</p>,
        },
        {
            title: "Prazo Total",
            render: (r: ProcessProps) => <p> {r.stepCurrent.deadline} dias </p>,
        },
        {
            title: "Status",
            render: (r: ProcessProps) => (
                <p>
                    {r.status === "SOLD"
                        ? "VENDIDO"
                        : r.status === "ACTIVE"
                            ? "ATIVO"
                            : ""}
                </p>
            ),
            sorter: (a: any, b: any) => a.status.localeCompare(b.status),
        },
        {
            title: "Opções",
            render: (r: ProcessProps) => (
                <Space size="middle">
                    {r.status === "SOLD" && !r.existInvoice && (
                        <Tooltip title="Finalizar Processo">
                            <SendOutlined
                                style={{color: "#4169E1"}}
                                onClick={() => navigate(`finalizar-processo/${r.id}`)}
                            />
                        </Tooltip>
                    )}
                    {r.existInvoice && (
                        <Tooltip title="Nota">
                            <PaperClipOutlined
                                style={{color: "#4169E1"}}
                                onClick={() => navigate(`nota/${r.id}`)}
                            />
                        </Tooltip>
                    )}
                    {!r.existInvoice && (
                        <Tooltip title="Mudar Etapa">
                            <DoubleRightOutlined
                                style={{color: "#4169E1"}}
                                onClick={() => navigate(`mudar-etapa/${r.id}`)}
                            />
                        </Tooltip>
                    )}
                    <Popconfirm
                        title="Deseja remover esse registro?"
                        onConfirm={() => {
                            deleteProcess(r.id);
                        }}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <DeleteOutlined style={{color: "#B22222"}}/>
                    </Popconfirm>
                </Space>
            ),
        },
        {
            title: "Usuário",
            render: (r: ProcessProps) => <p>{r.nameUser}</p>,
            sorter: (a: any, b: any) => a.client.name.localeCompare(b.client.name),
        },
        {
            title: 'Trocar usuário',
            key: 'action',
            render: (text, record) => (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <TeamOutlined onClick={() => showModal(record.id)} style={{fontSize: '15px', cursor: 'pointer'}}/>
                </div>
            ),
        }
    ];

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Processos
            </Title>
            <Form
                layout="vertical"
                validateMessages={validateMessages}
                onFinish={onSubmit}
                form={form}
            >
                <Row {...rowProps}>
                    <Col span={10}>
                        <FormItem colon={false} label="Nome" name="name">
                            <Input placeholder="Digite o nome do cliente"/>
                        </FormItem>
                    </Col>
                </Row>
                <Space>
                    <Button type="primary" icon={<SearchOutlined/>} {...buttonRadius} htmlType="submit">
                        Pesquisar
                    </Button>
                </Space>
            </Form>
            <Table
                columns={columns}
                rowKey={(r: ProcessProps) => r.id}
                dataSource={processData}
                {...marginTop}
            />
            <div {...buttonLeft}></div>
            <Modal title="Selecione um usuário" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Table
                    rowKey={(r: { id: number }) => r.id}
                    rowSelection={{type: 'radio', onSelect: handleUserSelect}}
                    columns={[{title: 'Nome', dataIndex: 'name'}]}
                    dataSource={users}/>
            </Modal>
        </Spin>
    );
};

export default Processes;
