import {Button, Col, Form, Input, message, Popconfirm, Row, Select, Space, Spin, Table} from 'antd'
import {useCallback, useEffect, useState} from 'react'
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'
import {useNavigate} from "react-router-dom";
import api from "../../services/api";
import {rowProps} from "../../utils/FormUtils";

const FormItem = Form.Item
const {Option} = Select

type UserProps = {
    id: string
    name: string
    username: string
    email: string
    role: string
}

const Users = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const [users, setUsers] = useState<UserProps[]>([])
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
        },
        {
            title: 'Login',
            dataIndex: 'username'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Permissão',
            dataIndex: 'role',
            render: (r) => {
                const roleTranslations = {
                    ADMIN: 'Administrador',
                    SECRETARY: 'Comum',
                    ANALYST: 'Analista',
                    PROCESSOR: 'Processo'
                };

                return <span>{roleTranslations[r] || r}</span>;
            }

        },
        {
            title: 'Ações',
            key: 'acoes',
            render: (record: UserProps) => (
                <Space>
                    <Button
                        shape="circle"
                        icon={<EditOutlined/>}
                        onClick={() => {
                            // @ts-ignore
                            navigate('/usuarios/atualizar', {state: record})
                        }}
                    />
                    <Popconfirm
                        title={`Excluir "${record.name}"? Esta ação não pode ser desfeita.`}
                        okText="Sim, excluir"
                        cancelText="Cancelar"
                        okButtonProps={{danger: true}}
                        onConfirm={() => {
                            api.delete(`/users/${record.id}`)
                                .then(() => {
                                    message.success('Usuário excluído com sucesso!')
                                    fetchData()
                                })
                                .catch(() => message.error('Erro ao excluir usuário'))
                        }}
                    >
                        <Button shape="circle" icon={<DeleteOutlined/>} danger/>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const fetchData = useCallback(() => {
        setLoading(true)
        api.get('/users')
            .then(response => {
                setUsers(response.data)
                setLoading(false)
            })
            .catch(() => {
                message.error('Error ao buscar')
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    const search = useCallback(
        (data) => {
            console.log(data)
            setLoading(true)
            const params = {
                name: data.name,
                role: data.role?.value
            }
            api.get('users', {params})
                .then(response => {
                    setUsers(response.data)
                    setLoading(false)
                })
                .catch(() => {
                    message.error('Error ao buscar')
                    setLoading(false)
                })
        },
        []
    )

    return (
        <Spin tip="Carregando..." spinning={loading}>
            <h1>Usuários</h1>
            <Form layout="vertical" onFinish={search} form={form}>
                <Row {...rowProps}>
                    <Col xs={16} sm={10} md={6} lg={4}>
                        <FormItem colon={false} name="name" label="Nome">
                            <Input/>
                        </FormItem>
                    </Col>
                    <Col xs={16} sm={14} md={6} lg={5}>
                        <FormItem label="Tipo usuario" name="role">
                            <Select showSearch labelInValue allowClear={true}>
                                <Option key={1} value="ADMIN">
                                    ADMINISTRADOR
                                </Option>
                                <Option key={2} value="SECRETARY">
                                    COMUM
                                </Option>
                                <Option key={3} value="ANALYST">
                                    ANALISTA
                                </Option>
                                <Option key={3} value="PROCESSOR">
                                    PROCESSO
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Buscar
                        </Button>
                        <Button
                            type="ghost"
                            onClick={() => {
                                navigate('/usuarios/cadastrar')
                            }}
                        >
                            Cadastrar
                        </Button>
                    </Space>
                </Row>
                <br/>

            </Form>

            <Table rowKey={(r) => r.id} dataSource={users} columns={columns}/>
        </Spin>
    )
}

export default Users
