import {Col, Divider, Row, Spin, Typography} from "antd";
import {useEffect, useState} from "react";
import onNotification from "../../components/notification/notification";
import {FlowService} from "../../services/flow";
import {primaryText} from "../../styles/stylesProps";
import {rowProps} from "../../utils/FormUtils";

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
    deadline: number;
    requiredDocument: boolean;
    status: string;
};

type TypeFlow = {
    id: number;
    description: string;
}

type StepProps = {
    id: number;
    description: string;
    deadline: number;
    requiredDocument: boolean;
    status: string;
    order: number;
};

const Flow = (id: any) => {
    const [flow, setFlow] = useState<FlowProps>();
    const [steps, setSteps] = useState<StepProps[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchStep = () => {
        setLoading(true);
        try {
            FlowService.getFlow(id.id).then((response) => {
                setLoading(false);
                setFlow(response.data);
                setSteps(response.data.steps);
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
        fetchStep();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <Spin tip="Carregando..." spinning={loading}>
            <Title level={3} {...primaryText}>

                Passo - {flow?.description}
            </Title>

            <Row {...rowProps}>
                <Col xs={12} sm={10} md={8}>
                    <Text strong> Descrição: </Text>
                    <Text>{flow?.description} </Text>
                </Col>
            </Row>
            <Divider/>
            <Row {...rowProps}>
                <Title level={4} {...primaryText}>

                    Passos
                </Title>
            </Row>
            <>
                {steps.map((step) => (
                    <Row {...rowProps} key={step.id}>
                        <Col xs={12} sm={10} md={8} lg={6}>
                            <Text strong> Ordem: </Text>
                            <Text>{step?.order} </Text>
                        </Col>
                        <Col xs={12} sm={10} md={8} lg={6}>
                            <Text strong> Descrição: </Text>
                            <Text>{step?.description} </Text>
                        </Col>
                        <Col xs={12} sm={10} md={8} lg={6}>
                            <Text strong> Prazo: </Text>
                            <Text>{step?.deadline} dias </Text>
                        </Col>
                        <Col xs={12} sm={10} md={8} lg={6}>
                            <Text strong> Requer Documentos: </Text>
                            <Text>{step?.requiredDocument ? "SIM" : "NÃO"} </Text>
                        </Col>
                        <Divider/>
                    </Row>
                ))}
            </>
        </Spin>
    );
};
export default Flow;
