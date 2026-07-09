import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { Button, Col, Divider, Input, Row, Space, Tag, Typography } from 'antd';
import { CloseOutlined, EditOutlined, HolderOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import onNotification from '../../components/notification/notification';
import { primaryText } from '../../styles/stylesProps';

const { Title, Text } = Typography;

type Step = {
    id: number;
    fase: number;
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

interface SortableStepProps {
    step: Step;
    index: number;
    onChange: (id: number, value: string) => void;
}

const SortableStep = ({ step, index, onChange }: SortableStepProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });

    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { opacity: 0.85, background: '#e6f4ff', borderRadius: 6 } : {}),
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Row
                align="middle"
                style={{ padding: '10px 4px', borderBottom: '1px solid #f0f0f0' }}
                wrap={false}
            >
                <Col flex="32px">
                    <span
                        {...attributes}
                        {...listeners}
                        style={{ cursor: 'grab', display: 'flex', alignItems: 'center', touchAction: 'none' }}
                    >
                        <HolderOutlined style={{ color: '#bbb', fontSize: 18 }} />
                    </span>
                </Col>
                <Col flex="38px">
                    <Tag style={{ margin: 0, minWidth: 32, textAlign: 'center' }}>{index + 1}</Tag>
                </Col>
                <Col flex="auto" style={{ paddingRight: 8 }}>
                    <Input
                        value={step.description}
                        onChange={e => onChange(step.id, e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col flex="48px" style={{ textAlign: 'right' }}>
                    <Tag color={FASE_COLORS[step.fase]} style={{ margin: 0 }}>
                        F{step.fase}
                    </Tag>
                </Col>
            </Row>
        </div>
    );
};

const CriarFluxo = () => {
    const { tipo } = useParams<{ tipo: string }>();
    const [steps, setSteps] = useState<Step[]>([]);
    const [pending, setPending] = useState<Step[]>([]);
    const [editMode, setEditMode] = useState(false);

    const storageKey = `metro-fluxo-${tipo ?? 'default'}`;
    const title = tipo === 'bancos-privados' ? '🏦 Fluxo — Bancos Privados' : '🏛️ Fluxo — Caixa (CEF)';

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        setSteps(stored ? JSON.parse(stored) : DEFAULT_STEPS);
        setEditMode(false);
    }, [tipo]);

    const handleEdit = () => {
        setPending([...steps]);
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const handleSave = useCallback(() => {
        localStorage.setItem(storageKey, JSON.stringify(pending));
        setSteps([...pending]);
        setEditMode(false);
        onNotification('success', {
            message: 'Sucesso',
            description: 'Fluxo salvo com sucesso!',
        });
    }, [pending, storageKey]);

    const handleChange = useCallback((id: number, value: string) => {
        setPending(prev => prev.map(s => s.id === id ? { ...s, description: value } : s));
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setPending(prev => {
                const activeIndex = prev.findIndex(s => s.id === active.id);
                const overIndex = prev.findIndex(s => s.id === (over?.id ?? -1));
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const groupedPhases = Object.keys(PHASES).map(Number).map(faseId => ({
        faseId,
        label: PHASES[faseId],
        steps: steps
            .map((s, idx) => ({ ...s, order: idx + 1 }))
            .filter(s => s.fase === faseId),
    }));

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <Title level={3} {...primaryText}>
                        {title}
                    </Title>
                </Col>
                <Col>
                    {!editMode ? (
                        <Button icon={<EditOutlined />} onClick={handleEdit}>
                            Editar Fluxo
                        </Button>
                    ) : (
                        <Space>
                            <Button icon={<CloseOutlined />} onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                                Salvar
                            </Button>
                        </Space>
                    )}
                </Col>
            </Row>

            {/* VIEW MODE — agrupado por fase */}
            {!editMode && (
                <div>
                    {groupedPhases.map(group => (
                        <div key={group.faseId} style={{ marginBottom: 28 }}>
                            <Divider orientation="left" style={{ marginTop: 0 }}>
                                <Tag
                                    color={FASE_COLORS[group.faseId]}
                                    style={{ fontSize: 13, padding: '3px 12px', borderRadius: 12 }}
                                >
                                    {group.label}
                                </Tag>
                            </Divider>
                            {group.steps.map(step => (
                                <Row
                                    key={step.id}
                                    align="middle"
                                    style={{ padding: '8px 12px', borderBottom: '1px solid #f5f5f5' }}
                                    wrap={false}
                                >
                                    <Col flex="42px">
                                        <Tag color="default" style={{ minWidth: 32, textAlign: 'center' }}>
                                            {step.order}
                                        </Tag>
                                    </Col>
                                    <Col flex="auto">
                                        <Text>{step.description}</Text>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* EDIT MODE — lista plana com drag-and-drop */}
            {editMode && (
                <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                        Arraste <HolderOutlined /> para reordenar. Edite o texto diretamente. A tag <strong>F1–F5</strong> indica a fase original da etapa.
                    </Text>
                    <DndContext
                        sensors={sensors}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={pending.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {pending.map((step, index) => (
                                <SortableStep
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    onChange={handleChange}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
};

export default CriarFluxo;
