import {Button, Col, Form, Input, Row, Select, Spin, Typography} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {buttonProps} from "../../components/button";
import onNotification from "../../components/notification/notification";
import {ClientService} from "../../services/client";
import {FlowService} from "../../services/flow";
import {PropertyService} from "../../services/property";
import {ProcessService} from "../../services/process";
import {SellerService} from "../../services/seller";
import {primaryText} from "../../styles/stylesProps";
import {rowProps} from "../../utils/FormUtils";
import {required, validateMessages} from "../../utils/ValidatorFields";

const {Title} = Typography;
const FormItem = Form.Item;
const {Option} = Select;

interface Flow {
    id: number;
    description: string
    hasClient: boolean;
    hasProperty: boolean;
    hasSellerMain: boolean;
    hasSellerSecondary: boolean;
}

const PropertySellForm = () => {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [properties, setProperties] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [flows, setFlows] = useState<Flow[]>([]);
    const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
    const navigate = useNavigate();

    const handleFlowSelect = (selectedOption) => {
        const selectedFlow = flows.find(flow => flow.id === selectedOption.value) || null;
        setSelectedFlow(selectedFlow);
    };

    const onSubmit = useCallback(
        async (data) => {
            setLoading(true);
            try {
                ProcessService.createProcess(data)
                    .then((response) => {
                        setLoading(false);
                        onNotification("success", {
                            message: "Sucesso",
                            description: "Salvo com sucesso",
                        });
                        navigate("/processos");
                    })
                    .catch((error) => {

                        setLoading(false);
                        onNotification("error", {
                            message: "Erro",
                            description:
                                "Ocorreu um erro interno inesperado no sistema. Tente novamente",
                        });
                    });
            } catch (error) {

                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Erro ao salvar",
                });
            }
        },
        [navigate]
    );

    const optionClients = clients.map((client: { id: number; name: string }) => (
        <Option key={client.id} value={client.id}>
            {client.name}
        </Option>
    ));
    const optionProperties = properties.map(
        (property: { id: number; description: string }) => (
            <Option key={property.id} value={property.id}>
                {property.description}
            </Option>
        )
    );
    const optionSellers = sellers.map((seller: { id: number; name: string }) => (
        <Option key={seller.id} value={seller.id}>
            {seller.name}
        </Option>
    ));

    const optionFlows = flows.map((flow) => (
        <Option key={flow.id} value={flow.id}>
            {flow.description}
        </Option>
    ));

    const fetchData = useCallback(() => {
        try {
            ClientService.getClients().then((response) => setClients(response.data));
            PropertyService.getProperties().then((response) =>
                setProperties(response.data)
            );
            SellerService.getSellers().then((response) => {
                setSellers(response.data);
            });
            FlowService.getFlows().then((response) => setFlows(response.data));
        } catch (error) {

            setLoading(false);
        }
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchData(), []);

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Cadastro de Processo
            </Title>
            <Form
                layout="vertical"
                validateMessages={validateMessages}
                onFinish={onSubmit}
            >
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Cliente"
                            name="client"
                            rules={required}
                        >
                            <Select
                                placeholder="Escolha"
                                showSearch
                                labelInValue
                                allowClear
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                            >
                                {optionClients}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Imovél"
                            name="property"
                            rules={required}
                        >
                            <Select
                                placeholder="Escolha"
                                labelInValue
                                showSearch
                                allowClear
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                            >
                                {optionProperties}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem colon={false} label="Fluxo" name="flow" rules={required}>
                            <Select
                                placeholder="Escolha"
                                labelInValue
                                allowClear
                                showSearch
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                            >
                                {optionFlows}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem colon={false} label="Corretor/Imobiliária" name="seller">
                            <Select
                                placeholder="Escolha"
                                labelInValue
                                showSearch
                                allowClear
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                            >
                                {optionSellers}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem
                            colon={false}
                            label="Corretor/Imobiliária Secundário"
                            name="sellerSecondary"
                        >
                            <Select
                                placeholder="Escolha"
                                labelInValue
                                showSearch
                                allowClear
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                            >
                                {optionSellers}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col xs={12} sm={10} md={8}>
                        <FormItem colon={false} label="Tipo do Imóvel" name="imovelType">
                            <Select
                                placeholder="Escolha"
                                labelInValue
                                showSearch
                                allowClear
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                            >
                                <Option value="Financiado">Financiado</Option>{" "}
                                <Option value="A vista">À vista</Option>{" "}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Col span={12}>
                        <FormItem colon={false} label="Link para Drive" name="linkDrive">
                            <Input placeholder="Link para Drive de Documentos"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row {...rowProps}>
                    <Button type="primary" {...buttonProps} htmlType="submit">
                        Salvar
                    </Button>
                </Row>
            </Form>
        </Spin>
    );
};

export default PropertySellForm;
