import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Divider, Form, Input, InputNumber, Radio, Row, Select, Spin, Typography,} from "antd";
import {cnpj, cpf} from "cpf-cnpj-validator";
import {buttonProps} from "../../components/button";
import {rowProps} from "../../utils/FormUtils";
import {required, validateMessages,} from "../../utils/ValidatorFields";
import {MaskedInput} from "antd-mask-input";
import onNotification from "../../components/notification/notification";
import {useNavigate, useParams} from "react-router-dom";
import {primaryText} from "../../styles/stylesProps";
import {useForm} from "antd/lib/form/Form";
import {PropertyService} from "../../services/property";

const {Option} = Select;
const FormItem = Form.Item;
const {Title} = Typography;

const PropertyForm = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const [form] = useForm();
    const [isCpf, setIsCpf] = useState(true);
    const [isCnpj, setIsCnpj] = useState(false);

    const onSubmit = useCallback(
        async (data: any) => {
            if (params.id) {
                try {
                    setLoading(true);
                    PropertyService.updateProperty(data, params.id)
                        .then((response) => {
                            setLoading(false);
                            onNotification("success", {
                                message: "Sucesso",
                                description: "Salvo com sucesso",
                            });
                            navigate("/cliente-vendedor");
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
                    PropertyService.createProperty(data)
                        .then((response) => {
                            setLoading(false);
                            onNotification("success", {
                                message: "Sucesso",
                                description: "Salvo com sucesso",
                            });
                            navigate("/cliente-vendedor");
                        })
                        .catch((error) => {
                            setLoading(false);
                            onNotification("error", {
                                message: "Erro",
                                description: error.response,
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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const fetchProperty = () => {
        setLoading(true);
        try {
            PropertyService.getProperty(params.id).then((response) => {
                setLoading(false);
                form.setFieldsValue({
                    ownerName: response.data.ownerName,
                    ownerDocument: response.data.ownerDocument,
                    cpf: response.data.ownerDocument,
                    cnpj: response.data.ownerDocument,
                    description: response.data.description,
                    email: response.data.mail,
                    price: `${(response.data.price).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                    })}`,
                    financialPrice: `${(response.data.financialPrice).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                    })}`,
                    address: response.data.address,
                    bank: response.data.bank,
                    accountNumberBank: response.data.accountNumberBank,
                    accountBank: response.data.accountBank,
                    maritalStatus: {
                        value: response.data.maritalStatus,
                    },
                    phone: response.data.phone,
                    mail: response.data.email,
                    pix: response.data.pix,
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

    useEffect(() => {
        if (params.id) {
            fetchProperty();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                {params.id
                    ? " Atualizar Imóvel"
                    : "Cadastro de Imóvel"}
            </Title>
            <Form
                layout="vertical"
                validateMessages={validateMessages}
                onFinish={onSubmit}
                form={form}
            >
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Nome do Proprietário"
                            name="ownerName"
                            rules={required}
                        >
                            <Input placeholder="Digite o nome completo"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Descrição"
                            name="description"
                            rules={required}
                        >
                            <Input placeholder="Descrição"/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem colon={false} label="CPF ou CNPJ" rules={required}>
                            <Radio.Group name="radiogroup" defaultValue={1}>
                                <Radio
                                    onChange={() => {
                                        setIsCpf(true);
                                        setIsCnpj(false);
                                    }}
                                    value={1}
                                >
                                    CPF
                                </Radio>
                                <Radio
                                    value={2}
                                    onChange={() => {
                                        setIsCnpj(true);
                                        setIsCpf(false);
                                    }}
                                >
                                    CNPJ
                                </Radio>
                            </Radio.Group>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    {isCpf && (
                        <Col span={6}>
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
                    )}
                    {isCnpj && (
                        <Col span={6}>
                            <FormItem
                                colon={false}
                                label="CNPJ"
                                name="cnpj"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor digite o CNPJ",
                                    },
                                    () => ({
                                        validator(_, value) {
                                            if (cnpj.isValid(value)) {
                                                return Promise.resolve();
                                            }
                                            if (!cnpj.isValid(value)) {
                                                return Promise.reject(new TypeError("CNPJ inválido"));
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <MaskedInput
                                    placeholder="CNPJ"
                                    allowClear
                                    mask={"00.000.000/0000-00"}
                                />
                            </FormItem>
                        </Col>
                    )}
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Endereço"
                            name="address"
                            rules={required}
                        >
                            <Input placeholder="Digite o endereço"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem colon={false} label="Estado Civil" name="maritalStatus">
                            <Select allowClear placeholder="Estado Civil"
                            >
                                <Option value="MARRIED">CASADO(A)</Option>
                                <Option value="SINGLE">SOLTEIRO(A)</Option>
                                <Option value="DIVORCED">DIVORCIADO(A)</Option>
                                <Option value="WIDOWER">VIUVO(A)</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Preço do Imóvel"
                            name="price"
                            rules={required}
                        >

                            <InputNumber
                                style={{width: "100%"}}
                                decimalSeparator=","
                                precision={2} formatter={value =>
                                `R$ ${value}`
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            }
                                parser={(value: any) => value.replace(/\R\$|\./g, '')}

                            />
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Preço do Financiamento"
                            name="financialPrice"
                            rules={required}
                        >
                            <InputNumber
                                style={{width: "100%"}}
                                decimalSeparator=","
                                precision={2}
                                formatter={value =>
                                    `R$ ${value}`
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                }
                                parser={(value: any) => value.replace(/\R\$|\./g, '')}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={4}>
                        <FormItem colon={false} label="Banco" name="bank">
                            <Input placeholder="Banco"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={4}>
                        <FormItem colon={false} label="Agência" name="accountBank">
                            <Input placeholder="Agência"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={4}>
                        <FormItem
                            colon={false}
                            label="Número da Conta"
                            name="accountNumberBank"
                        >
                            <Input placeholder="Número da Conta"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="PIX"
                            name="pix"
                        >
                            <Input placeholder="Chave pix"/>
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
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <FormItem
                            colon={false}
                            label="Nome para Contato"
                            name="nameSecondary"
                        >
                            <Input placeholder="Contato"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <FormItem
                            colon={false}
                            label="E-mail Secundário"
                            name="emailSecondary"
                        >
                            <Input placeholder="E-mail"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8} lg={6}>
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
export default PropertyForm;
