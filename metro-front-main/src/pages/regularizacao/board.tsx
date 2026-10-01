import React, {useEffect, useMemo, useState} from "react";
import {Col, Row, Spin, Table, Tag, Typography, Tabs, Card} from "antd";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import "moment/locale/pt-br";
import {ProcessService} from "../../services/process";
import {primaryText} from "../../styles/stylesProps";

const {Title} = Typography;
const {TabPane} = Tabs;

const GROUP_COLORS = [
    '#0073ea', '#9c4ee4', '#ff7575', '#00c875',
    '#fdab3d', '#e2445c', '#579bfc', '#037f4c',
];

const STATUS_MAP: Record<string, { bg: string; label: string }> = {
    ACTIVE:    { bg: '#fa8c16', label: 'Em Andamento' },
    SOLD:      { bg: '#52c41a', label: 'Concluído' },
    CANCELLED: { bg: '#ff4d4f', label: 'Cancelado' },
};

function getDeadlineColor(createdAt: any, deadline: number, status: string): string {
    if (status === 'SOLD') return '#0073ea';
    const days = moment().diff(moment(createdAt), 'days');
    if (days > deadline)           return '#e44258';
    if (days > deadline * 0.8)     return '#fdab3d';
    return '#00c875';
}

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
    const navigate = useNavigate();
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

    const kanbanColumns = useMemo(
        () => regularizacaoProcesses.reduce<Record<string, ProcessProps[]>>((acc, p) => {
            const etapa = p.stepCurrent?.step?.description || 'Sem Etapa';
            if (!acc[etapa]) acc[etapa] = [];
            acc[etapa].push(p);
            return acc;
        }, {}),
        [regularizacaoProcesses]
    );

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

                <TabPane tab="🗂️ Kanban" key="3">
                    <div style={{display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12, alignItems: "flex-start"}}>
                        {Object.entries(kanbanColumns).map(([etapa, items], ci) => {
                            const color = GROUP_COLORS[ci % GROUP_COLORS.length];
                            return (
                                <div
                                    key={etapa}
                                    style={{
                                        flex: "0 0 280px",
                                        width: 280,
                                        background: "#f5f6f8",
                                        borderRadius: 8,
                                        border: "1px solid #e6e9ef",
                                    }}
                                >
                                    <div style={{
                                        background: color,
                                        color: "#fff",
                                        padding: "10px 14px",
                                        borderRadius: "8px 8px 0 0",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}>
                                        <span style={{
                                            background: "rgba(255,255,255,0.25)",
                                            borderRadius: 12,
                                            padding: "1px 9px",
                                            fontSize: 12,
                                        }}>
                                            {items.length}
                                        </span>
                                        <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{etapa}</span>
                                    </div>

                                    <div style={{padding: 10, display: "flex", flexDirection: "column", gap: 10}}>
                                        {items.map(p => {
                                            const deadline   = p.stepCurrent?.deadline ?? 0;
                                            const daysOpen   = moment().diff(moment(p.createdAt), "days");
                                            const dlColor    = getDeadlineColor(p.createdAt, deadline, p.status);
                                            const statusInfo = STATUS_MAP[p.status] ?? {bg: "#c4c4c4", label: p.status};

                                            return (
                                                <div
                                                    key={p.id}
                                                    onClick={() => navigate(`/processos/mudar-etapa/${p.id}`)}
                                                    style={{
                                                        background: "#fff",
                                                        borderRadius: 6,
                                                        border: "1px solid #e6e9ef",
                                                        borderLeft: `4px solid ${color}`,
                                                        padding: "10px 12px",
                                                        cursor: "pointer",
                                                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                                                        transition: "box-shadow 0.15s, transform 0.15s",
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
                                                >
                                                    <div style={{fontWeight: 600, color: "#323338", fontSize: 14, marginBottom: 6}}>
                                                        {p.client?.name || "—"}
                                                    </div>
                                                    <div style={{fontSize: 12, color: "#676879", marginBottom: 8}}>
                                                        📋 {p.stepCurrent?.flow || "—"}
                                                    </div>
                                                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6}}>
                                                        <span style={{background: dlColor, color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600}}>
                                                            {daysOpen}d / {deadline}d
                                                        </span>
                                                        <span style={{background: statusInfo.bg, color: "#fff", borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 600}}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {Object.keys(kanbanColumns).length === 0 && !loading && (
                        <div style={{textAlign: "center", padding: 80, color: "#aaa", fontSize: 15}}>
                            Nenhum processo de regularização encontrado.
                        </div>
                    )}

                    <div style={{display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16}}>
                        {[
                            {color: "#00c875", label: "No prazo"},
                            {color: "#fdab3d", label: "Atenção (>80% do prazo)"},
                            {color: "#e44258", label: "Atrasado"},
                            {color: "#0073ea", label: "Concluído"},
                        ].map(({color, label}) => (
                            <div key={label} style={{display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#676879"}}>
                                <span style={{width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block"}}/>
                                {label}
                            </div>
                        ))}
                    </div>
                </TabPane>
            </Tabs>
        </Spin>
    );
};

export default RegularizacaoBoard;
