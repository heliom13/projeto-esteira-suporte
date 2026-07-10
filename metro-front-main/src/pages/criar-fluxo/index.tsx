import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Divider, Input, Modal, Row, Select, Space, Spin, Tag, Typography } from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    CloudUploadOutlined,
    EditOutlined,
    HolderOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

type ApiError = {
    message?: string;
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

type RowProps = {
    step: Step;
    index: number;
    isEditing: boolean;
    editValue: string;
    onEditValueChange: (val: string) => void;
    onStartEdit: (step: Step) => void;
    onConfirmEdit: (id: number) => void;
    onCancelEdit: () => void;
};

const SortableStepRow: React.FC<RowProps> = ({
    step,
    index,
    isEditing,
    editValue,
    onEditValueChange,
    onStartEdit,
    onConfirmEdit,
    onCancelEdit,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: step.id });

    const dragStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
        zIndex: isDragging ? 1 : undefined,
    };

    return (
        <div ref={setNodeRef} style={dragStyle}>
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
                <Col flex="36px">
                    <Button
                        size="small"
                        type="text"
                        icon={<HolderOutlined />}
                        style={{
                            cursor: isDragging ? 'grabbing' : 'grab',
                            touchAction: 'none',
                            color: '#bbb',
                        }}
                        {...attributes}
                        {...listeners}
                    />
                </Col>

                <Col flex="42px">
                    <Tag color="default" style={{ minWidth: 32, textAlign: 'center' }}>
                        {index + 1}
                    </Tag>
                </Col>

                <Col flex="auto" style={{ paddingRight: 12 }}>
                    {isEditing ? (
                        <Input
                            value={editValue}
                            onChange={e => onEditValueChange(e.target.value)}
                            onPressEnter={() => onConfirmEdit(step.id)}
                            autoFocus
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
                                onClick={() => onConfirmEdit(step.id)}
                                title="Confirmar"
                            />
                            <Button
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={onCancelEdit}
                                title="Cancelar"
                            />
                        </Space>
                    ) : (
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => onStartEdit(step)}
                            title="Editar texto"
                        />
                    )}
                </Col>
            </Row>
        </div>
    );
};

