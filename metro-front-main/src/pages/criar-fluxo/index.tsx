import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Input, Modal, Row, Select, Space, Spin, Tag, Typography } from 'antd';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    CloudUploadOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import onNotification from '../../components/notification/notification';
import { primaryText } from '../../styles/stylesProps';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

type Step = {
    id: number;
    fase: number;
    description: string;
};

type FlowType = {
    id: number;
    description: string;
};

const PHASES: Record<number, string> = {
    1: 'Fase 1: Prospecção, Planejamento e Análise Cadastral',
    2: 'Fase 2: Instrução do Processo e Avaliação do Imóvel',
    3: 'Fase 3: Compliance Jurídico e Análise de Risco Operacional',
    4: 'Fase 4: Confecção Contratual e Assinatura',
    5: 'Fase 5: Atos Notariais, Registrais e Quitação',
};

const FASE_COLORS: Record<number, string> = {
    1: 'blue',
    2: 'green',
    3: 'orange',
    4: 'purple',
    5: 'red',
};

const DEFAULT_STEPS: Step[] = [
    { id: 1,  fase: 1, description: 'Primeiro contato e qualificação do cliente' },
    { id: 2,  fase: 1, description: 'Levantamento de capacidade de pagamento' },
    { id: 3,  fase: 1, description: 'Simulação de financiamento' },
    { id: 4,  fase: 1, description: 'Análise preliminar de crédito' },
    { id: 5,  fase: 1, description: 'Escolha do banco e linha de crédito' },
    { id: 6,  fase: 1, description: 'Coleta de documentos do comprador' },
    { id: 7,  fase: 1, description: 'Análise cadastral do comprador' },
    { id: 8,  fase: 1, description: 'Aprovação do perfil pelo banco' },
    { id: 9,  fase: 2, description: 'Escolha e proposta do imóvel' },
    { id: 10, fase: 2, description: 'Coleta de documentos do imóvel' },
    { id: 11, fase: 2, description: 'Coleta de documentos do vendedor' },
    { id: 12, fase: 2, description: 'Protocolo do processo no banco' },
    { id: 13, fase: 2, description: 'Solicitação de avaliação do imóvel' },
    { id: 14, fase: 2, description: 'Vistoria e laudo de avaliação' },
    { id: 15, fase: 2, description: 'Análise do laudo pelo banco' },
    { id: 16, fase: 2, description: 'Aprovação do valor de avaliação' },
    { id: 17, fase: 3, description: 'Análise jurídica dos documentos do imóvel' },
    { id: 18, fase: 3, description: 'Verificação de ônus e restrições' },
    { id: 19, fase: 3, description: 'Emissão de certidões negativas do vendedor' },
    { id: 20, fase: 3, description: 'Emissão de certidões negativas do imóvel' },
    { id: 21, fase: 3, description: 'Análise de risco operacional' },
    { id: 22, fase: 3, description: 'Aprovação jurídica pelo banco' },
    { id: 23, fase: 4, description: 'Elaboração do contrato de compra e venda' },
    { id: 24, fase: 4, description: 'Revisão do contrato pelo cliente e vendedor' },
    { id: 25, fase: 4, description: 'Assinatura do contrato de compra e venda' },
    { id: 26, fase: 4, description: 'Emissão do contrato de financiamento pelo banco' },
    { id: 27, fase: 4, description: 'Revisão do contrato de financiamento pelo cliente' },
    { id: 28, fase: 4, description: 'Assinatura do contrato de financiamento' },
    { id: 29, fase: 5, description: 'Reconhecimento de firma no cartório' },
    { id: 30, fase: 5, description: 'Registro do contrato no cartório de imóveis' },
    { id: 31, fase: 5, description: 'Emissão da escritura pública' },
    { id: 32, fase: 5, description: 'Registro da escritura no RGI' },
    { id: 33, fase: 5, description: 'Atualização da matrícula do imóvel' },
    { id: 34, fase: 5, description: 'Verificação do registro pelo banco' },
    { id: 35, fase: 5, description: 'Liberação do recurso pelo banco' },
    { id: 36, fase: 5, description: 'Pagamento ao vendedor' },
    { id: 37, fase: 5, description: 'Entrega das chaves ao comprador' },
    { id: 38, fase: 5, description: 'Quitação e encerramento do processo' },
];

