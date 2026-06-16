import {Button, Col, Form, Input, message, Row, Select, Spin,} from 'antd'
import {useCallback, useState} from 'react'
import api from "../../services/api";
import {required, validateMessages2} from "../../utils/ValidatorFields";
import {rowProps} from "../../utils/FormUtils";
import onNotification from "../../components/notification/notification";
import {useNavigate} from "react-router-dom";

const FormItem = Form.Item
const {Option} = Select

const CreateUsers = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const save = useCallback(
        async (data) => {
            const body = {
                name: data.name,
                username: data.username,
                role: data.role.value,
                email: data.email,
                password: data.username + '#@123'
            }

            if (data.role.value === 'ADMIN') {
                api
                    .post('users/admin', body)
                    .then(() => {
                        form.resetFields()
                        setLoading(false)
                        message.success('Senha alterada com sucesso')
                    })
                    .catch((error) => {
                        const title = error.response.data.title
                        const messageError =
                            error.response.data.userMessage || error.response.data.detail
                        message.error(`${title}: ${messageError}`)
                        setLoading(false)
                    })
            } else {
                api
                    .post('users/basic', body)
                    .then(() => {
                        form.resetFields()
                        setLoading(false)
                        onNotification("success", {
                            message: "Sucesso",
                            description: "Salvo com sucesso",
                        });
                        navigate("/usuarios");
                    })
                    .catch((error) => {
                        const title = error.response.data.title
                        const messageError =
                            error.response.data.userMessage || error.response.data.detail
                        message.error(`${title}: ${messageError}`)
                        setLoading(false)
                    })
            }
        },
        [form]
    )

    return (
        <Spin tip="Carregando..." spinning={loading}>
            <h1>Cadastro de Usuários</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={save}
                validateMessages={validateMessages2}
            >
                <Row {...rowProps}>
                    <Col xs={16} sm={8} md={8} lg={8}>
                        <FormItem
                            colon={false}
                            name="name"
                            label="Nome"
                            rules={required}
                            hasFeedback
                        >
                            <Input/>
                        </FormItem>
                    </Col>
                    <Col xs={16} sm={5} md={5} lg={5}>
                        <FormItem
                            colon={false}
                            name="username"
                            label="Login"
                            rules={required}
                            hasFeedback
                        >
                            <Input/>
                        </FormItem>
                    </Col>
                    <Col xs={16} sm={5} md={5} lg={6}>
                        <FormItem label="Tipo" rules={required} name="role">
                            <Select showSearch labelInValue>
                                <Option key={1} value="ADMIN">
                                    ADMINISTRADOR
                                </Option>
                                <Option key={2} value="SECRETARY">
                                    COMUM
                                </Option>
                                <Option key={3} value="ANALYST">
                                    ANALISTA
                                </Option>
                                <Option key={4} value="PROCESSOR">
                                    PROCESSO
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col xs={16} sm={8} md={8} lg={8}>
                        <FormItem
                            colon={false}
                            name="email"
                            label="Email"
                            rules={required}
                            hasFeedback
                        >
                            <Input/>
                        </FormItem>
                    </Col>
                </Row>


                <Row>
                    <Col span={24} style={{textAlign: 'left'}}>
                        <Button type="primary" htmlType="submit">
                            Cadastrar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Spin>
    )
}

export default CreateUsers
