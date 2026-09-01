import React, {useEffect, useMemo, useState} from "react";
import {Col, Row, Spin, Table, Tag, Typography} from "antd";
import moment from "moment";
import "moment/locale/pt-br";
import {ProcessService} from "../../services/process";
import {primaryText} from "../../styles/stylesProps";

const {Title} = Typography;

type ProcessProps = {
    id: number;
    status: string;
    createdAt: any;
    client: {
        id: number;
        name: string;
    };
    stepCurrent: {
        deadline: any;
        flow: string;
        flowType: string;
        step: {
            description: string;
        };
    };
};

const isRegularizacaoFlow = (flowType: string) =>
    (flowType || "").toLowerCase().includes("regulariz");

const statusTag = (status: string) => {
    if (status === "ACTIVE") return <Tag color="orange">Em Andamento</Tag>;
    if (status === "SOLD") return <Tag color="green">Concluído</Tag>;
    return <Tag>{status}</Tag>;
};

const StatCard: React.FC<{label: string; value: number; color: string}> = ({label, value, color}) => (
    <div
        style={{
            flex: 1,
            background: "#fff",
            borderRadius: 8,
            padding: "16px 20px",
            border: "1px solid #f0f0f0",
            borderTop: `3px solid ${color}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
    >
        <div style={{fontSize: 12, color: "#888", marginBottom: 4}}>{label}</div>
        <div style={{fontSize: 22, fontWeight: 700, color: "#222"}}>{value}</div>
    </div>
);

const RegularizacaoBoard: React.FC = () => {
    moment.locale("pt-br");
    const [loading, setLoading] = useState(false);
    const [processData, setProcessData] = useState<ProcessProps[]>([]);

    useEffect(() => {
        setLoading(true);
        ProcessService.getProcess()
            .then((response) => setProcessData(response.data))
            .finally(() => setLoading(false));
    }, []);

    const regularizacaoProcesses = useMemo(
        () => processData.filter((p) => isRegularizacaoFlow(p.stepCurrent?.flowType)),
        [processData]
    );

    const stats = useMemo(() => {
        const total = regularizacaoProcesses.length;
        const ativos = regularizacaoProcesses.filter((p) => p.status === "ACTIVE").length;
        const concluidos = regularizacaoProcesses.filter((p) => p.status === "SOLD").length;
        const atrasados = regularizacaoProcesses.filter((p) => {
            const deadline = p.stepCurrent?.deadline;
            return p.status === "ACTIVE" && deadline != null && moment().diff(moment(p.createdAt), "days") > deadline;
        }).length;
        return {total, ativos, concluidos, atrasados};
    }, [regularizacaoProcesses]);

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                📋 Board — Regularização
            </Title>

            <Row gutter={12} style={{marginBottom: 20}}>
                <Col flex={1}><StatCard label="Total de Processos" value={stats.total} color="#4762EA"/></Col>
                <Col flex={1}><StatCard label="Em Andamento" value={stats.ativos} color="#fa8c16"/></Col>
                <Col flex={1}><StatCard label="Concluídos" value={stats.concluidos} color="#52c41a"/></Col>
                <Col flex={1}><StatCard label="Atrasados" value={stats.atrasados} color="#ff4d4f"/></Col>
            </Row>

            <Table
                rowKey="id"
                dataSource={regularizacaoProcesses}
                columns={[
                    {title: "ID", dataIndex: "id", width: 70},
                    {title: "Cliente", render: (r: ProcessProps) => r.client?.name},
                    {title: "Fluxo", render: (r: ProcessProps) => r.stepCurrent?.flow},
                    {title: "Etapa", render: (r: ProcessProps) => r.stepCurrent?.step?.description},
                    {title: "Dias no processo", render: (r: ProcessProps) => moment(r.createdAt).fromNow()},
                    {title: "Prazo", render: (r: ProcessProps) => `${r.stepCurrent?.deadline ?? "-"} dias`},
                    {title: "Status", render: (r: ProcessProps) => statusTag(r.status)},
                ]}
            />
        </Spin>
    );
};

export default RegularizacaoBoard;
