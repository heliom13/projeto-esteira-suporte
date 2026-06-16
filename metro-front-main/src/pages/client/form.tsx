import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, DatePicker, Divider, Form, Input, Row, Select, Spin, Typography,} from "antd";
import {buttonProps} from "../../components/button";
import {rowProps} from "../../utils/FormUtils";
import {required, validateMessages} from "../../utils/ValidatorFields";
import {MaskedInput} from "antd-mask-input";
import {cpf} from "cpf-cnpj-validator";
import onNotification from "../../components/notification/notification";
import {useNavigate, useParams} from "react-router-dom";
import {ClientService} from "../../services/client";
import {primaryText} from "../../styles/stylesProps";
import {useForm} from "antd/lib/form/Form";
import moment from "moment";

const {Option} = Select;
const FormItem = Form.Item;
const {Title} = Typography;

const ClientForm = () => {
    const [loading, setLoading] = useState(false);
    const DatePickerT: any = DatePicker;
    const navigate = useNavigate();
    const params = useParams();
    const [form] = useForm();

    const onSubmit = useCallback(async (data: any) => {
        if (params.id) {
            try {
                setLoading(true);
                ClientService.updateClient(data, params.id)
                    .then((response) => {
                        setLoading(false);
                        onNotification("success", {
                            message: "Sucesso",
                            description: "Salvo com sucesso",
                        });
                        navigate("/cliente-comprador");
                    })
                    .catch((error) => {
                        setLoading(false);
                        onNotification("error", {
                            message: "Erro",
                            description: "Falha ao salvar.",
                        });
                    });
            } catch (error) {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Falha ao salvar.",
                });

            }
        } else {
            try {
                setLoading(true);
                ClientService.createClient(data)
                    .then((response) => {
                        setLoading(false);
                        onNotification("success", {
                            message: "Sucesso",
                            description: "Salvo com sucesso",
                        });
                        navigate("/cliente-comprador");
                    })
                    .catch((error) => {

                        setLoading(false);
                        onNotification("error", {
                            message: "Erro",
                            description: "Falha ao salvar.",
                        });
                    });
            } catch (error) {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Falha ao salvar.",
                });

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchClient = () => {
        setLoading(true);
        try {
            ClientService.getClient(params.id).then((response) => {
                setLoading(false);
                form.setFieldsValue({
                    name: response.data.name,
                    cpf: response.data.document,
                    phone: response.data.phone,
                    mail: response.data.email,
                    emailSecondary: response.data.emailSecondary,
                    nameSecondary: response.data.nameSecondary,
                    phoneSecondary: response.data.phoneSecondary,
                    job: response.data.job,
                    link: response.data.linkDrive,
                    address: response.data.address,
                    maritalStatus: {
                        value: response.data.maritalStatus,
                    },
                    birthday: moment(response.data.birthday),
                });
            });
        } catch (error) {

            onNotification("error", {
                message: "Erro",
                description: "Erro ao carregar",
            });
            setLoading(false);
        }
    };

    const dateFormat = "DD/MM/YYYY";

    useEffect(() => {
        if (params.id) {
            fetchClient();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                {params.id ? " Atualizar Cliente" : "Cadastro de Cliente"}
            </Title>
            <Form
                layout="vertical"
                validateMessages={validateMessages}
                onFinish={onSubmit}
                form={form}
            >
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem colon={false} label="Nome" name="name" rules={required}>
                            <Input placeholder="Digite o nome completo"/>
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem
                            colon={false}
                            label="CPF"
                            name="cpf"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor digite o CPF",
                                },
                                () => ({
                                    validator(_, value) {
                                        if (cpf.isValid(value)) {
                                            return Promise.resolve();
                                        }
                                        if (value.length < 11) {
                                            return Promise.reject(
                                                new TypeError("CPF deve conter 11 dígitos")
                                            );
                                        }
                                        if (!cpf.isValid(value)) {
                                            return Promise.reject(new TypeError("CPF inválido"));
                                        }
                                    },
                                }),
                            ]}
                        >
                            <MaskedInput
                                placeholder="CPF"
                                allowClear
                                mask={"000.000.000-00"}
                            />
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Profissão"
                            name="job"
                            rules={required}
                        >
                            <Input placeholder="Digite a sua profissão"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Endereço"
                            name="address"
                            rules={required}
                        >
                            <Input placeholder="Digite o seu endereço"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Estado Civil"
                            name="maritalStatus"
                            rules={required}
                        >
                            <Select allowClear placeholder="Estado Civil">
                                <Option value="MARRIED">CASADO(A)</Option>
                                <Option value="SINGLE">SOLTEIRO(A)</Option>
                                <Option value="DIVORCED">DIVORCIADO(A)</Option>
                                <Option value="WIDOWER">VIUVO(A)</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Data de Nascimento"
                            name="birthday"
                            rules={required}
                        >
                            <DatePickerT format={dateFormat} placeholder="Selecione a data"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col span={12}>
                        <FormItem colon={false} label="Link para o Drive" name="link">
                            <Input placeholder="Link para drive de documentos"/>
                        </FormItem>
                    </Col>
                </Row>
                <Divider/>
                <Row {...rowProps}>
                    <Title level={3} {...primaryText}>
                        Contatos
                    </Title>
                </Row>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Telefone"
                            name="phone"
                            rules={required}
                        >
                            <MaskedInput placeholder="Telefone" mask={"(00)00000-0000"}/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="E-mail"
                            name="mail"
                            rules={[{required: true}, {type: "email"}]}
                        >
                            <Input type="email" placeholder="E-mail"/>
                        </FormItem>
                    </Col>
                </Row>
                <Title level={4} {...primaryText}>
                    Outros Contatos
                </Title>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Nome para Contato"
                            name="nameSecondary"
                        >
                            <Input placeholder="Contato"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="E-mail Secundário"
                            name="emailSecondary"
                        >
                            <Input placeholder="E-mail"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Telefone Secundário"
                            name="phoneSecondary"
                        >
                            <MaskedInput placeholder="Telefone" mask={"(00)00000-0000"}/>
                        </FormItem>
                    </Col>
                </Row>

                <Row {...rowProps}>
                    <FormItem label="">
                        <Button type="primary" {...buttonProps} htmlType="submit">
                            Salvar
                        </Button>
                    </FormItem>
                </Row>
            </Form>
        </Spin>
    );
};
export default ClientForm;