const CriarFluxo: React.FC = () => {
    const { tipo } = useParams<{ tipo: string }>();

    const storageKey = useMemo(() => `metro-fluxo-${tipo ?? 'default'}`, [tipo]);
    const defaultName = useMemo(
        () => (tipo === 'bancos-privados' ? 'Bancos Privados' : 'Caixa (CEF)'),
        [tipo],
    );
    const title = tipo === 'bancos-privados' ? '🏦 Fluxo — Bancos Privados' : '🏛️ Fluxo — Caixa (CEF)';

    const [steps, setSteps] = useState<Step[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [flowTypes, setFlowTypes] = useState<FlowType[]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [publishing, setPublishing] = useState(false);
    const [flowName, setFlowName] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        setSteps(stored ? (JSON.parse(stored) as Step[]) : DEFAULT_STEPS);
        setEditingId(null);
        setFlowName(defaultName);
    }, [storageKey, defaultName]);

    const persist = useCallback(
        (newSteps: Step[]) => {
            localStorage.setItem(storageKey, JSON.stringify(newSteps));
            setSteps(newSteps);
        },
        [storageKey],
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            const oldIndex = steps.findIndex(s => s.id === active.id);
            const newIndex = steps.findIndex(s => s.id === over.id);
            persist(arrayMove(steps, oldIndex, newIndex));
        },
        [steps, persist],
    );

    const startEdit = useCallback((step: Step) => {
        setEditingId(step.id);
        setEditValue(step.description);
    }, []);

    const cancelEdit = useCallback(() => setEditingId(null), []);

    const confirmEdit = useCallback(
        (id: number) => {
            const trimmed = editValue.trim();
            if (!trimmed) return;
            persist(steps.map(s => (s.id === id ? { ...s, description: trimmed } : s)));
            setEditingId(null);
            onNotification('success', { message: 'Salvo', description: 'Etapa atualizada.' });
        },
        [editValue, steps, persist],
    );

    const openPublishModal = useCallback(() => {
        setPublishing(false);
        setSelectedTypeId(null);
        setFlowName(defaultName);
        api.get<FlowType[]>('/flowTypes')
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
    }, [defaultName]);

    const closeModal = useCallback(() => {
        if (!publishing) setModalVisible(false);
    }, [publishing]);

    const handlePublish = useCallback(async () => {
        if (!selectedTypeId) {
            onNotification('error', { message: 'Atenção', description: 'Selecione um tipo de fluxo.' });
            return;
        }
        const name = flowName.trim();
        if (!name) {
            onNotification('error', { message: 'Atenção', description: 'Informe o nome do fluxo.' });
            return;
        }

        setPublishing(true);
        try {
            await api.post('/flows/batch', {
                description: name,
                typeFlowId: selectedTypeId,
                sendMessage: false,
                steps: steps.map(s => s.description),
            });

            setModalVisible(false);
            onNotification('success', {
                message: 'Fluxo publicado!',
                description: `"${name}" agora aparece no seletor ao virar uma proposta em processo.`,
            });
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            onNotification('error', {
                message: 'Erro ao publicar',
                description: axiosError.response?.data?.message ?? 'Tente novamente.',
            });
        } finally {
            setPublishing(false);
        }
    }, [selectedTypeId, flowName, steps]);

    const stepIds = useMemo(() => steps.map(s => s.id), [steps]);

    const isBancosPrivados = tipo === 'bancos-privados';

    const phaseTagStyle = useMemo((): React.CSSProperties => {
        if (isBancosPrivados) {
            return {
                fontSize: 13,
                padding: '3px 12px',
                borderRadius: 12,
                background: 'linear-gradient(90deg, #c0392b, #e67e22)',
                color: '#fff',
                border: 'none',
            };
        }
        return { fontSize: 13, padding: '3px 12px', borderRadius: 12 };
    }, [isBancosPrivados]);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={3} {...primaryText}>
                        {title}
                    </Title>
                </Col>
                <Col>
                    <Button type="primary" icon={<CloudUploadOutlined />} onClick={openPublishModal}>
                        Publicar no Sistema
                    </Button>
                </Col>
            </Row>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={stepIds} strategy={verticalListSortingStrategy}>
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {(index === 0 || step.fase !== steps[index - 1].fase) && (
                                <Divider orientation="left" style={{ marginTop: index === 0 ? 8 : 24 }}>
                                    <Tag
                                        color={isBancosPrivados ? undefined : FASE_COLORS[step.fase]}
                                        style={phaseTagStyle}
                                    >
                                        {PHASES[step.fase]}
                                    </Tag>
                                </Divider>
                            )}
                            <SortableStepRow
                                step={step}
                                index={index}
                                isEditing={editingId === step.id}
                                editValue={editValue}
                                onEditValueChange={setEditValue}
                                onStartEdit={startEdit}
                                onConfirmEdit={confirmEdit}
                                onCancelEdit={cancelEdit}
                            />
                        </React.Fragment>
                    ))}
                </SortableContext>
            </DndContext>

            <Modal
                title="Publicar Fluxo no Sistema"
                visible={modalVisible}
                onCancel={closeModal}
                footer={[
                    <Button key="cancel" onClick={closeModal} disabled={publishing}>
                        Cancelar
                    </Button>,
                    <Button key="publish" type="primary" onClick={handlePublish} loading={publishing}>
                        Publicar
                    </Button>,
                ]}
            >
                <Spin spinning={publishing} tip="Publicando fluxo...">
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
                                <Option key={ft.id} value={ft.id}>
                                    {ft.description}
                                </Option>
                            ))}
                        </Select>
                        {flowTypes.length === 0 && (
                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                                Nenhum tipo encontrado. Execute o SQL de setup no banco de dados.
                            </Text>
                        )}
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default CriarFluxo;
