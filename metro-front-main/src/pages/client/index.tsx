/* eslint-disable react-hooks/exhaustive-deps */
import {Button, Col, Form, Input, Modal, Popconfirm, Row, Space, Spin, Table, Typography,} from "antd";
import {useCallback, useEffect, useState} from "react";
import {buttonRadius} from "../../components/button";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined,} from "@ant-design/icons";
import {validateMessages} from "../../utils/ValidatorFields";
import {rowProps} from "../../utils/FormUtils";
import {marginTop, primaryText} from "../../styles/stylesProps";
import {useNavigate} from "react-router-dom";
import {ClientService} from "../../services/client";
import onNotification from "../../components/notification/notification";
import Client from "./view";
import {useForm} from "antd/lib/form/Form";

const FormItem = Form.Item;
const {Title} = Typography;

type ClientProps = {
    id: number;
    name: string;
    email: string;
    phone: string;
    externalId: string;
    document: string;
};

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModalView, setOpenModalView] = useState(false);
    const [clientId, setClientId] = useState(0);
    const [form] = useForm();

    const navigate = useNavigate();

    const fetchClients = useCallback(() => {
        setLoading(true);
        ClientService.getClients()
            .then((response) => {
                setClients(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Falha ao buscar.",
                });
            });
    }, []);

    const onSubmit = useCallback(async (client: string) => {
        setLoading(true);
        ClientService.getClientByName(client)
            .then((response) => {
                setClients(response.data);
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

    const deleteClient = useCallback((id) => {
        setLoading(true);
        ClientService.deleteClient(id)
            .then((response) => {
                setLoading(false);
                fetchClients();
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchClients(), []);

    const columns = [
        {
            title: "Nome",
            render: (r: ClientProps) => <span> {r.name} </span>,
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: "E-mail",
            render: (r: ClientProps) => <span> {r.email} </span>,
        },
        {
            title: "Telefone",
            render: (r: ClientProps) => <span> {r.phone} </span>,
        },
        {
            title: "CPF",
            render: (r: ClientProps) => <span> {r.document} </span>,
        },
        {
            title: "Acesso externo",
            render: (r: ClientProps) => (
                <a
                    href={`https://sistema.suporteimobiliario.com/external/cliente-comprador/${r.externalId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, wordBreak: 'break-all' }}
                >
                    Ver link
                </a>
            ),
            width: 100,
        },
        {
            title: "Ação",
            render: (r: ClientProps) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{color: "#4169E1"}}
                        onClick={() => {
                            setClientId(r.id);
                            setOpenModalView(true);
                        }}
                    />

                    <EditOutlined
                        style={{color: "#FF8C00"}}
                        onClick={() => navigate(`atualizar/${r.id}`)}
                    />
                    <Popconfirm
                        title="Deseja remover esse registro?"
                        onConfirm={() => {
                            deleteClient(r.id);
                        }}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <DeleteOutlined style={{color: "#ff0000"}}/>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Clientes
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
                            <Input placeholder="Digite o nome completo"/>
                        </FormItem>
                    </Col>
                </Row>
                <Space>
                    <Button
                        type="primary"
                        icon={<SearchOutlined/>}
                        {...buttonRadius}
                        htmlType="submit"
                    >
                        Pesquisar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => navigate("cadastrar")}
                        {...buttonRadius}
                    >
                        Cadastrar
                    </Button>
                </Space>
            </Form>
            <Table
                columns={columns}
                dataSource={clients}
                rowKey={(r: ClientProps) => r.id}
                scroll={{ x: 'max-content' }}
                {...marginTop}
            />
            <Modal
                visible={openModalView}
                onCancel={() => setOpenModalView(false)}
                footer={[
                    <Button
                        key="back"
                        type="primary"
                        onClick={() => setOpenModalView(false)}
                    >
                        Ok
                    </Button>,
                ]}
            >
                <Client id={clientId}/>
            </Modal>
        </Spin>
    );
};

export default Clients;
