import {Button, Col, Form, Input, Row, Spin, Typography} from "antd";
import {useCallback, useEffect, useState} from "react";
import {buttonProps} from "../../components/button";
import {rowProps} from "../../utils/FormUtils";
import {CheckOutlined} from "@ant-design/icons";
import onNotification from "../../components/notification/notification";
import {primaryText} from "../../styles/stylesProps";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "antd/lib/form/Form";
import {DocumentsService} from "../../services/documents";

const FormItem = Form.Item;
const {Title} = Typography;

const DocumentsForm = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [form] = useForm();
    const navigate = useNavigate();

    const fetchDocument = () => {
        setLoading(true);
        try {
            DocumentsService.typeDocument(id).then((response) => {
                setLoading(false);
                form.setFieldsValue({
                    description: response.data.description,
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
        if (id) {
            fetchDocument();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = useCallback(
        async (data) => {
            if (id) {
                try {
                    setLoading(true);
                    DocumentsService.updateDocument(data, id)
                        .then((response) => {
                            onNotification("success", {
                                message: "Sucesso",
                                description: "Atualizado com sucesso!",
                            });
                            setLoading(false);
                            navigate("/documentos");
                        })
                        .catch((error) => {
                            onNotification("error", {
                                message: "Erro",
                                description: "Erro ao atualizar!",
                            });
                            setLoading(false);
                        });
                } catch (error) {

                }
            } else {
                try {
                    setLoading(true);
                    DocumentsService.newDocument(data)
                        .then((response) => {
                            onNotification("success", {
                                message: "Sucesso",
                                description: "Salvo com sucesso!",
                            });
                            setLoading(false);
                            navigate("/documentos");
                        })
                        .catch((error) => {

                            onNotification("error", {
                                message: "Erro",
                                description: "Erro ao salvar!",
                            });
                            setLoading(false);
                        });
                } catch (error) {

                }
            }
        },
        [id, navigate]
    );

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                {id ? " Atualizar Documento" : "Cadastro de Documento"}
            </Title>
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
                <Row {...rowProps}>
                    <Col md={10}>
                        <FormItem colon={false} label="Descrição" name="description">
                            <Input placeholder="Descrição"/>
                        </FormItem>
                    </Col>
                </Row>
                <Button
                    type="primary"
                    icon={<CheckOutlined/>}
                    {...buttonProps}
                    htmlType="submit"
                >
                    Salvar
                </Button>
            </Form>
        </Spin>
    );
};
export default DocumentsForm;
