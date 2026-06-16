import {Button, Col, Form, Input, Modal, Popconfirm, Row, Space, Spin, Table, Typography,} from "antd";
import {useCallback, useEffect, useState} from "react";
import {buttonRadius} from "../../components/button";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined,} from "@ant-design/icons";
import {validateMessages} from "../../utils/ValidatorFields";
import {rowProps} from "../../utils/FormUtils";
import {marginTop, primaryText} from "../../styles/stylesProps";
import {useNavigate} from "react-router-dom";
import {PropertyService} from "../../services/property";
import Property from "./view";
import onNotification from "../../components/notification/notification";
import {useForm} from "antd/lib/form/Form";

const {Title} = Typography;
const FormItem = Form.Item;

type ImmobileProps = {
    id: number;
    description: string;
    address: string;
    ownerDocument: string;
    ownerName: string;
    email: string;
    externalId: string;
    price: number;
};

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [openModalView, setOpenModalView] = useState(false);
    const [propertyId, setPropertyId] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = useForm();

    const fetchData = () => {
        setLoading(true);
        PropertyService.getProperties()
            .then((response) => {
                setLoading(false);
                setProperties(response.data);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Erro ao carregar os dados",
                });
            });
    };

    const onSubmit = useCallback(async (client: string) => {
        setLoading(true);
        PropertyService.getPropertyByName(client)
            .then((response) => {
                setProperties(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Não encontrado.",
                });
            });
    }, []);

    const deleteClient = useCallback((id) => {
        setLoading(true);
        PropertyService.deleteClient(id)
            .then((response) => {
                setLoading(false);
                fetchData();
                onNotification("success", {
                    message: "Sucesso",
                    description: "Sucesso ao deletar.",
                });
            })
            .catch((error) => {

                setLoading(false);
                onNotification("error", {
                    message: "Erro",
                    description: "Falha ao deletar.",
                });
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: "Descrição",
            render: (r: ImmobileProps) => <p>{r.description}</p>,
            sorter: (a: any, b: any) => a.description.localeCompare(b.description),
        },
        {
            title: "Proprietário",
            render: (r: ImmobileProps) => <p>{r.ownerName}</p>,
            sorter: (a: any, b: any) => a.ownerName.localeCompare(b.ownerName),
        },
        {
            title: "CPF",
            render: (r: ImmobileProps) => <p>{r.ownerDocument}</p>,
        },
        {
            title: "Endereço",
            render: (r: ImmobileProps) => <p>{r.address}</p>,
        },
        {
            title: "Acesso Externo",
            render: (r: ImmobileProps) => (
                <span>
          <a
              href={`https://sistema.suporteimobiliario.com/external/imovel/${r.externalId}`}
              target="_blank"
              rel="noreferrer"
          >
            {" "}
              https://sistema.suporteimobiliario.com/external/imovel/
              {r.externalId}{" "}
          </a>
        </span>
            ),
        },

        {
            title: "Preço",
            render: (r: ImmobileProps) => (
                <p>
                    {r.price.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </p>
            ),
        },
        {
            title: "Ação",
            render: (r: ImmobileProps) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{color: "#4169E1"}}
                        onClick={() => {
                            setPropertyId(r.id);
                            setOpenModalView(true);
                        }}
                    />
                    <EditOutlined
                        style={{color: "#FF8C00"}}
                        onClick={() => navigate(`atualizar/${r.id}`)}
                    />
                    <Popconfirm
                        title="Deseja remover esse registro?"
                        onConfirm={() => {
                            deleteClient(r.id);
                        }}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <DeleteOutlined style={{color: "#ff0000"}}/>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Imóveis
            </Title>
            <Form layout="vertical" validateMessages={validateMessages} onFinish={onSubmit} form={form}>
                <Row {...rowProps}>
                    <Col span={10}>
                        <FormItem
                            colon={false}
                            label="Nome do Proprietário"
                            name="ownerName"
                        >
                            <Input placeholder="Digite o nome"/>
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem
                            colon={false}
                            label="Descrição do Imóvel"
                            name="description"
                        >
                            <Input placeholder="Digite a descrição"/>
                        </FormItem>
                    </Col>
                </Row>
                <Space>
                    <Button type="primary" icon={<SearchOutlined/>} {...buttonRadius} htmlType="submit">
                        Pesquisar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => navigate("cadastrar")}
                        {...buttonRadius}
                    >
                        Cadastrar
                    </Button>
                </Space>
            </Form>
            <Table
                columns={columns}
                dataSource={properties}
                rowKey={(r: ImmobileProps) => r.id}
                {...marginTop}
            />
            <Modal
                visible={openModalView}
                onCancel={() => setOpenModalView(false)}
                footer={[
                    <Button
                        key="back"
                        type="primary"
                        onClick={() => setOpenModalView(false)}
                    >
                        Ok
                    </Button>,
                ]}
            >
                <Property id={propertyId}/>
            </Modal>
        </Spin>
    );
};

export default Properties;
