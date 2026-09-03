import React, {useEffect, useMemo, useState} from "react";
import {Empty, Input, Spin, Tag, Timeline, Typography} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import moment from "moment";
import "moment/locale/pt-br";
import {ClientService} from "../../services/client";
import {useWorkspace} from "../../contexts/WorkspaceContext";
import {primaryText} from "../../styles/stylesProps";
import {
    CheckCircleOutlined,
    FlagOutlined,
    SyncOutlined,
    UserAddOutlined,
} from "@ant-design/icons";

const {Title, Text} = Typography;

type HistoryEntry = {
    type: string;
    description: string;
    userName: string | null;
    createdAt: string;
    clientId: number | null;
    clientName: string | null;
    flowType: string | null;
};

const typeMeta: Record<string, {color: string; icon: React.ReactNode}> = {
    CLIENT_CREATED: {color: "blue", icon: <UserAddOutlined/>},
    PROCESS_CREATED: {color: "blue", icon: <UserAddOutlined/>},
    PROCESS_STEP_COMPLETED: {color: "green", icon: <SyncOutlined/>},
    PROCESS_FINISHED: {color: "purple", icon: <FlagOutlined/>},
    PROCESS_UPDATED: {color: "orange", icon: <SyncOutlined/>},
    PROCESS_CANCELLED: {color: "red", icon: <FlagOutlined/>},
    PROCESS_CHANGED_USER: {color: "gold", icon: <SyncOutlined/>},
    COMMENT_ADDED: {color: "gray", icon: <SyncOutlined/>},
};

const isRegularizacaoFlow = (flowType: string | null) =>
    (flowType || "").toLowerCase().includes("regulariz");

const GlobalHistory: React.FC = () => {
    moment.locale("pt-br");
    const {workspace} = useWorkspace();
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setLoading(true);
        ClientService.getGlobalHistory()
            .then((response) => setHistory(response.data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return history
            .filter((entry) => {
                if (!entry.flowType) return true;
                return workspace === "regularizacao"
                    ? isRegularizacaoFlow(entry.flowType)
                    : !isRegularizacaoFlow(entry.flowType);
            })
            .filter((entry) =>
                search
                    ? (entry.clientName || "").toLowerCase().includes(search.toLowerCase())
                    : true
            );
    }, [history, workspace, search]);

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                🕐 Histórico
            </Title>
            <Text type="secondary" style={{display: "block", marginBottom: 16}}>
                🔒 Registro histórico geral — somente leitura, não pode ser editado ou apagado.
            </Text>

            <Input
                placeholder="Buscar por cliente..."
                prefix={<SearchOutlined/>}
                allowClear
                style={{maxWidth: 320, marginBottom: 24}}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {!loading && filtered.length === 0 && (
                <Empty description="Nenhum evento registrado ainda" style={{marginTop: 40}}/>
            )}

            {filtered.length > 0 && (
                <Timeline mode="left">
                    {filtered.map((entry, index) => {
                        const meta = typeMeta[entry.type] || {color: "gray", icon: <CheckCircleOutlined/>};
                        return (
                            <Timeline.Item key={index} color={meta.color} dot={meta.icon}>
                                <div style={{marginBottom: 2}}>
                                    <Text strong>{entry.description}</Text>
                                    {entry.clientName && (
                                        <Text> — {entry.clientName}</Text>
                                    )}
                                </div>
                                <div>
                                    {entry.userName && (
                                        <Tag color={meta.color}>{entry.userName}</Tag>
                                    )}
                                    <Text type="secondary">
                                        {moment(entry.createdAt).format("DD/MM/YYYY [às] HH:mm")}
                                    </Text>
                                </div>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            )}
        </Spin>
    );
};

export default GlobalHistory;
