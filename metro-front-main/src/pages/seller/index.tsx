import {DeleteOutlined, EditFilled, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {Button, Col, Form, Input, Popconfirm, Row, Space, Spin, Table, Typography,} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {buttonRadius} from "../../components/button";
import onNotification from "../../components/notification/notification";
import {SellerService} from "../../services/seller";
import {marginTop, primaryText} from "../../styles/stylesProps";
import {rowProps} from "../../utils/FormUtils";
import {useForm} from "antd/lib/form/Form";

const {Title, Text} = Typography;
const FormItem = Form.Item;

type SellerProps = {
    id: number;
    name: string;
    document: string;
    email: string;
    emailOther: string;
    externalId: string;
    phone: string;
    pix: string;
};

const Seller = () => {
    const [loading, setLoading] = useState(false);
    const [sellerList, setSellerList] = useState([]);
    const navigate = useNavigate();
    const [form] = useForm();

    const fetchSellers = () => {
        setLoading(true);
        SellerService.getSellers()
            .then((response) => {
                setSellerList(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                onNotification("error", {
                    description: "Erro",
                    message: "Ocorreu um erro ao carregar os dados",
                });

            });
    };

    const deleteClient = useCallback((id) => {
        setLoading(true);
        SellerService.deleteClient(id)
            .then((response) => {
                setLoading(false);
                fetchSellers();
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

    const onSubmit = useCallback(async (client: string) => {
        setLoading(true);
        SellerService.getSellerByName(client)
            .then((response) => {
                setSellerList(response.data);
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

    useEffect(() => {
        fetchSellers();
    }, []);

    const columns = [
        {
            title: "Nome",
            render: (r: SellerProps) => <Text> {r.name} </Text>,
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: "Documento",
            render: (r: SellerProps) => <Text> {r.document} </Text>,
        },
        {
            title: "Chave Pix",
            render: (r: SellerProps) => <Text> {r.pix} </Text>,
        },
        {
            title: "Email",
            render: (r: SellerProps) => <Text> {r.email} </Text>,
        },
        {
            title: "Telefone",
            render: (r: SellerProps) => <Text> {r.phone} </Text>,
        },
        {
            title: "Acesso Externo",
            render: (r: SellerProps) => (
                <span>
          <a
              href={`https://sistema.suporteimobiliario.com/external/vendedor/${r.externalId}`}
              target="_blank"
              rel="noreferrer"
          >
            {" "}
              https://sistema.suporteimobiliario.com/external/vendedor/{r.externalId}{" "}
          </a>
        </span>
            ),
        },

        {
            title: "Ação",
            render: (r: SellerProps) => (
                <Space size="middle">
                    <EditFilled
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
                Imobiliária | Corretores
            </Title>
            <Form layout="vertical" onFinish={onSubmit} form={form}>
                <Row {...rowProps}>
                    <Col span={12}>
                        <FormItem colon={false} label="Nome" name="name">
                            <Input/>
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
                dataSource={sellerList}
                {...marginTop}
                rowKey={(r: SellerProps) => r.id}
            />
        </Spin>
    );
};

export default Seller;
