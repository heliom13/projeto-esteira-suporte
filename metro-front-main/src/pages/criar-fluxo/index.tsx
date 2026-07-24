import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Divider, Input, Row, Space, Tag, Typography } from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    HolderOutlined,
    MessageOutlined,
    PlusOutlined,
    SaveOutlined,
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
const { TextArea } = Input;

type Phase = { id: number; label: string; color: string };
type Step = { id: number; fase: number; description: string; observation?: string };
type FlowType = { id: number; description: string };
type ApiError = { message?: string };

const DEFAULT_PHASES: Phase[] = [
    { id: 1, label: 'Fase 1: Prospecção, Planejamento e Análise Cadastral', color: 'blue' },
    { id: 2, label: 'Fase 2: Instrução do Processo e Avaliação do Imóvel', color: 'green' },
    { id: 3, label: 'Fase 3: Compliance Jurídico e Análise de Risco Operacional', color: 'orange' },
    { id: 4, label: 'Fase 4: Confecção Contratual e Assinatura', color: 'purple' },
    { id: 5, label: 'Fase 5: Atos Notariais, Registrais e Quitação', color: 'red' },
];

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

// ── Step row ──────────────────────────────────────────────────────────────────

type RowProps = {
    step: Step;
    globalIndex: number;
    isEditing: boolean;
    editValue: string;
    isEditingObs: boolean;
    obsValue: string;
    onEditValueChange: (v: string) => void;
    onObsValueChange: (v: string) => void;
    onStartEdit: (step: Step) => void;
    onConfirmEdit: (id: number) => void;
    onCancelEdit: () => void;
    onToggleObs: (step: Step) => void;
    onConfirmObs: (id: number) => void;
    onCancelObs: () => void;
    onClearObs: (id: number) => void;
};