const CriarFluxo = () => {
    const { tipo } = useParams<{ tipo: string }>();
    const [steps, setSteps] = useState<Step[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    // Publicar no sistema
    const [modalVisible, setModalVisible] = useState(false);
    const [flowTypes, setFlowTypes] = useState<FlowType[]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [publishing, setPublishing] = useState(false);
    const [flowName, setFlowName] = useState('');

    const storageKey = `metro-fluxo-${tipo ?? 'default'}`;
    const defaultName = tipo === 'bancos-privados' ? 'Bancos Privados' : 'Caixa (CEF)';
    const title = tipo === 'bancos-privados' ? '🏦 Fluxo — Bancos Privados' : '🏛️ Fluxo — Caixa (CEF)';

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        setSteps(stored ? JSON.parse(stored) : DEFAULT_STEPS);
        setEditingId(null);
        setFlowName(defaultName);
    }, [tipo]);

    const persist = (newSteps: Step[]) => {
        localStorage.setItem(storageKey, JSON.stringify(newSteps));
        setSteps(newSteps);
    };

    const startEdit = (step: Step) => {
        setEditingId(step.id);
        setEditValue(step.description);
    };

    const confirmEdit = (id: number) => {
        if (!editValue.trim()) return;
        persist(steps.map(s => s.id === id ? { ...s, description: editValue.trim() } : s));
        setEditingId(null);
        onNotification('success', { message: 'Salvo', description: 'Etapa atualizada.' });
    };

    const cancelEdit = () => setEditingId(null);

    const moveUp = (index: number) => {
        if (index === 0) return;
        const next = [...steps];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        persist(next);
    };

    const moveDown = (index: number) => {
        if (index === steps.length - 1) return;
        const next = [...steps];
        [next[index + 1], next[index]] = [next[index], next[index + 1]];
        persist(next);
    };

    const openPublishModal = () => {
        setPublishing(false);
        setSelectedTypeId(null);
        setFlowName(defaultName);
        api.get('/flowTypes')
            .then(res => {
                setFlowTypes(res.data);
                setModalVisible(true);
            })
            .catch(() => {
                onNotification('error', {
                    message: 'Erro',
                    description: 'Não foi possível carregar os tipos de fluxo.',
                });
            });
    };

    const handlePublish = async () => {
        if (!selectedTypeId) {
            onNotification('error', { message: 'Atenção', description: 'Selecione um tipo de fluxo.' });
            return;
        }
        if (!flowName.trim()) {
            onNotification('error', { message: 'Atenção', description: 'Informe o nome do fluxo.' });
            return;
        }

        setPublishing(true);
        try {
            // Cria todos os passos no backend
            const createdStepIds: { stepId: number; order: number }[] = [];
            for (let i = 0; i < steps.length; i++) {
                const res = await api.post('/steps', {
                    description: steps[i].description,
                    deadLine: 1,
                    requiredDocument: false,
                    documents: [],
                });
                createdStepIds.push({ stepId: res.data.id, order: i + 1 });
            }

            // Cria o fluxo com os passos
            await api.post('/flows', {
                description: flowName.trim(),
                typeFlowId: selectedTypeId,
                steps: createdStepIds,
                hasClient: true,
                hasProperty: false,
                hasSellerMain: false,
                hasSellerSecondary: false,
                sendMessage: false,
            });

            setPublishing(false);
            setModalVisible(false);
            onNotification('success', {
                message: 'Fluxo publicado!',
                description: `"${flowName}" agora aparece no seletor ao virar uma proposta em processo.`,
            });
        } catch (err: any) {
            setPublishing(false);
            onNotification('error', {
                message: 'Erro ao publicar',
                description: err?.response?.data?.message || 'Tente novamente.',
            });
        }
    };

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={3} {...primaryText}>
                        {title}
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<CloudUploadOutlined />}
                        onClick={openPublishModal}
                    >
                        Publicar no Sistema
                    </Button>
                </Col>
            </Row>

            {steps.map((step, index) => {
                const showPhaseHeader = index === 0 || step.fase !== steps[index - 1].fase;
                const isEditing = editingId === step.id;

                return (
                    <div key={step.id}>
                        {showPhaseHeader && (
                            <Divider orientation="left" style={{ marginTop: index === 0 ? 8 : 24 }}>
                                <Tag
                                    color={FASE_COLORS[step.fase]}
                                    style={{ fontSize: 13, padding: '3px 12px', borderRadius: 12 }}
                                >
                                    {PHASES[step.fase]}
                                </Tag>
                            </Divider>
                        )}

                        <Row
                            align="middle"
                            wrap={false}
                            style={{
                                padding: '8px 12px',
                                borderBottom: '1px solid #f0f0f0',
                                background: isEditing ? '#f6ffed' : undefined,
                                borderRadius: isEditing ? 4 : undefined,
                            }}
                        >
                            <Col flex="42px">
                                <Tag color="default" style={{ minWidth: 32, textAlign: 'center' }}>
                                    {index + 1}
                                </Tag>
                            </Col>

                            <Col flex="auto" style={{ paddingRight: 12 }}>
                                {isEditing ? (
                                    <Input
                                        value={editValue}
                                        onChange={e => setEditValue(e.target.value)}
                                        onPressEnter={() => confirmEdit(step.id)}
                                        autoFocus
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    <Text>{step.description}</Text>
                                )}
                            </Col>

                            <Col flex="none">
                                {isEditing ? (
                                    <Space size={4}>
                                        <Button
                                            size="small"
                                            type="primary"
                                            icon={<CheckOutlined />}
                                            onClick={() => confirmEdit(step.id)}
                                            title="Confirmar"
                                        />
                                        <Button
                                            size="small"
                                            icon={<CloseOutlined />}
                                            onClick={cancelEdit}
                                            title="Cancelar"
                                        />
                                    </Space>
                                ) : (
                                    <Space size={4}>
                                        <Button
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={() => startEdit(step)}
                                            title="Editar texto"
                                        />
                                        <Button
                                            size="small"
                                            icon={<ArrowUpOutlined />}
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                            title="Mover para cima"
                                        />
                                        <Button
                                            size="small"
                                            icon={<ArrowDownOutlined />}
                                            onClick={() => moveDown(index)}
                                            disabled={index === steps.length - 1}
                                            title="Mover para baixo"
                                        />
                                    </Space>
                                )}
                            </Col>
                        </Row>
                    </div>
                );
            })}

            <Modal
                title="Publicar Fluxo no Sistema"
                visible={modalVisible}
                onCancel={() => !publishing && setModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalVisible(false)} disabled={publishing}>
                        Cancelar
                    </Button>,
                    <Button key="publish" type="primary" onClick={handlePublish} loading={publishing}>
                        Publicar
                    </Button>,
                ]}
            >
                <Spin spinning={publishing} tip="Criando passos e fluxo...">
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                            Nome do Fluxo
                        </label>
                        <Input
                            value={flowName}
                            onChange={e => setFlowName(e.target.value)}
                            placeholder="Ex: Bancos Privados"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                            Tipo de Fluxo
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Selecione o tipo"
                            onChange={(val: number) => setSelectedTypeId(val)}
                            value={selectedTypeId ?? undefined}
                        >
                            {flowTypes.map(ft => (
                                <Option key={ft.id} value={ft.id}>{ft.description}</Option>
                            ))}
                        </Select>
                        {flowTypes.length === 0 && (
                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                                Nenhum tipo encontrado. Cadastre um tipo de fluxo no banco de dados.
                            </Text>
                        )}
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default CriarFluxo;
