/* eslint-disable react-hooks/exhaustive-deps */
import {Button, Col, Form, Input, Row, Select, Spin, Table, Typography,} from "antd";
import {useCallback, useEffect, useState} from "react";
import {buttonProps} from "../../components/button";
import {rowProps} from "../../utils/FormUtils";
import {CheckOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {StepService} from "../../services/step";
import onNotification from "../../components/notification/notification";
import {useNavigate, useParams} from "react-router-dom";
import {largeMarginTop, primaryText} from "../../styles/stylesProps";
import {DocumentsService} from "../../services/documents";

const FormItem = Form.Item;
const {Option} = Select;
const {Title} = Typography;

type StepsProps = {
    label: string;
};

const StepForm = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [requiredDocs, setRequiredDocs] = useState(false);
    const [documents, setDocuments] = useState<StepsProps[]>([]);
    const [documentTypes, setDocumentTypes] = useState([]);

    const optionsSteps = documentTypes.map(
        (step: { id: number; description: string }) => (
            <Option key={step.id} value={step.id}>
                {step.description.toUpperCase()}
            </Option>
        )
    );

    const fetchDocuments = () => {
        try {
            DocumentsService.typesDocuments()
                .then((response) => setDocumentTypes(response.data))
                .catch((error) => {
                    onNotification("error", {
                        message: "Erro",
                        description:
                            "Erro ao buscar documentos, tente novamente em alguns instantes",
                    });
                });
        } catch (error) {
            onNotification("error", {
                message: "Erro",
                description:
                    "Erro ao buscar documentos, tente novamente em alguns instantes",
            });
        }
    };

    useEffect(() => {
        fetchDocuments()
    }, [])

    const handleSubmit = useCallback(
        async (data) => {
            if (id) {
                setLoading(true);
                try {
                    await StepService.updateStep(data, documents, id)
                        .then((response) => {
                            onNotification("success", {
                                message: "Sucesso",
                                description: "Atualizado com sucesso",
                            });
                            navigate("/passos");
                        })
                        .catch((error) => {
                            onNotification("error", {
                                message: "Erro",
                                description:
                                    "Erro ao atualizar, tente novamente em alguns instantes",
                            });
                            setLoading(false);
                        });
                } catch (error) {

                    onNotification("error", {
                        message: "Erro",
                        description: "Erro ao salvar",
                    });
                    setLoading(false);
                }
            } else {
                setLoading(true);
                try {
                    await StepService.createStep(data, documents)
                        .then(() => {
                            onNotification("success", {
                                message: "Sucesso",
                                description: "Salvo com sucesso",
                            });
                            navigate("/passos");
                        })
                        .catch((error) => {
                            onNotification("error", {
                                message: "Erro",
                                description:
                                    "Erro ao salvar, tente novamente em alguns instantes",
                            });
                            setLoading(false);
                        });
                } catch (error) {

                    onNotification("error", {
                        message: "Erro",
                        description: "Erro ao salvar",
                    });
                    setLoading(false);
                }
            }
        },
        [documents, navigate]
    );

    const handleChange = (value: boolean) => {
        setRequiredDocs(value);
    };

    const fetchStep = () => {
        try {
            StepService.getStep(id).then((response) => {
                form.setFieldsValue({
                    description: response.data.description,
                    deadline: response.data.deadline,
                    requiredDocument: response.data.requiredDocument,
                });
                setDocuments(response.data.documents)
                setRequiredDocs(response.data.requiredDocument);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddDocument = useCallback(async () => {
        let value = form.getFieldValue("docs");
        setDocuments((documents) => [...documents, value]);
    }, [form]);

    const documentsTable = [
        {
            title: "Descrição",
            render: (r: any) => <span>{r.label ? r.label : r}</span>,
        },
        {
            title: "",
            render: (r: StepsProps) => (
                <DeleteOutlined
                    onClick={() => {
                        setDocuments(documents.filter((item) => item.label !== r.label));
                    }}
                />
            ),
        },
    ];

    useEffect(() => {
        if (id) {
            fetchStep();
        }
    }, []);

    return (
        <Spin spinning={loading} tip="Carregando...">
            {id ? (
                <Title level={3} {...primaryText}>
                    Atualizar Passo
                </Title>
            ) : (
                <Title {...primaryText} level={3}>
                    Cadastro de Passos
                </Title>
            )}
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                id="submitStep"
                form={form}
            >
                <Row {...rowProps}>
                    <Col md={10}>
                        <FormItem colon={false} label="Descrição" name="description">
                            <Input placeholder="Descrição"/>
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem colon={false} label="Prazo em Dias" name="deadline">
                            <Input placeholder="Prazo" type={"number"} min={1}/>
                        </FormItem>
                    </Col>
                    <Col md={5}>
                        <FormItem
                            colon={false}
                            label="Exige Documentação do Cliente"
                            name="requiredDocument"
                        >
                            <Select placeholder="Escolha" onChange={handleChange}>
                                <Option value={true}>Sim</Option>
                                <Option value={false}>Não</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                {requiredDocs && (
                    <>
                        <Row {...rowProps}>
                            <Col span={8}>
                                <FormItem colon={false} label="Documentos" name="docs">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {optionsSteps}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<PlusOutlined/>}
                                {...largeMarginTop}
                                onClick={() => handleAddDocument()}
                            />
                        </Row>
                        <Table columns={documentsTable} dataSource={documents}/>
                    </>
                )}
            </Form>

            <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined/>}
                {...buttonProps}
                form="submitStep"
                onClick={() => handleSubmit}
            >
                Salvar
            </Button>
        </Spin>
    );
};

export default StepForm;