const SortableStepRow: React.FC<RowProps> = ({
    step, globalIndex, isEditing, editValue, isEditingObs, obsValue,
    onEditValueChange, onObsValueChange,
    onStartEdit, onConfirmEdit, onCancelEdit,
    onToggleObs, onConfirmObs, onCancelObs, onClearObs,
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

    const hasObs = !!step.observation;

    return (
        <div ref={setNodeRef} style={dragStyle}>
            <Row
                align="middle"
                wrap={false}
                style={{
                    padding: '8px 12px',
                    borderBottom: isEditingObs || hasObs ? 'none' : '1px solid #f0f0f0',
                    background: isEditing ? '#f6ffed' : undefined,
                    borderRadius: isEditing ? 4 : undefined,
                }}
            >
                <Col flex="36px">
                    <Button
                        size="small"
                        type="text"
                        icon={<HolderOutlined />}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none', color: '#bbb' }}
                        {...attributes}
                        {...listeners}
                    />
                </Col>
                <Col flex="42px">
                    <Tag color="default" style={{ minWidth: 32, textAlign: 'center' }}>
                        {globalIndex + 1}
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
                            <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => onConfirmEdit(step.id)} title="Confirmar" />
                            <Button size="small" icon={<CloseOutlined />} onClick={onCancelEdit} title="Cancelar" />
                        </Space>
                    ) : (
                        <Space size={4}>
                            <Button size="small" icon={<EditOutlined />} onClick={() => onStartEdit(step)} title="Editar etapa" />
                            <Button
                                size="small"
                                icon={<MessageOutlined />}
                                onClick={() => onToggleObs(step)}
                                title="Observação para o cliente"
                                type={hasObs ? 'primary' : 'default'}
                                style={hasObs ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : undefined}
                            />
                        </Space>
                    )}
                </Col>
            </Row>

            {(isEditingObs || hasObs) && (
                <div style={{ padding: '4px 12px 10px 90px', borderBottom: '1px solid #f0f0f0', background: '#fffbe6' }}>
                    {isEditingObs ? (
                        <Space direction="vertical" style={{ width: '100%' }} size={4}>
                            <TextArea
                                value={obsValue}
                                onChange={e => onObsValueChange(e.target.value)}
                                placeholder="Escreva uma observação que será enviada junto com a mensagem desta etapa..."
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                autoFocus
                            />
                            <Space size={4}>
                                <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => onConfirmObs(step.id)}>
                                    Salvar observação
                                </Button>
                                <Button size="small" icon={<CloseOutlined />} onClick={onCancelObs}>Cancelar</Button>
                            </Space>
                        </Space>
                    ) : (
                        <Space align="start" style={{ width: '100%' }}>
                            <Text style={{ fontSize: 12, color: '#595959', flex: 1 }}>📝 {step.observation}</Text>
                            <Space size={4}>
                                <Button size="small" icon={<EditOutlined />} onClick={() => onToggleObs(step)} title="Editar observação" />
                                <Button size="small" icon={<CloseOutlined />} onClick={() => onClearObs(step.id)} title="Remover observação" danger />
                            </Space>
                        </Space>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Phase container (sortable at outer level, DnD context for steps inside) ──

type PhaseContainerProps = {
    phase: Phase;
    steps: Step[];
    globalOffset: number;
    isEditingPhase: boolean;
    editingPhaseLabel: string;
    onEditPhaseLabelChange: (v: string) => void;
    onStartEditPhase: () => void;
    onConfirmEditPhase: () => void;
    onCancelEditPhase: () => void;
    onStepsDragEnd: (e: DragEndEvent) => void;
    onAddStep: (description: string) => void;
    editingId: number | null;
    editValue: string;
    editingObsId: number | null;
    obsValue: string;
    onEditValueChange: (v: string) => void;
    onObsValueChange: (v: string) => void;
    onStartEdit: (step: Step) => void;
    onConfirmEdit: (id: number) => void;
    onCancelEdit: () => void;
    onToggleObs: (step: Step) => void;
    onConfirmObs: (id: number) => void;
    onCancelObs: () => void;
    onClearObs: (id: number) => void;
};

const SortablePhaseContainer: React.FC<PhaseContainerProps> = ({
    phase, steps, globalOffset,
    isEditingPhase, editingPhaseLabel, onEditPhaseLabelChange,
    onStartEditPhase, onConfirmEditPhase, onCancelEditPhase,
    onStepsDragEnd, onAddStep,
    editingId, editValue, editingObsId, obsValue,
    onEditValueChange, onObsValueChange,
    onStartEdit, onConfirmEdit, onCancelEdit,
    onToggleObs, onConfirmObs, onCancelObs, onClearObs,
}) => {
    const [addingStep, setAddingStep] = useState(false);
    const [newStepDesc, setNewStepDesc] = useState('');
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: phase.id });

    const innerSensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    const stepIds = useMemo(() => steps.map(s => s.id), [steps]);

    const phaseStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={phaseStyle}>
            <Divider orientation="left" style={{ marginTop: 16, marginBottom: 4 }}>
                <Space align="center" size={4}>
                    <Button
                        size="small"
                        type="text"
                        icon={<HolderOutlined />}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab', color: '#aaa', touchAction: 'none' }}
                        title="Arrastar fase"
                        {...attributes}
                        {...listeners}
                    />
                    {isEditingPhase ? (
                        <>
                            <Input
                                value={editingPhaseLabel}
                                onChange={e => onEditPhaseLabelChange(e.target.value)}
                                onPressEnter={onConfirmEditPhase}
                                style={{ width: 340 }}
                                autoFocus
                            />
                            <Button size="small" type="primary" icon={<CheckOutlined />} onClick={onConfirmEditPhase} title="Confirmar" />
                            <Button size="small" icon={<CloseOutlined />} onClick={onCancelEditPhase} title="Cancelar" />
                        </>
                    ) : (
                        <>
                            <Tag color={phase.color} style={{ fontSize: 13, padding: '3px 12px', borderRadius: 12 }}>
                                {phase.label}
                            </Tag>
                            <Button size="small" type="text" icon={<EditOutlined />} onClick={onStartEditPhase} title="Editar nome da fase" />
                        </>
                    )}
                </Space>
            </Divider>

            <DndContext sensors={innerSensors} collisionDetection={closestCenter} onDragEnd={onStepsDragEnd}>
                <SortableContext items={stepIds} strategy={verticalListSortingStrategy}>
                    {steps.map((step, idx) => (
                        <SortableStepRow
                            key={step.id}
                            step={step}
                            globalIndex={globalOffset + idx}
                            isEditing={editingId === step.id}
                            editValue={editValue}
                            isEditingObs={editingObsId === step.id}
                            obsValue={obsValue}
                            onEditValueChange={onEditValueChange}
                            onObsValueChange={onObsValueChange}
                            onStartEdit={onStartEdit}
                            onConfirmEdit={onConfirmEdit}
                            onCancelEdit={onCancelEdit}
                            onToggleObs={onToggleObs}
                            onConfirmObs={onConfirmObs}
                            onCancelObs={onCancelObs}
                            onClearObs={onClearObs}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <div style={{ padding: '8px 12px 12px' }}>
                {addingStep ? (
                    <Row align="middle" wrap={false} style={{ padding: '6px 0' }}>
                        <Col flex="78px" />
                        <Col flex="auto" style={{ paddingRight: 12 }}>
                            <Input
                                value={newStepDesc}
                                onChange={e => setNewStepDesc(e.target.value)}
                                onPressEnter={() => {
                                    if (newStepDesc.trim()) {
                                        onAddStep(newStepDesc.trim());
                                        setNewStepDesc('');
                                        setAddingStep(false);
                                    }
                                }}
                                placeholder="Nome da etapa..."
                                autoFocus
                            />
                        </Col>
                        <Col flex="none">
                            <Space size={4}>
                                <Button
                                    size="small"
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={() => {
                                        if (newStepDesc.trim()) {
                                            onAddStep(newStepDesc.trim());
                                            setNewStepDesc('');
                                            setAddingStep(false);
                                        }
                                    }}
                                />
                                <Button
                                    size="small"
                                    icon={<CloseOutlined />}
                                    onClick={() => { setAddingStep(false); setNewStepDesc(''); }}
                                />
                            </Space>
                        </Col>
                    </Row>
                ) : (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => setAddingStep(true)}
                        style={{ width: '100%' }}
                    >
                        Adicionar etapa
                    </Button>
                )}
            </div>
        </div>
    );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const CriarFluxo: React.FC = () => {
    const { tipo } = useParams<{ tipo: string }>();

    const storageKey = useMemo(() => `metro-fluxo-${tipo ?? 'default'}`, [tipo]);
    const phasesStorageKey = useMemo(() => `metro-fases-${tipo ?? 'default'}`, [tipo]);
    const defaultName = useMemo(
        () => tipo === 'bancos-privados' ? 'Bancos Privados'
            : tipo === 'regularizacao' ? 'Regularização'
            : 'Caixa (CEF)',
        [tipo],
    );
    const title = tipo === 'bancos-privados' ? '🏦 Fluxo — Bancos Privados'
        : tipo === 'regularizacao' ? '📋 Fluxo — Regularização'
        : '🏛️ Fluxo — Caixa (CEF)';

    const [phases, setPhases] = useState<Phase[]>(DEFAULT_PHASES);
    const [steps, setSteps] = useState<Step[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [editingObsId, setEditingObsId] = useState<number | null>(null);
    const [obsValue, setObsValue] = useState('');
    const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
    const [editingPhaseLabel, setEditingPhaseLabel] = useState('');
    const [saving, setSaving] = useState(false);
    const [flowTypeId, setFlowTypeId] = useState<number | null>(null);

    const phaseSensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    const defaultSteps = useMemo(
        () => tipo === 'regularizacao' ? [] : DEFAULT_STEPS,
        [tipo],
    );
    const defaultPhases = useMemo(
        () => tipo === 'regularizacao'
            ? [{ id: 1, label: 'Regularização', color: 'blue' }]
            : DEFAULT_PHASES,
        [tipo],
    );

    useEffect(() => {
        const storedSteps = localStorage.getItem(storageKey);
        setSteps(storedSteps ? (JSON.parse(storedSteps) as Step[]) : defaultSteps);

        const storedPhases = localStorage.getItem(phasesStorageKey);
        setPhases(storedPhases ? (JSON.parse(storedPhases) as Phase[]) : defaultPhases);

        setEditingId(null);
        setEditingObsId(null);
        setEditingPhaseId(null);

        api.get<FlowType[]>('/flowTypes').then(res => {
            const keyword = tipo === 'bancos-privados' ? 'privado'
                : tipo === 'regularizacao' ? 'regulariz'
                : 'caixa';
            const match = res.data.find(ft => ft.description.toLowerCase().includes(keyword));
            if (match) setFlowTypeId(match.id);
        }).catch(() => {});
    }, [storageKey, phasesStorageKey, tipo]);

    const stepsByPhase = useMemo(() => {
        const map: Record<number, Step[]> = {};
        phases.forEach(p => { map[p.id] = []; });
        steps.forEach(s => { if (map[s.fase]) map[s.fase].push(s); });
        return map;
    }, [phases, steps]);

    const phaseOffsets = useMemo(() => {
        const offsets: Record<number, number> = {};
        let offset = 0;
        phases.forEach(p => {
            offsets[p.id] = offset;
            offset += (stepsByPhase[p.id] ?? []).length;
        });
        return offsets;
    }, [phases, stepsByPhase]);

    const phaseIds = useMemo(() => phases.map(p => p.id), [phases]);

    const persistSteps = useCallback(
        (newSteps: Step[]) => {
            localStorage.setItem(storageKey, JSON.stringify(newSteps));
            setSteps(newSteps);
        },
        [storageKey],
    );

    const persistPhases = useCallback(
        (newPhases: Phase[]) => {
            localStorage.setItem(phasesStorageKey, JSON.stringify(newPhases));
            setPhases(newPhases);
        },
        [phasesStorageKey],
    );

    const handlePhasesDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            const oldIdx = phases.findIndex(p => p.id === active.id);
            const newIdx = phases.findIndex(p => p.id === over.id);
            const newPhases = arrayMove(phases, oldIdx, newIdx);
            persistPhases(newPhases);
            persistSteps(newPhases.flatMap(p => stepsByPhase[p.id] ?? []));
        },
        [phases, stepsByPhase, persistPhases, persistSteps],
    );

    const handleStepsDragEnd = useCallback(
        (faseId: number, event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            const phaseSteps = stepsByPhase[faseId] ?? [];
            const oldIdx = phaseSteps.findIndex(s => s.id === active.id);
            const newIdx = phaseSteps.findIndex(s => s.id === over.id);
            const reordered = arrayMove(phaseSteps, oldIdx, newIdx);
            persistSteps(phases.flatMap(p => p.id === faseId ? reordered : (stepsByPhase[p.id] ?? [])));
        },
        [phases, stepsByPhase, persistSteps],
    );

    const startEdit = useCallback((step: Step) => {
        setEditingId(step.id);
        setEditValue(step.description);
        setEditingObsId(null);
    }, []);

    const cancelEdit = useCallback(() => setEditingId(null), []);

    const confirmEdit = useCallback(
        (id: number) => {
            const trimmed = editValue.trim();
            if (!trimmed) return;
            persistSteps(steps.map(s => (s.id === id ? { ...s, description: trimmed } : s)));
            setEditingId(null);
            onNotification('success', { message: 'Salvo', description: 'Etapa atualizada.' });
        },
        [editValue, steps, persistSteps],
    );

    const toggleObs = useCallback((step: Step) => {
        setEditingId(null);
        if (editingObsId === step.id) {
            setEditingObsId(null);
        } else {
            setEditingObsId(step.id);
            setObsValue(step.observation ?? '');
        }
    }, [editingObsId]);

    const cancelObs = useCallback(() => setEditingObsId(null), []);

    const confirmObs = useCallback(
        (id: number) => {
            const trimmed = obsValue.trim();
            persistSteps(steps.map(s => (s.id === id ? { ...s, observation: trimmed || undefined } : s)));
            setEditingObsId(null);
        },
        [obsValue, steps, persistSteps],
    );

    const clearObs = useCallback(
        (id: number) => {
            persistSteps(steps.map(s => (s.id === id ? { ...s, observation: undefined } : s)));
        },
        [steps, persistSteps],
    );

    const handleAddStep = useCallback(
        (faseId: number, description: string) => {
            const maxId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) : 0;
            persistSteps([...steps, { id: maxId + 1, fase: faseId, description }]);
        },
        [steps, persistSteps],
    );

    const startEditPhase = useCallback((phase: Phase) => {
        setEditingPhaseId(phase.id);
        setEditingPhaseLabel(phase.label);
        setEditingId(null);
        setEditingObsId(null);
    }, []);

    const cancelEditPhase = useCallback(() => setEditingPhaseId(null), []);

    const confirmEditPhase = useCallback(() => {
        const trimmed = editingPhaseLabel.trim();
        if (!trimmed) return;
        persistPhases(phases.map(p => (p.id === editingPhaseId ? { ...p, label: trimmed } : p)));
        setEditingPhaseId(null);
        onNotification('success', { message: 'Fase atualizada', description: 'Nome da fase salvo.' });
    }, [editingPhaseLabel, editingPhaseId, phases, persistPhases]);

    const handleSave = useCallback(async () => {
        if (!flowTypeId) {
            onNotification('error', {
                message: 'Configuração pendente',
                description: 'Tipo de fluxo não encontrado. Verifique o banco de dados.',
            });
            return;
        }

        setSaving(true);
        const flatSteps = phases.flatMap(p => stepsByPhase[p.id] ?? []);
        try {
            await api.post('/flows/batch/upsert', {
                description: defaultName,
                typeFlowId: flowTypeId,
                sendMessage: true,
                steps: flatSteps.map(s => ({
                    description: s.description,
                    observation: s.observation ?? null,
                })),
            });
            onNotification('success', {
                message: 'Fluxo salvo!',
                description: `"${defaultName}" atualizado e disponível para novos processos.`,
            });
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            onNotification('error', {
                message: 'Erro ao salvar',
                description: axiosError.response?.data?.message ?? 'Tente novamente.',
            });
        } finally {
            setSaving(false);
        }
    }, [flowTypeId, defaultName, phases, stepsByPhase]);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={3} {...primaryText}>{title}</Title>
                </Col>
                <Col>
                    <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
                        Salvar
                    </Button>
                </Col>
            </Row>

            <DndContext sensors={phaseSensors} collisionDetection={closestCenter} onDragEnd={handlePhasesDragEnd}>
                <SortableContext items={phaseIds} strategy={verticalListSortingStrategy}>
                    {phases.map(phase => (
                        <SortablePhaseContainer
                            key={phase.id}
                            phase={phase}
                            steps={stepsByPhase[phase.id] ?? []}
                            globalOffset={phaseOffsets[phase.id] ?? 0}
                            isEditingPhase={editingPhaseId === phase.id}
                            editingPhaseLabel={editingPhaseLabel}
                            onEditPhaseLabelChange={setEditingPhaseLabel}
                            onStartEditPhase={() => startEditPhase(phase)}
                            onConfirmEditPhase={confirmEditPhase}
                            onCancelEditPhase={cancelEditPhase}
                            onStepsDragEnd={e => handleStepsDragEnd(phase.id, e)}
                            onAddStep={desc => handleAddStep(phase.id, desc)}
                            editingId={editingId}
                            editValue={editValue}
                            editingObsId={editingObsId}
                            obsValue={obsValue}
                            onEditValueChange={setEditValue}
                            onObsValueChange={setObsValue}
                            onStartEdit={startEdit}
                            onConfirmEdit={confirmEdit}
                            onCancelEdit={cancelEdit}
                            onToggleObs={toggleObs}
                            onConfirmObs={confirmObs}
                            onCancelObs={cancelObs}
                            onClearObs={clearObs}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default CriarFluxo;
