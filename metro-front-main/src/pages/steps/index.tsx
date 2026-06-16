import {Button, Col, Input, Popconfirm, Row, Space, Spin, Table, Typography,} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined,} from "@ant-design/icons";
import {marginTop, primaryText} from "../../styles/stylesProps";
import {useCallback, useEffect, useState} from "react";
import Form, {useForm} from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import {rowProps} from "../../utils/FormUtils";
import {buttonRadius} from "../../components/button";
import {useNavigate} from "react-router-dom";
import {StepService} from "../../services/step";
import onNotification from "../../components/notification/notification";

const {Title} = Typography;

type StepProps = {
    id: number;
    description: string;
    deadline: string;
    requiredDocument: boolean;
};

const Steps = () => {
    const [steps, setSteps] = useState<StepProps[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = useForm();

    const fetchData = () => {
        setLoading(true);
        StepService.getSteps()
            .then((response) => {
                setLoading(false);
                setSteps(response.data);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Erro ao buscar",
                });

            });
    };

    const onDelete = async (id: number) => {
        try {
            setLoading(true);
            StepService.deleteStep(id)
                .then((response) => {
                    onNotification("success", {
                        message: "Sucesso",
                        description: "Removido com sucesso",
                    });
                    setLoading(false);
                })
                .catch((error) => {

                    onNotification("error", {
                        message: "Erro",
                        description: "Erro ao remover",
                    });
                    setLoading(false);
                });
        } catch (error) {

        }
    };

    const onSubmit = useCallback(async (client: string) => {
        setLoading(true);
        StepService.getStepByDescription(client)
            .then((response) => {
                setSteps(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Não encontrado.",
                });
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: "Descrição",
            render: (r: StepProps) => <span> {r.description} </span>,
            sorter: (a: any, b: any) => a.description.localeCompare(b.description),
        },
        {
            title: "Exige Documentação",
            render: (r: StepProps) => (
                <span> {r.requiredDocument ? "Sim" : "Não"} </span>
            ),
        },
        {
            title: "Prazo",
            render: (r: StepProps) => <span> {r.deadline} dias </span>,
        },
        {
            title: "Opções",
            render: (r: StepProps) => (
                <Space size="middle">
                    <EditOutlined
                        style={{color: "#FF8C00"}}
                        onClick={() => navigate(`atualizar/${r.id}`)}
                    />
                    <Popconfirm
                        title="Deseja deletar esse passo?"
                        onConfirm={() => {
                            onDelete(r.id);
                            setSteps(steps.filter((item) => item.id !== r.id));
                        }}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <DeleteOutlined style={{color: "#B22222"}}/>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Passos
            </Title>
            <Form layout="vertical" onFinish={onSubmit} form={form}>
                <Row {...rowProps}>
                    <Col span={18}>
                        <FormItem colon={false} label="Descrição" name="description">
                            <Input/>
                        </FormItem>
                    </Col>
                </Row>
                <Space>
                    <Button
                        type="primary"
                        icon={<SearchOutlined/>}
                        {...buttonRadius}
                        htmlType="submit"
                    >
                        Pesquisar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => navigate("cadastrar")}
                        {...buttonRadius}
                    >
                        Cadastrar
                    </Button>
                </Space>
            </Form>
            <Table
                columns={columns}
                dataSource={steps}
                {...marginTop}
                rowKey={(r: StepProps) => r.id}
            />
        </Spin>
    );
};

export default Steps;
