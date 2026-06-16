import {Divider, Spin, Typography} from "antd";
import {useEffect, useState} from "react";
import onNotification from "../../components/notification/notification";
import {PropertyService} from "../../services/property";

const {Text, Title} = Typography;

type PropertyProps = {
    id: number;
    name: string;
    description: string;
    address: string;
    ownerDocument: string;
    ownerName: string;
    price: number;
    email: string;
    document: string;
    nameSecondary: string;
    emailSecondary: string;
    phoneSecondary: string;
};

const Property = (id: any) => {
    const [property, setProperty] = useState<PropertyProps>();
    const [loading, setLoading] = useState(false);

    const fetchproperty = () => {
        setLoading(true);
        try {
            PropertyService.getProperty(id.id).then((response) => {
                setLoading(false);
                setProperty(response.data);
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
        fetchproperty();
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

                Cliente Vendedor
            </Title>
            <div>
                <Text strong> Descrição: </Text>
                <Text>{property?.description} </Text>
                <Divider/>
                <Text strong> Dono do Imóvel: </Text>
                <Text>{property?.ownerName} </Text>
                <Divider/>
                <Text strong> Email: </Text>
                <Text>{property?.email} </Text>
                <Divider/>
                <Text strong> Documento: </Text>
                <Text>{property?.ownerDocument} </Text>
                <Divider/>
                <Text strong> Preço: </Text>
                <Text>
                    {property?.price.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </Text>
                <Divider/>
                <Text strong> Contato: </Text>
                <Text>{property?.nameSecondary}</Text>
                <Divider/>
                <Text strong> Telefone para Contato: </Text>
                <Text>{property?.phoneSecondary}</Text>
                <Divider/>
                <Text strong> Email para Contato: </Text>
                <Text>{property?.emailSecondary}</Text>
            </div>
        </Spin>
    );
};
export default Property;
