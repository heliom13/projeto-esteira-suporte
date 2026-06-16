import {Divider, Spin, Typography} from "antd";
import {useEffect, useState} from "react";
import onNotification from "../../components/notification/notification";
import {ClientService} from "../../services/client";

const {Text, Title} = Typography;

type ClientProps = {
    id: number;
    name: string;
    email: string;
    phone: string;
    document: string;
    phoneSecondary: string;
    nameSecondary: string;
    linkDrive: string;
    emailSecondary: any;
};

const Client = (id: any) => {
    const [client, setClient] = useState<ClientProps>();
    const [loading, setLoading] = useState(false);

    const fetchClient = () => {
        setLoading(true);
        try {
            ClientService.getClient(id.id).then((response) => {
                setLoading(false);
                setClient(response.data);
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
        fetchClient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <Spin tip="Carregando..." spinning={loading}>
            <Title
                level={3}
                style={{
                    color: "#4762EA",
                    textAlign: "center",
                }}
            >

                Cliente
            </Title>
            <div>
                <Text strong> Nome: </Text>
                <Text>{client?.name} </Text>
                <Divider/>
                <Text strong> Email: </Text>
                <Text>{client?.email} </Text>
                <Divider/>
                <Text strong> Telefone: </Text>
                <Text>{client?.phone} </Text>
                <Divider/>
                <Text strong> Documento: </Text>
                <Text>{client?.document} </Text>
                <Divider/>
                <Text strong> Contato: </Text>
                <Text>{client?.nameSecondary}</Text>
                <Divider/>
                <Text strong> Telefone para Contato: </Text>
                <Text>{client?.phoneSecondary} </Text>
                <Divider/>
                <Text strong> Link para Drive: </Text>
                <Text>{client?.linkDrive} </Text>
            </div>
        </Spin>
    );
};
export default Client;
