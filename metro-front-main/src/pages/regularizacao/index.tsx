import React, {useCallback, useEffect, useState} from "react";
import {Button, Form, Input, Modal, Space, Table, Typography} from "antd";
import {PlusOutlined, FileProtectOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {ClientService} from "../../services/client";
import api from "../../services/api";
import onNotification from "../../components/notification/notification";
import {primaryText} from "../../styles/stylesProps";

const {Title} = Typography;

type Client = {
    id: number;
    name: string;
    phone: string;
};

const RegularizacaoHome: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [quickModalOpen, setQuickModalOpen] = useState(false);
    const [quickForm] = Form.useForm();
    const [quickLoading, setQuickLoading] = useState(false);
    const navigate = useNavigate();

    const fetchClients = useCallback(() => {
        setLoading(true);
        ClientService.getClients()
            .then((response) => setClients(response.data))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const filteredClients = clients.filter((client) =>
        client.name?.toLowerCase().includes(search.toLowerCase())
    );

    const startRegularization = (client: Client) => {
        navigate("cadastrar", {
            state: {clientId: client.id, clientName: client.name},
        });
    };

    const handleQuickCreate = (values: {name: string; phone: string}) => {
        setQuickLoading(true);
        api
            .post("/clients/quick", values)
            .then((response) => {
                onNotification("success", {
                    message: "Cliente criado",
                    description: "Cliente cadastrado com sucesso.",
                });
                setQuickModalOpen(false);
                quickForm.resetFields();
                fetchClients();
                startRegularization(response.data);
            })
            .catch(() => {
                onNotification("error", {
                    message: "Erro",
                    description: "Não foi possível criar o cliente.",
                });
            })
            .finally(() => setQuickLoading(false));
    };

    return (
        <div>
            <Title level={3} {...primaryText}>
                📋 Regularização
            </Title>

            <Space style={{marginBottom: 16}}>
                <Input.Search
                    placeholder="Buscar cliente por nome..."
                    allowClear
                    style={{width: 320}}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={() => setQuickModalOpen(true)}
                >
                    ➕ Novo cliente rápido
                </Button>
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={filteredClients}
                columns={[
                    {title: "Nome", dataIndex: "name"},
                    {title: "Telefone", dataIndex: "phone"},
                    {
                        title: "",
                        key: "actions",
                        render: (_, client) => (
                            <Button
                                icon={<FileProtectOutlined/>}
                                onClick={() => startRegularization(client)}
                            >
                                📋 Criar processo de regularização
                            </Button>
                        ),
                    },
                ]}
            />

            <Modal
                title="Novo cliente rápido"
                visible={quickModalOpen}
                onCancel={() => setQuickModalOpen(false)}
                onOk={() => quickForm.submit()}
                confirmLoading={quickLoading}
                okText="Criar e continuar"
                cancelText="Cancelar"
            >
                <Form form={quickForm} layout="vertical" onFinish={handleQuickCreate}>
                    <Form.Item
                        label="Nome"
                        name="name"
                        rules={[{required: true, message: "Informe o nome"}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Telefone"
                        name="phone"
                        rules={[{required: true, message: "Informe o telefone"}]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RegularizacaoHome;
