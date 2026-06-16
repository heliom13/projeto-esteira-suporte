import React, {useCallback, useState} from "react";
import {Button, Modal, Select, Space, Spin, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {ProposalDetail} from "./ProposalInterface";
import api from "../../services/api";
import {EditOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {buttonRadius} from "../../components/button";
import {useNavigate} from "react-router-dom";
import onNotification from "../../components/notification/notification";

const {Option} = Select;

const ProposalList: React.FC = () => {
    const [proposals, setProposals] = useState<ProposalDetail[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [columns, setColumns] = useState<ColumnsType<ProposalDetail>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [flows, setFlows] = useState<{ id: number, description: string }[]>([]);
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [proposalId, setProposalId] = useState<number>(0);
    const navigate = useNavigate();


    const fetchData = useCallback(() => {
        if (selectedType) {
            api.get(`/${selectedType?.toLowerCase()}s`)
                .then(response => {
                    setProposals(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    console.error(`Error fetching ${selectedType} proposals:`, error);
                    onNotification("error", {
                        message: "Erro",
                        description: "Erro ao buscar propostas! ",
                    });
                });
        }

    }, [selectedType]);

    const search = useCallback(() => {
        if (!selectedType) {
            onNotification("error", {
                message: "Erro",
                description: "Por favor, selecione um tipo de proposta antes de buscar.",
            });
            return;
        }
        if (selectedType) {
            setLoading(true);
            fetchData()
            let newColumns: ColumnsType<ProposalDetail> = [
                // Common columns for all types
                {
                    title: "ID",
                    dataIndex: "proposal",
                    render: (proposal) => proposal.id,
                },
                {
                    title: "Cliente",
                    dataIndex: "proposal",
                    render: (proposal) => proposal.client.name,
                },
            ];

            if (selectedType === "CONTRACT" || selectedType === "CASH" || selectedType === "CONSIGNMENT" || selectedType === "FINANCING" || selectedType === "LOAN") {
                newColumns.push(
                    {
                        title: "Banco",
                        dataIndex: "bank",
                        key: "bank",
                    },
                );
            }

            if (selectedType !== "CASH") {
                newColumns.push(
                    {
                        title: "Valor",
                        dataIndex: "price",
                        render: (r) => (
                            <p>
                                {r?.toLocaleString("pt-br", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </p>
                        ),
                    },
                );
            }

            if (selectedType !== "CASH" && selectedType !== "CONTRACT" && selectedType !== "REGULARIZATION") {
                newColumns.push({
                    title: "Prazo",
                    dataIndex: "term",
                    key: "term",
                })
            }

            if (selectedType === "CONTRACT") {
                newColumns.push({
                        title: "Modelo",
                        dataIndex: "model",
                    },
                    {
                        title: "Entrada",
                        dataIndex: "entry",
                    }
                );
            }

            if (selectedType === "CASH" || selectedType === "FINANCING") {
                newColumns.push({
                    title: "Imóvel",
                    dataIndex: "property",
                    render: (property) => property?.description,
                });
            }

            if (selectedType === "CASH" || selectedType === "FINANCING") {
                newColumns.push({
                    title: "Corretor",
                    dataIndex: "seller",
                    render: (seller) => seller?.name,
                });
            }

            if (selectedType === "FINANCING") {
                newColumns.push({
                    title: "Modalidade",
                    dataIndex: "modality",
                });
            }

            if (selectedType === "CASH") {
                newColumns.push(
                    {
                        title: "zone",
                        dataIndex: "zone",
                    },
                );
            }

            if (selectedType === "CONSORTIUM" || selectedType === "FINANCING" || selectedType === "CASH" || selectedType === "CONTRACT") {
                newColumns.push({
                    title: "Bem",
                    dataIndex: "asset",
                });
            }

            if (selectedType === "LOAN" || selectedType === "FINANCING") {
                newColumns.push({
                    title: "Produto",
                    dataIndex: "product",
                });
            }

            if (selectedType === "REGULARIZATION") {
                newColumns.push(
                    {
                        title: "Inscrição IMOB.",
                        dataIndex: "registration",
                    },
                    {
                        title: "Serviço",
                        dataIndex: "service",
                    },
                    {
                        title: "Pagamento",
                        dataIndex: "payment",
                        key: "payment",
                    });
            }

            newColumns.push(
                {
                    title: 'Editar',
                    key: 'edit',
                    render: (text, record) => (
                        <EditOutlined
                            style={{color: "#FF8C00"}}
                            onClick={() => navigate(`/propostas/cadastrar/${record.proposal.id}`)}
                        />

                    ),
                }
            )

            newColumns.push(
                {
                    title: "Ações",
                    key: "actions",
                    render: (_, record) => (
                        <Button type="primary" onClick={() => viewProposalDetails(record.proposal.id)}>
                            Virar Processo
                        </Button>
                    ),
                },
            )

            setColumns(newColumns);
        }
    }, [fetchData, selectedType]);
    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    const viewProposalDetails = (id: number) => {
        api.get('/flows')
            .then(response => {
                setFlows(response.data);
                setIsModalVisible(true);
                setProposalId(id);
            })
            .catch(error => {
                console.error(`Error fetching flows:`, error);
            });
    };

    const handleSave = () => {
        const url = `/${selectedType?.toLowerCase()}s/approve`;
        api.post(url, {id: proposalId, flowId: selectedFlow})
            .then(response => {
                setIsModalVisible(false);
                fetchData()
                onNotification("success", {
                    message: "Sucesso",
                    description: "Processo criado! ",
                });
            })
            .catch(error => {
                console.error(`Error approving proposal:`, error);
                onNotification("error", {
                    message: "Erro",
                    description: "Erro ao criar processo! ",
                });
            });
    };

    return (
        <Spin spinning={loading}>
            <h2>Listagem de Propostas</h2>
            <Modal title="Escolha um fluxo" visible={isModalVisible} onOk={handleSave}
                   onCancel={() => setIsModalVisible(false)}>
                <Select onChange={value => setSelectedFlow(value)} style={{width: '100%'}}>
                    {flows.map(flow => (
                        <Option key={flow.id} value={flow.id}>{flow.description}</Option>
                    ))}
                </Select>
            </Modal>
            <Space direction="vertical" size="small">
                <label>Tipo de Proposta</label>
                <Select onChange={handleTypeChange} style={{width: '200px', marginBottom: '20px'}}>
                    <Option value="CONSORTIUM">Consórcio</Option>
                    <Option value="CONSIGNMENT">Consignado</Option>
                    <Option value="CONTRACT">Contrato</Option>
                    <Option value="CASH">A vista</Option>
                    <Option value="FINANCING">Financiamento</Option>
                    <Option value="LOAN">Empréstimo</Option>
                    <Option value="REGULARIZATION">Regularização</Option>
                </Select>
                <Space>
                    <Button
                        type="primary"
                        icon={<SearchOutlined/>}
                        onClick={() => search()}
                        {...buttonRadius}
                    >
                        Buscar
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
            </Space>
            <br/>
            <br/>
            <Table dataSource={proposals} columns={columns} rowKey="id"/>
        </Spin>
    );
};

export default ProposalList;
