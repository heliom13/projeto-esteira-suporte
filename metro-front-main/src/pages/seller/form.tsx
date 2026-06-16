import {Button, Col, Form, Input, Radio, Row, Spin, Typography} from "antd";
import {MaskedInput} from "antd-mask-input";
import {useForm} from "antd/lib/form/Form";
import {cnpj, cpf} from "cpf-cnpj-validator";
import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {buttonProps} from "../../components/button";
import onNotification from "../../components/notification/notification";
import {SellerService} from "../../services/seller";
import {primaryText} from "../../styles/stylesProps";
import {rowProps} from "../../utils/FormUtils";
import {required, validateMessages} from "../../utils/ValidatorFields";

const {Title} = Typography;
const FormItem = Form.Item;
const SellerForm = () => {
    const [loading, setLoading] = useState(false);
    const [isCpf, setIsCpf] = useState(true);
    const [isCnpj, setIsCnpj] = useState(false);
    const [form] = useForm();
    const navigate = useNavigate();
    const {id} = useParams();

    const handleSubmit = useCallback(
        async (data: any) => {
            if (id) {
                setLoading(true);
                try {
                    SellerService.updateSeller(data, id)
                        .then((response) => {
                            setLoading(false);
                            onNotification("success", {
                                message: "Sucesso",
                                description: "Salvo com sucesso",
                            });
                            navigate("/imobiliaria");
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
                    SellerService.createSeller(data)
                        .then((response) => {
                            setLoading(false);
                            onNotification("success", {
                                message: "Sucesso",
                                description: "Salvo com sucesso",
                            });
                            navigate("/imobiliaria");
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
        },
        [id, navigate]
    );

    const fetchSeller = () => {
        setLoading(true);
        try {
            SellerService.getSeller(id).then((response) => {
                setLoading(false);
                const document = response.data.document;
                if (cnpj.isValid(document)) {
                    setIsCnpj(true);
                    setIsCpf(false);
                }
                form.setFieldsValue({
                    name: response.data.name,
                    document: document,
                    description: response.data.description,
                    email: response.data.email,
                    emailSecondary: response.data.emailOther,
                    phone: response.data.phone,
                    otherPhone: response.data.otherPhone,
                    bank: response.data.bank,
                    accountNumberBank: response.data.accountNumberBank,
                    accountBank: response.data.accountBank,
                    creci: response.data.creci,
                    pix: response.data.pix,
                });
            });
        } catch (error) {
            console.log(error);
            onNotification("error", {
                message: "Erro",
                description: "Erro ao carregar",
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        id && fetchSeller();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Spin spinning={loading}>
            <Title level={3} {...primaryText}>
                {id
                    ? "Atualizar Imobiliária/Corretor"
                    : "Cadastro de Imobiliária/Corretor"}
            </Title>
            <Form
                layout="vertical"
                validateMessages={validateMessages}
                form={form}
                onFinish={handleSubmit}
            >
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <FormItem colon={false} label="Nome" name="name" rules={required}>
                            <Input placeholder="Nome"/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem colon={false} label="CPF ou CNPJ" rules={required}>
                            <Radio.Group
                                name="radiogroup"
                                value={isCpf ? 1 : 2}
                                onChange={(e) => {
                                    if (e.target.value === 1) {
                                        setIsCpf(true);
                                        setIsCnpj(false);
                                    } else {
                                        setIsCpf(false);
                                        setIsCnpj(true);
                                    }
                                }}
                            >
                                <Radio value={1}>CPF</Radio>
                                <Radio value={2}>CNPJ</Radio>
                            </Radio.Group>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8} lg={6}>
                        {isCpf && (
                            <FormItem
                                colon={false}
                                label="CPF"
                                name="document"
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
                        )}
                        {isCnpj && (
                            <FormItem
                                colon={false}
                                label="CNPJ"
                                name="document"
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
                        )}
                    </Col>
                    <Col xs={13} sm={11} md={9} lg={6}>
                        <FormItem
                            colon={false}
                            label="E-mail Principal"
                            name="email"
                            rules={[{required: true}, {type: "email"}]}
                        >
                            <Input placeholder="E-mail"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <FormItem
                            colon={false}
                            label="E-mail Secundário"
                            name="emailSecondary"
                            rules={[{required: true}, {type: "email"}]}
                        >
                            <Input placeholder="E-mail"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <FormItem colon={false} label="CRECI" name="creci" rules={required}>
                            <Input placeholder="N° do CRECI" type="number"/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <FormItem
                            colon={false}
                            label="Telefone"
                            name="phone"
                            rules={required}
                        >
                            <MaskedInput placeholder="Telefone" mask={"(00)00000-0000"}/>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <FormItem
                            colon={false}
                            label="Outro Telefone"
                            name="otherPhone"
                        >
                            <MaskedInput placeholder="Telefone" mask={"(00)00000-0000"}/>
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
                    <Col xs={13} sm={11} md={9} lg={7}>
                        <FormItem
                            colon={false}
                            label="Chave PIX"
                            name="pix"
                        >
                            <Input placeholder="Chave PIX"/>
                        </FormItem>
                    </Col>
                </Row>
                <Button type="primary" {...buttonProps} htmlType="submit">
                    Salvar
                </Button>
            </Form>
        </Spin>
    );
};

export default SellerForm;
