import React, {useCallback, useState} from "react";
import {Button, Col, Form, Input, InputNumber, Row, Select, Spin} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {ClientService} from "../../services/client";
import {PropertyService} from "../../services/property";
import {SellerService} from "../../services/seller";
import api from "../../services/api";
import onNotification from "../../components/notification/notification";

const {Option} = Select;


const CreateProposal: React.FC = () => {
    const [form] = Form.useForm();
    const [proposalType, setProposalType] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [properties, setProperties] = useState([]);
    const [sellers, setSellers] = useState([]);
    const navigate = useNavigate();
    const [bank, setBank] = useState<string | null>(null);
    const [product, setProduct] = useState<string | null>(null);
    const [term, setTerm] = useState<number | null>(null);
    const {id} = useParams();

    const optionClients = clients.map((client: { id: number; name: string }) => (
        <Option key={client.id} value={client.id}>
            {client.name}
        </Option>
    ));
    const optionProperties = properties.map(
        (property: { id: number; description: string }) => (
            <Option key={property.id} value={property.id}>
                {property.description}
            </Option>
        )
    );
    const optionSellers = sellers.map((seller: { id: number; name: string }) => (
        <Option key={seller.id} value={seller.id}>
            {seller.name}
        </Option>
    ));

    const fetchData = useCallback(() => {
        try {
            ClientService.getClients().then((response) => setClients(response.data));
            PropertyService.getProperties().then((response) =>
                setProperties(response.data)
            );
            SellerService.getSellers().then((response) => {
                setSellers(response.data);
            });
        } catch (error) {

            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
        if (id) fetchProposalData(id)
    }, [fetchData]);

    const fetchProposalData = async (id: string) => {
        try {
            setLoading(true)
            const response = await api.get(`/proposals/${id}`);
            const proposalType = response.data.type;

            const proposalDataResponse = await api.get(`/proposals/${id}/${proposalType.toLowerCase()}s`);
            const proposalData = proposalDataResponse.data;

            setLoading(false)
            setProposalType(proposalData.proposal.type);

            form.setFieldsValue({
                clientId: {value: proposalData.proposal.client.id, label: proposalData.proposal.client.name},
                type: proposalData.proposal.type,
                bank: proposalData.bank,
                price: proposalData.price,
                term: proposalData.term,
                property: proposalData.property ? {
                    value: proposalData.property.id,
                    label: proposalData.property.description
                } : undefined,
                seller: proposalData.seller ? {
                    value: proposalData.seller.id,
                    label: proposalData.seller.name
                } : undefined,
                zone: proposalData.zone,
                entry: proposalData.entry,
                model: proposalData.model,
                service: proposalData.service,
                registration: proposalData.registration,
                payment: proposalData.payment,
                asset: proposalData.asset,
                product: proposalData.product,
                modality: proposalData.modality

            });
        } catch (error) {
            console.error(`Error fetching proposal data:`, error);
        }
    };


    const onFinish = (values: any) => {
        const request = {
            clientId: values.clientId.value,
            type: values.type,
            bank: values.bank,
            price: values.price,
            term: values.term,
            asset: values.asset,
            product: product,
            modality: values.modality,
            propertyId: values.property?.value,
            sellerId: values.seller?.value,
            zone: values.zone,
            entry: values.entry,
            model: values.model,
            service: values.service,
            registration: values.registration,
            payment: values.payment
        };
        let endpoint = "";
        switch (values.type) {
            case "CASH":
                endpoint = "/cashs";
                break;
            case "CONSIGNMENT":
                endpoint = "/consignments";
                break;
            case "CONSORTIUM":
                endpoint = "/consortiums";
                break;
            case "CONTRACT":
                endpoint = "/contracts";
                break;
            case "FINANCING":
                endpoint = "/financings";
                break;
            case "LOAN":
                endpoint = "/loans";
                break;
            case "REGULARIZATION":
                endpoint = "/regularizations";
                break;
            default:
                console.error("Unknown proposal type:", values.type);
                return;
        }
        setLoading(true)
        const apiMethod = id ? api.put : api.post;
        const apiEndpoint = id ? `${endpoint}/${id}` : endpoint;
        apiMethod(apiEndpoint, request)
            .then(response => {
                setLoading(false)
                onNotification("success", {
                    message: "Sucesso",
                    description: id ? "Proposta Atualizada " : "Proposta Criada ",
                });
                navigate("/propostas")
            })
            .catch(error => {
                setLoading(false)
                onNotification("error", {
                    message: "Erro",
                    description: "Erro ao criar proposta",
                });
            })
    };

    const handleTypeChange = (value: string) => {
        setProposalType(value);
    };


    function handleBankChange(value: string) {
        setBank(value);
    }

    function handleProductChange(value: string) {
        setProduct(value);
    }


    function renderAssetFormItem() {

        if (proposalType && (
            proposalType === "FINANCING" ||
            proposalType === "CASH" ||
            proposalType === "CONSORTIUM" ||
            proposalType === "CONTRACT"
        )) {
            return (
                <Col span={8}>
                    <Form.Item label="Bem" name="asset">
                        <Select style={{width: '100%'}}>
                            <Option value="MOVEL">MOVEL</Option>
                            <Option value="IMOVEL">IMÓVEL</Option>
                            <Option value="SERVICOS">SERVIÇOS</Option>
                        </Select>
                    </Form.Item>
                </Col>
            );
        }
        return null;
    }

    return (
        <Spin spinning={loading}>
            <h2>{id ? "Atualizar Proposta" : "Criar Nova Proposta"}</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Cliente ID" name="clientId" rules={[{required: true}]}>
                            <Select
                                placeholder="Escolha"
                                showSearch
                                labelInValue
                                allowClear
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                }
                            >
                                {optionClients}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Tipo" name="type" rules={[{required: true}]}>
                            <Select onChange={handleTypeChange} style={{width: '100%'}} disabled={!!id}>
                                <Option value="CONSORTIUM">Consórcio</Option>
                                <Option value="CONSIGNMENT">Consignado</Option>
                                <Option value="CONTRACT">Contrato</Option>
                                <Option value="CASH">A VISTA</Option>
                                <Option value="FINANCING">Financiamento</Option>
                                <Option value="LOAN">Empréstimo</Option>
                                <Option value="REGULARIZATION">Regularização</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Banco" name="bank">
                            <Select onChange={handleBankChange} style={{width: '100%'}}>
                                <Option value="BB">BB</Option>
                                <Option value="BRADESCO">BRADESCO</Option>
                                <Option value="CAIXA">CAIXA</Option>
                                <Option value="INTER">INTER</Option>
                                <Option value="ITAU">ITAU</Option>
                                <Option value="SANTANDER">SANTANDER</Option>
                                <Option value="NENHUM">NENHUM</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Valor" name="price">
                            <InputNumber
                                style={{width: "100%"}}
                                prefix="R$"
                                precision={2}
                                decimalSeparator=","
                                formatter={(value) =>
                                    `${value}`.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                }
                                parser={(value) =>
                                    Number(value!.replace(/\./g, '').replace(',', '.')) as any
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Prazo (meses)" name="term">
                            <InputNumber
                                style={{width: '100%'}}
                                min={0}
                                precision={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                parser={(value) => Number(value!.replace(/\./g, '')) as any}
                            />
                        </Form.Item>
                    </Col>

                    {renderAssetFormItem()}

                    {proposalType && proposalType === "LOAN" && (
                        <Col span={8}>
                            <Form.Item label="Produto" name="product">
                                <Select onChange={handleProductChange} style={{width: '100%'}}>
                                    <Option value="COMUM">COMUM</Option>
                                    <Option value="CRF_CAIXA">CRF CAIXA</Option>
                                    <Option value="CDC_CAIXA">CDC CAIXA</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    )}


                </Row>

                {/* Campos específicos baseados no tipo selecionado */}
                {proposalType && proposalType === "FINANCING" && (
                    <>
                        <Row gutter={16}>
                            {proposalType && proposalType === "FINANCING" && (
                                <Col span={8}>
                                    <Form.Item label="Produto" name="product">
                                        <Select onChange={handleProductChange} style={{width: '100%'}}>
                                            <Option value="MCMV">MCMV</Option>
                                            <Option value="SBPE">SBPE</Option>
                                            <Option value="COMUM">COMUM</Option>
                                            <Option value="ADJUDICADO">ADJUDICADO</Option>
                                            <Option value="PRO_COTISTA">PRÓ-COTISTA</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            )}
                            <Col span={8}>
                                <Form.Item label="Imóvel" name="property">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        showSearch
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {optionProperties}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Corretor" name="seller">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        showSearch
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {optionSellers}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Modalidade" name="modality">
                                    <Select>
                                        <Option value="SAC">SAC</Option>
                                        <Option value="PRICE">PRICE</Option>
                                        <Option value="MIX">MIX</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}

                {proposalType && proposalType === "CASH" && (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Imóvel" name="property">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        showSearch
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {optionProperties}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Corretor" name="seller">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        showSearch
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {optionSellers}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Col span={5}>
                            <Form.Item label="Zona Notarial" name="zone">
                                <Select>
                                    <Option value="1º SLZ">1º SLZ</Option>
                                    <Option value="2º SLZ">2º SLZ</Option>
                                    <Option value="3ª SLZ">3ª SLZ</Option>
                                    <Option value="4ª SLZ">4ª SLZ</Option>
                                    <Option value="1º RIBAMAR">1º RIBAMAR</Option>
                                    <Option value="1º RAPOSA">1º RAPOSA</Option>
                                    <Option value="1º PAÇO DO LUMIAR">1º PAÇO DO LUMIAR</Option>
                                    <Option value="1º ALCÂNTARA">1º ALCÂNTARA</Option>
                                    <Option value="1º BACABEIRA">1º BACABEIRA</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </>
                )}

                {proposalType && proposalType === "CONTRACT" && (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Imóvel" name="property">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        showSearch
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {optionProperties}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Corretor" name="seller">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        showSearch
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {optionSellers}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Modelo" name="model">
                                    <Select>
                                        <Option value="PRESTACAO_DE_SERVICO">PRESTAÇÃO DE SERVIÇO</Option>
                                        <Option value="COMPRA_E_VENDA">COMPRA E VENDA</Option>
                                        <Option value="ADITIVO">ADITIVO</Option>
                                        <Option value="KIT_CPS_E_CCV">KIT - CPS E CCV</Option>
                                        <Option value="LOCACAO">LOCAÇÃO</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Entrada" name="entry">
                                    <Select>
                                        <Option value="1X">1X</Option>
                                        <Option value="DIVIDIDA EM 2X">DIVIDIDA EM 2X</Option>
                                        <Option value="PARCELADO">PARCELADO</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}

                {proposalType && proposalType === "REGULARIZATION" && (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Imóvel" name="property">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        showSearch
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {optionProperties}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Corretor" name="seller">
                                    <Select
                                        placeholder="Escolha"
                                        labelInValue
                                        showSearch
                                        allowClear
                                        filterOption={(input, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        {optionSellers}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}

                {proposalType && proposalType === "REGULARIZATION" && (
                    <>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item label="Inscrição Imobiliária" name="registration">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Serviço" name="service">
                                    <Select>
                                        <Option value="IPTU">IPTU</Option>
                                        <Option value="ITBI">ITBI</Option>
                                        <Option value="AVERBAÇÃO">AVERBAÇÃO</Option>
                                        <Option value="ESCRITURA">ESCRITURA</Option>
                                        <Option value="RETIFICAÇÃO">RETIFICAÇÃO</Option>
                                        <Option value="SPU - FORO">SPU - FORO</Option>
                                        <Option value="REG. FUNDIÁRIA">REG. FUNDIÁRIA</Option>
                                        <Option value="DESPACHANTE">DESPACHANTE</Option>
                                        <Option value="HABITE-SE">HABITE-SE</Option>
                                        <Option value="LAUDO RT">LAUDO RT</Option>
                                        <Option value="VISTORIA">VISTORIA</Option>
                                        <Option value="COMPLETO">COMPLETO</Option>
                                        <Option value="TRANSMUNICIPALIDADE">TRANSMUNICIPALIDADE</Option>
                                        <Option value="PROCURAÇÃO">PROCURAÇÃO</Option>
                                        <Option value="INVENTÁRIO">INVENTÁRIO</Option>
                                        <Option value="AVALIAÇÃO">AVALIAÇÃO</Option>
                                        <Option value="BOLETO IPTU">BOLETO IPTU</Option>
                                        <Option value="LAUDÊMIO">LAUDÊMIO</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Pagamento" name="payment">
                                    <Select onChange={handleProductChange} style={{width: '100%'}}>
                                        <Option value="1x">1x</Option>
                                        <Option value="2x">2x</Option>
                                        <Option value="BOLETO">BOLETO</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                    </>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {id ? "Atualizar Proposta" : "Criar Proposta"}
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default CreateProposal;
