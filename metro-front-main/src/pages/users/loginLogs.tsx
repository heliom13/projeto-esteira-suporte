import React, {useEffect, useState} from "react";
import {Button, message, Spin, Table, Typography} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import "moment/locale/pt-br";
import api from "../../services/api";
import {primaryText} from "../../styles/stylesProps";

const {Title, Text} = Typography;

type LoginLogProps = {
    userName: string;
    userEmail: string;
    createdAt: string;
};

const LoginLogs = () => {
    moment.locale("pt-br");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<LoginLogProps[]>([]);

    useEffect(() => {
        setLoading(true);
        api.get("/login-logs")
            .then((response) => setLogs(response.data))
            .catch(() => message.error("Erro ao buscar log de acessos"))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        {title: "Nome", dataIndex: "userName"},
        {title: "E-mail", dataIndex: "userEmail"},
        {
            title: "Data/Hora do login",
            dataIndex: "createdAt",
            render: (value: string) => moment(value).format("DD/MM/YYYY [às] HH:mm:ss"),
        },
    ];

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Button
                icon={<ArrowLeftOutlined/>}
                style={{marginBottom: 16}}
                onClick={() => navigate("/usuarios")}
            >
                Voltar
            </Button>
            <Title level={3} {...primaryText}>
                🕐 Log de Acessos
            </Title>
            <Text type="secondary" style={{display: "block", marginBottom: 16}}>
                🔒 Registro histórico de logins — somente leitura, não pode ser editado ou apagado.
            </Text>
            <Table
                rowKey={(r, index) => `${r.userEmail}-${r.createdAt}-${index}`}
                dataSource={logs}
                columns={columns}
            />
        </Spin>
    );
};

export default LoginLogs;
