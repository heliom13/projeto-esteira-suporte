import {Button, Checkbox, Col, Input, Modal, Row, Space, Spin, Table, Typography,} from "antd";
import {EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined,} from "@ant-design/icons";
import {marginTop, primaryText} from "../../styles/stylesProps";
import {useCallback, useEffect, useState} from "react";
import Form, {useForm} from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import {rowProps} from "../../utils/FormUtils";
import {buttonRadius} from "../../components/button";
import {useNavigate} from "react-router-dom";
import {FlowService} from "../../services/flow";
import onNotification from "../../components/notification/notification";
import Flow from "./view";

const {Text, Title} = Typography;

type FlowProps = {
    id: number;
    description: string;
    type: TypeFlow;

    hasClient: boolean;
    hasProperty: boolean;
    hasSellerMain: boolean;
    hasSellerSecondary: boolean;
    sendMessage: boolean;
    status: string;
};

type TypeFlow = {
    id: number;
    description: string;
}

const Flows = () => {
    const navigate = useNavigate();
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModalView, setOpenModalView] = useState(false);
    const [idFlow, setIdFlow] = useState(0);
    const [form] = useForm()

    const columns = [
        {
            title: "Descrição",
            render: (r: FlowProps) => <Text> {r.description} </Text>,
            sorter: (a: any, b: any) => a.description.localeCompare(b.description),
        },
        {
            title: "Tipo de Fluxo",
            render: (r: FlowProps) => <Text> {r.type.description} </Text>,
            sorter: (a: any, b: any) => a.type.description.localeCompare(b.type.description),
        },
        {
            title: "Envia Mensagem",
            render: (r: FlowProps) => <Checkbox checked={r.sendMessage}/>,
            sorter: (a: FlowProps, b: FlowProps) => Number(b.sendMessage) - Number(a.sendMessage),
        },
        {
            title: "Status",
            render: (r: FlowProps) =>
                r.status === "ACTIVE" ? (
                    <Text strong> ATIVO </Text>
                ) : (
                    <Text type="danger"> INATIVO</Text>
                ),
            sorter: (a: any, b: any) => a.status.localeCompare(b.status),
        },
        {
            title: "Ação",
            render: (r: FlowProps) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{color: "#4169E1"}}
                        onClick={() => {
                            setIdFlow(r.id);
                            setOpenModalView(true);
                        }}
                    />
                    <EditOutlined
                        style={{color: "#FF8C00"}}
                        onClick={() => navigate(`atualizar/${r.id}`)}
                    />
                </Space>
            ),
        },
    ];

    const fetchFlows = () => {
        setLoading(true);
        FlowService.getFlows()
            .then((response) => {
                setLoading(false);
                setFlows(response.data);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Erro ao carregar os dados",
                });
            });
    };

    const onSubmit = useCallback(async (client: string) => {
        setLoading(true);
        FlowService.getFlowByDescription(client)
            .then((response) => {
                setFlows(response.data);
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
        fetchFlows();
    }, []);

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Fluxos
            </Title>
            <Form layout="vertical" onFinish={onSubmit} form={form}>
                <Row {...rowProps}>
                    <Col span={12}>
                        <FormItem colon={false} label="Descrição" name="description">
                            <Input/>
                        </FormItem>
                    </Col>
                </Row>
                <Space>
                    <Button type="primary" icon={<SearchOutlined/>} {...buttonRadius} htmlType="submit">
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
                dataSource={flows}
                {...marginTop}
                rowKey={(r: FlowProps) => r.id}
            />

            <Modal
                visible={openModalView}
                onCancel={() => setOpenModalView(false)}
                footer={[
                    <Button
                        key="back"
                        type="primary"
                        onClick={() => setOpenModalView(false)}
                    >
                        Ok
                    </Button>,
                ]}
                width={1000}
            >
                <Flow id={idFlow}/>
            </Modal>
        </Spin>
    );
};

export default Flows;
