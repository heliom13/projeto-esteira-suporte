import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Space, Spin, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import api from "../../services/api";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { buttonRadius } from "../../components/button";
import { useNavigate } from "react-router-dom";
import onNotification from "../../components/notification/notification";

const { Option } = Select;

const PROPOSAL_TYPES = [
    { value: 'CONSORTIUM', label: 'Consórcio' },
    { value: 'CONSIGNMENT', label: 'Consignado' },
    { value: 'CONTRACT', label: 'Contrato' },
    { value: 'CASH', label: 'À Vista' },
    { value: 'FINANCING', label: 'Financiamento' },
    { value: 'LOAN', label: 'Empréstimo' },
    { value: 'REGULARIZATION', label: 'Regularização' },
];

type ProposalRow = any & { _type: string; _typeLabel: string };

const ProposalList: React.FC = () => {
    const [allProposals, setAllProposals] = useState<ProposalRow[]>([]);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [flows, setFlows] = useState<{ id: number; description: string }[]>([]);
    const [selectedFlow, setSelectedFlow] = useState<number | null>(null);
    const [proposalId, setProposalId] = useState<number>(0);
    const [proposalType, setProposalType] = useState<string>('');
    const navigate = useNavigate();

    const loadAll = () => {
        setLoading(true);
        Promise.all(
            PROPOSAL_TYPES.map(t =>
                api.get(`/${t.value.toLowerCase()}s`)
                    .then(res => (res.data as any[]).map(item => ({ ...item, _type: t.value, _typeLabel: t.label })))
                    .catch(() => [])
            )
        ).then(results => {
            setAllProposals(results.flat());
            setLoading(false);
        });
    };

    useEffect(() => { loadAll(); }, []);

    const displayed = filterType
        ? allProposals.filter(p => p._type === filterType)
        : allProposals;

    const viewProposalDetails = (id: number, type: string) => {
        api.get('/flows')
            .then(response => {
                setFlows(response.data);
                setIsModalVisible(true);
                setProposalId(id);
                setProposalType(type);
            })
            .catch(() => {});
    };

    const handleSave = () => {
        api.post(`/${proposalType.toLowerCase()}s/approve`, { id: proposalId, flowId: selectedFlow })
            .then(() => {
                setIsModalVisible(false);
                loadAll();
                onNotification("success", { message: "Sucesso", description: "Processo criado!" });
            })
            .catch(() => {
                onNotification("error", { message: "Erro", description: "Erro ao criar processo!" });
            });
    };

    const columns: ColumnsType<ProposalRow> = [
        {
            title: 'ID',
            render: (r: ProposalRow) => r.proposal?.id,
            sorter: (a: ProposalRow, b: ProposalRow) => (a.proposal?.id ?? 0) - (b.proposal?.id ?? 0),
        },
        {
            title: 'Cliente',
            render: (r: ProposalRow) => r.proposal?.client?.name ?? '—',
            sorter: (a: ProposalRow, b: ProposalRow) =>
                (a.proposal?.client?.name ?? '').localeCompare(b.proposal?.client?.name ?? ''),
        },
        {
            title: 'Tipo',
            render: (r: ProposalRow) => <Tag>{r._typeLabel}</Tag>,
        },
        {
            title: 'Valor',
            render: (r: ProposalRow) =>
                r.price != null
                    ? r.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                    : '—',
        },
        {
            title: 'Editar',
            render: (r: ProposalRow) => (
                <EditOutlined
                    style={{ color: '#FF8C00' }}
                    onClick={() => navigate(`/propostas/cadastrar/${r.proposal?.id}`)}
                />
            ),
        },
        {
            title: 'Ações',
            render: (r: ProposalRow) => (
                <Button type="primary" size="small" onClick={() => viewProposalDetails(r.proposal?.id, r._type)}>
                    Virar Processo
                </Button>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            <h2>Listagem de Propostas</h2>
            <Modal
                title="Escolha um fluxo"
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Select onChange={(value: number) => setSelectedFlow(value)} style={{ width: '100%' }}>
                    {flows.map(flow => (
                        <Option key={flow.id} value={flow.id}>{flow.description}</Option>
                    ))}
                </Select>
            </Modal>
            <Space style={{ marginBottom: 16 }}>
                <Select
                    allowClear
                    placeholder="Filtrar por tipo"
                    onChange={(value: string) => setFilterType(value ?? null)}
                    style={{ width: 200 }}
                >
                    {PROPOSAL_TYPES.map(t => (
                        <Option key={t.value} value={t.value}>{t.label}</Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('cadastrar')}
                    {...buttonRadius}
                >
                    Cadastrar
                </Button>
            </Space>
            <Table
                dataSource={displayed}
                columns={columns}
                rowKey={(r: ProposalRow) => `${r._type}-${r.proposal?.id}`}
            />
        </Spin>
    );
};

export default ProposalList;
