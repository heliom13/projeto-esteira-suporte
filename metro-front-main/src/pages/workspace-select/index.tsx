import React from "react";
import {Card, Col, Row, Typography} from "antd";
import {BankOutlined, FileProtectOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useWorkspace, Workspace} from "../../contexts/WorkspaceContext";

const {Title, Text} = Typography;

const OPTIONS: {
    key: Workspace;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}[] = [
    {
        key: "financiamento",
        title: "Financiamento",
        description: "Clientes, imóveis, propostas e processos de financiamento imobiliário",
        icon: <BankOutlined style={{fontSize: 40}}/>,
        color: "#4096ff",
    },
    {
        key: "regularizacao",
        title: "Regularização",
        description: "Clientes e processos de regularização de imóveis",
        icon: <FileProtectOutlined style={{fontSize: 40}}/>,
        color: "#52c41a",
    },
];

const WorkspaceSelect: React.FC = () => {
    const navigate = useNavigate();
    const {setWorkspace} = useWorkspace();

    const handleSelect = (workspace: Workspace) => {
        setWorkspace(workspace);
        navigate(workspace === "regularizacao" ? "/regularizacao" : "/");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#f0f2f5",
                padding: 24,
            }}
        >
            <Title level={3} style={{marginBottom: 4}}>
                Suporte Imobiliário
            </Title>
            <Text type="secondary" style={{marginBottom: 32}}>
                Escolha em qual área você quer entrar
            </Text>

            <Row gutter={24} justify="center">
                {OPTIONS.map((option) => (
                    <Col key={option.key}>
                        <Card
                            hoverable
                            onClick={() => handleSelect(option.key)}
                            style={{width: 260, textAlign: "center"}}
                            bodyStyle={{padding: 32}}
                        >
                            <div style={{color: option.color, marginBottom: 16}}>
                                {option.icon}
                            </div>
                            <Title level={4} style={{marginBottom: 8}}>
                                {option.title}
                            </Title>
                            <Text type="secondary">{option.description}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default WorkspaceSelect;
