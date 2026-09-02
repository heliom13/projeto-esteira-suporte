import React, {useEffect, useState} from "react";
import {Empty, Spin, Tag, Timeline, Typography} from "antd";
import moment from "moment";
import "moment/locale/pt-br";
import {ClientService} from "../../services/client";
import {
    CheckCircleOutlined,
    FlagOutlined,
    SyncOutlined,
    UserAddOutlined,
} from "@ant-design/icons";

const {Text} = Typography;

type HistoryEntry = {
    type: string;
    description: string;
    userName: string | null;
    createdAt: string;
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

const ClientHistory: React.FC<{clientId: string | number}> = ({clientId}) => {
    moment.locale("pt-br");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setLoading(true);
        ClientService.getClientHistory(clientId)
            .then((response) => setHistory(response.data))
            .finally(() => setLoading(false));
    }, [clientId]);

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Text type="secondary" style={{display: "block", marginBottom: 16}}>
                🔒 Registro histórico — somente leitura, não pode ser editado ou apagado.
            </Text>

            {!loading && history.length === 0 && (
                <Empty description="Nenhum evento registrado ainda" style={{marginTop: 40}}/>
            )}

            {history.length > 0 && (
                <Timeline mode="left" style={{marginTop: 24}}>
                    {history.map((entry, index) => {
                        const meta = typeMeta[entry.type] || {color: "gray", icon: <CheckCircleOutlined/>};
                        return (
                            <Timeline.Item key={index} color={meta.color} dot={meta.icon}>
                                <div style={{marginBottom: 2}}>
                                    <Text strong>{entry.description}</Text>
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

export default ClientHistory;
