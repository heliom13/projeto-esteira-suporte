import React, {useEffect, useMemo, useState} from "react";
import {Col, Row, Spin, Table, Tag, Typography, Tabs, Card} from "antd";
import moment from "moment";
import "moment/locale/pt-br";
import {ProcessService} from "../../services/process";
import {primaryText} from "../../styles/stylesProps";

const {Title} = Typography;
const {TabPane} = Tabs;

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
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

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

    const getFilteredProcesses = () => {
        if (!statusFilter) return regularizacaoProcesses;
        if (statusFilter === 'total') return regularizacaoProcesses;
        if (statusFilter === 'ativos') return regularizacaoProcesses.filter(p => p.status === 'ACTIVE');
        if (statusFilter === 'concluidos') return regularizacaoProcesses.filter(p => p.status === 'SOLD');
        if (statusFilter === 'atrasados') return regularizacaoProcesses.filter(p => {
            const deadline = p.stepCurrent?.deadline;
            return p.status === 'ACTIVE' && deadline != null && moment().diff(moment(p.createdAt), 'days') > deadline;
        });
        return regularizacaoProcesses;
    };

    const resumoTableData = getFilteredProcesses().map(p => ({
        key: p.id,
        id: p.id,
        cliente: p.client?.name,
        fluxo: p.stepCurrent?.flow,
        etapa: p.stepCurrent?.step?.description,
        dias: moment(p.createdAt).fromNow(),
        prazo: p.stepCurrent?.deadline,
        status: p.status,
    }));

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                📋 Board — Regularização
            </Title>

            <Tabs defaultActiveKey="1">
                <TabPane tab="📊 Resumo" key="1">
                    <Row gutter={12} style={{marginBottom: 20}}>
                        <Col xs={12} sm={8} md={6}>
                            <Card
                                style={{
                                    textAlign: "center",
                                    borderTop: "3px solid #4762EA",
                                    cursor: "pointer",
                                    background: statusFilter === "total" ? "#f0fdf4" : "#fff",
                                    border: statusFilter === "total" ? "2px solid #4762EA" : "1px solid #f0f0f0",
                                    transition: "all 0.3s"
                                }}
                                onClick={() => setStatusFilter(statusFilter === "total" ? null : "total")}
                            >
                                <div style={{fontSize: 28, fontWeight: 700, color: "#4762EA"}}>{stats.total}</div>
                                <div style={{fontSize: 12, color: "#888", marginTop: 4}}>Total de Processos</div>
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={6}>
                            <Card
                                style={{
                                    textAlign: "center",
                                    borderTop: "3px solid #fa8c16",
                                    cursor: "pointer",
                                    background: statusFilter === "ativos" ? "#fffbf0" : "#fff",
                                    border: statusFilter === "ativos" ? "2px solid #fa8c16" : "1px solid #f0f0f0",
                                    transition: "all 0.3s"
                                }}
                                onClick={() => setStatusFilter(statusFilter === "ativos" ? null : "ativos")}
                            >
                                <div style={{fontSize: 28, fontWeight: 700, color: "#fa8c16"}}>{stats.ativos}</div>
                                <div style={{fontSize: 12, color: "#888", marginTop: 4}}>Em Andamento</div>
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={6}>
                            <Card
                                style={{
                                    textAlign: "center",
                                    borderTop: "3px solid #52c41a",
                                    cursor: "pointer",
                                    background: statusFilter === "concluidos" ? "#f6ffed" : "#fff",
                                    border: statusFilter === "concluidos" ? "2px solid #52c41a" : "1px solid #f0f0f0",
                                    transition: "all 0.3s"
                                }}
                                onClick={() => setStatusFilter(statusFilter === "concluidos" ? null : "concluidos")}
                            >
                                <div style={{fontSize: 28, fontWeight: 700, color: "#52c41a"}}>{stats.concluidos}</div>
                                <div style={{fontSize: 12, color: "#888", marginTop: 4}}>Concluídos</div>
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={6}>
                            <Card
                                style={{
                                    textAlign: "center",
                                    borderTop: "3px solid #ff4d4f",
                                    cursor: "pointer",
                                    background: statusFilter === "atrasados" ? "#fef2f2" : "#fff",
                                    border: statusFilter === "atrasados" ? "2px solid #ff4d4f" : "1px solid #f0f0f0",
                                    transition: "all 0.3s"
                                }}
                                onClick={() => setStatusFilter(statusFilter === "atrasados" ? null : "atrasados")}
                            >
                                <div style={{fontSize: 28, fontWeight: 700, color: "#ff4d4f"}}>{stats.atrasados}</div>
                                <div style={{fontSize: 12, color: "#888", marginTop: 4}}>Atrasados</div>
                            </Card>
                        </Col>
                    </Row>

                    <Card>
                        <Title level={4}>Todos os Processos</Title>
                        <Table
                            size="small"
                            rowKey="id"
                            dataSource={resumoTableData}
                            pagination={{pageSize: 20}}
                            columns={[
                                {title: "ID", dataIndex: "id", width: 60},
                                {title: "Cliente", dataIndex: "cliente"},
                                {title: "Fluxo", dataIndex: "fluxo", width: 100},
                                {title: "Etapa", dataIndex: "etapa", width: 120},
                                {title: "Dias no processo", dataIndex: "dias"},
                                {title: "Prazo", dataIndex: "prazo", width: 70, render: (prazo: number) => `${prazo}d`},
                                {
                                    title: "Status",
                                    dataIndex: "status",
                                    width: 80,
                                    render: (status: string) => statusTag(status),
                                },
                            ]}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="📋 Detalhado" key="2">
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
                </TabPane>
            </Tabs>
        </Spin>
    );
};

export default RegularizacaoBoard;
