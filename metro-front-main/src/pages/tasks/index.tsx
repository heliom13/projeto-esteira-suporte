import React, {useCallback, useEffect, useState} from "react";
import {
    Button,
    Col,
    Empty,
    Form,
    Input,
    List,
    Mentions,
    Modal,
    Row,
    Spin,
    Tabs,
    Tag,
    Typography,
} from "antd";
import {CheckOutlined, PlusOutlined} from "@ant-design/icons";
import moment from "moment";
import "moment/locale/pt-br";
import {useForm} from "antd/lib/form/Form";
import {TaskService} from "../../services/task";
import api from "../../services/api";
import onNotification from "../../components/notification/notification";
import {useAuth} from "../../contexts/AuthContext";
import {primaryText} from "../../styles/stylesProps";

const FormItem = Form.Item;
const {Title, Text} = Typography;
const {Option} = Mentions;

type TaskProps = {
    id: number;
    title: string;
    description: string | null;
    assignedByName: string;
    assignedToName: string;
    assignedToUsername: string;
    status: string;
    dueDate: string | null;
    seen: boolean;
    createdAt: string;
};

type UserProps = {
    id: number;
    name: string;
    username: string;
};

const extractMentionedUsername = (text: string): string | null => {
    const match = text.match(/@([\w.]+)/);
    return match ? match[1] : null;
};

const Tasks = () => {
    moment.locale("pt-br");
    const {hasAnyRole} = useAuth();
    const isAdmin = hasAnyRole(["ADMIN"]);
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [users, setUsers] = useState<UserProps[]>([]);
    const [mine, setMine] = useState<TaskProps[]>([]);
    const [assignedByMe, setAssignedByMe] = useState<TaskProps[]>([]);

    const fetchMine = useCallback(() => {
        setLoading(true);
        TaskService.getMine()
            .then((response) => setMine(response.data))
            .finally(() => setLoading(false));
    }, []);

    const fetchAssignedByMe = useCallback(() => {
        if (!isAdmin) return;
        TaskService.getAssignedByMe().then((response) => setAssignedByMe(response.data));
    }, [isAdmin]);

    useEffect(() => {
        fetchMine();
        fetchAssignedByMe();
        TaskService.markAllSeen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = () => {
        api.get("/users").then((response) => setUsers(response.data));
        setModalOpen(true);
    };

    const handleComplete = (id: number) => {
        TaskService.complete(id)
            .then(() => {
                onNotification("success", {message: "Sucesso", description: "Tarefa concluída"});
                fetchMine();
                fetchAssignedByMe();
            })
            .catch(() => {
                onNotification("error", {message: "Erro", description: "Erro ao concluir tarefa"});
            });
    };

    const handleCreate = (data: any) => {
        const assignedToUsername = extractMentionedUsername(data.assignedTo || "");
        if (!assignedToUsername) {
            onNotification("error", {
                message: "Erro",
                description: "Mencione um usuário com @ no campo Atribuir para",
            });
            return;
        }

        setCreating(true);
        TaskService.createTask({
            title: data.title,
            description: data.description,
            assignedToUsername,
            dueDate: data.dueDate || undefined,
        })
            .then(() => {
                onNotification("success", {message: "Sucesso", description: "Tarefa atribuída com sucesso"});
                setModalOpen(false);
                form.resetFields();
                fetchAssignedByMe();
            })
            .catch((error) => {
                onNotification("error", {
                    message: "Erro",
                    description: error?.response?.data?.message || "Erro ao criar tarefa",
                });
            })
            .finally(() => setCreating(false));
    };

    const statusTag = (status: string) =>
        status === "DONE" ? (
            <Tag color="green">Concluída</Tag>
        ) : (
            <Tag color="orange">Pendente</Tag>
        );

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={3} {...primaryText}>
                        ✅ Tarefas
                    </Title>
                </Col>
                {isAdmin && (
                    <Col>
                        <Button type="primary" icon={<PlusOutlined/>} onClick={openModal}>
                            Nova tarefa
                        </Button>
                    </Col>
                )}
            </Row>

            <Tabs defaultActiveKey="mine">
                <Tabs.TabPane tab="📥 Atribuídas a mim" key="mine">
                    {mine.length === 0 ? (
                        <Empty description="Nenhuma tarefa atribuída a você" style={{marginTop: 40}}/>
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={mine}
                            renderItem={(task) => (
                                <List.Item
                                    actions={
                                        task.status === "PENDING"
                                            ? [
                                                  <Button
                                                      key="complete"
                                                      icon={<CheckOutlined/>}
                                                      onClick={() => handleComplete(task.id)}
                                                  >
                                                      Concluir
                                                  </Button>,
                                              ]
                                            : []
                                    }
                                >
                                    <List.Item.Meta
                                        title={
                                            <span>
                                                {task.title} {statusTag(task.status)}
                                            </span>
                                        }
                                        description={
                                            <div>
                                                {task.description && <div>{task.description}</div>}
                                                <Text type="secondary">
                                                    Atribuído por {task.assignedByName} em{" "}
                                                    {moment(task.createdAt).format("DD/MM/YYYY [às] HH:mm")}
                                                    {task.dueDate &&
                                                        ` — Prazo: ${moment(task.dueDate).format("DD/MM/YYYY")}`}
                                                </Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </Tabs.TabPane>

                {isAdmin && (
                    <Tabs.TabPane tab="📤 Atribuídas por mim" key="byMe">
                        {assignedByMe.length === 0 ? (
                            <Empty description="Você ainda não atribuiu nenhuma tarefa" style={{marginTop: 40}}/>
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={assignedByMe}
                                renderItem={(task) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <span>
                                                    {task.title} {statusTag(task.status)}
                                                </span>
                                            }
                                            description={
                                                <div>
                                                    {task.description && <div>{task.description}</div>}
                                                    <Text type="secondary">
                                                        Atribuída para {task.assignedToName} em{" "}
                                                        {moment(task.createdAt).format("DD/MM/YYYY [às] HH:mm")}
                                                        {task.dueDate &&
                                                            ` — Prazo: ${moment(task.dueDate).format("DD/MM/YYYY")}`}
                                                    </Text>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Tabs.TabPane>
                )}
            </Tabs>

            <Modal
                title="➕ Nova tarefa"
                visible={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                okText="Atribuir"
                cancelText="Cancelar"
                confirmLoading={creating}
                destroyOnClose
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <FormItem
                        colon={false}
                        label="Título"
                        name="title"
                        rules={[{required: true, message: "Informe o título"}]}
                    >
                        <Input placeholder="Ex: Enviar contrato para o cliente"/>
                    </FormItem>
                    <FormItem colon={false} label="Descrição" name="description">
                        <Input.TextArea rows={3} placeholder="Detalhes da tarefa (opcional)"/>
                    </FormItem>
                    <FormItem
                        colon={false}
                        label="Atribuir para"
                        name="assignedTo"
                        rules={[{required: true, message: "Mencione um usuário com @"}]}
                    >
                        <Mentions placeholder="Digite @ para escolher o responsável">
                            {users.map((user) => (
                                <Option key={String(user.id)} value={user.username}>
                                    {user.name} (@{user.username})
                                </Option>
                            ))}
                        </Mentions>
                    </FormItem>
                    <FormItem colon={false} label="Prazo (opcional)" name="dueDate">
                        <Input type="date"/>
                    </FormItem>
                </Form>
            </Modal>
        </Spin>
    );
};

export default Tasks;
