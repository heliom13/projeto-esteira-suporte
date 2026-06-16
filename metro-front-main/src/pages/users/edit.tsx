import {Button, Col, Form, Input, Row, Select, Spin,} from 'antd'
import {useCallback, useEffect, useState} from 'react'

import {useLocation, useNavigate} from 'react-router-dom';

import FormItem from 'antd/lib/form/FormItem';
import api from "../../services/api";
import {required, validateMessages2} from "../../utils/ValidatorFields";
import {rowProps} from "../../utils/FormUtils";
import {OptionValue} from "../../utils/Fields";
import onNotification from "../../components/notification/notification";

const {Option} = Select

const Edit = () => {
    const location = useLocation();
    const [form] = Form.useForm()
    const [id, setId] = useState('')
    const navigate = useNavigate();

    const record = location.state as {
        id: string,
        name: string
        username: string,
        role: string,
        email: string
    };
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        form.setFieldsValue(record)
        setId(record.id)
        form.setFieldsValue({
                name: record.name,
                role: {
                    key: record.role,
                    label:
                        record.role === 'ADMIN' ? 'Administrador' :
                            record.role === 'SECRETARY' ? 'COMUM' :
                                record.role === 'ANALYST' ? 'Analista' :
                                    record.role === 'PROCESSOR' ? 'Processo' :
                                        'Básico',
                    value: record.role
                } as OptionValue
            }
        )
    }, [form, record]);

    const save = useCallback(
        async (data) => {
            const body = {
                name: data.name,
                username: data.username,
                role: data.role.value,
                email: data.email
            }

            api
                .put(`users/${id}`, body)
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
                    onNotification('error', {
                        message: 'ERR0:',
                        description: `Ocorreu um erro inesperado, por favor tente novamente. ${error.response.data.message}`,
                    });
                })

        },
        [form, id]
    )

    return (
        <Spin tip="Carregando..." spinning={loading}>
            <h1>Editar Usuário</h1>
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
                            Atualizar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Spin>
    )
}

export default Edit
