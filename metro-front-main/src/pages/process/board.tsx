import React, { useEffect, useRef, useState } from 'react';
import { Select, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ProcessService } from '../../services/process';
import { AuthService } from '../../services/auth';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

const { Title } = Typography;

type User = { id: number; name: string; username: string };

type ProcessProps = {
    id: number;
    status: string;
    nameUser: string;
    userId: number;
    createdAt: any;
    client: { name: string };
    externalId: string;
    stepCurrent: {
        description: string;
        deadline: any;
        flow: string;
        step: { description: string };
    };
    existInvoice: boolean;
    property: { description: string };
};

const GROUP_COLORS = [
    '#0073ea', '#9c4ee4', '#ff7575', '#00c875',
    '#fdab3d', '#e2445c', '#579bfc', '#037f4c',
];

const STATUS_MAP: Record<string, { bg: string; label: string }> = {
    ACTIVE:    { bg: '#00c875', label: 'Ativo' },
    SOLD:      { bg: '#0073ea', label: 'Concluído' },
    CANCELLED: { bg: '#e44258', label: 'Cancelado' },
};

function getDeadlineColor(createdAt: any, deadline: number, status: string): string {
    if (status === 'SOLD') return '#0073ea';
    const days = moment().diff(moment(createdAt), 'days');
    if (days > deadline)           return '#e44258';
    if (days > deadline * 0.8)     return '#fdab3d';
    return '#00c875';
}

const Board: React.FC = () => {
    const [loading, setLoading]       = useState(false);
    const [processes, setProcesses]   = useState<ProcessProps[]>([]);
    const [users, setUsers]           = useState<User[]>([]);
    const [editingId, setEditingId]   = useState<number | null>(null);
    const [saving, setSaving]         = useState<number | null>(null);
    const selectRef                   = useRef<any>(null);
    const navigate = useNavigate();

    const load = () => {
        setLoading(true);
        ProcessService.getProcess()
            .then(res => { setProcesses(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        load();
        AuthService.findAll().then(res => setUsers(res.data)).catch(() => {});
    }, []);

    const handleResponsibleChange = async (processId: number, userId: number) => {
        setSaving(processId);
        try {
            await ProcessService.changeResponsible(processId, userId);
            const chosen = users.find(u => u.id === userId);
            setProcesses(prev => prev.map(p =>
                p.id === processId
                    ? { ...p, nameUser: chosen?.name ?? chosen?.username ?? p.nameUser, userId }
                    : p
            ));
        } catch {
            // falha silenciosa — dados permanecem inalterados
        } finally {
            setSaving(null);
            setEditingId(null);
        }
    };

    const groups = processes.reduce<Record<string, ProcessProps[]>>((acc, p) => {
        const flow = p.stepCurrent?.flow || 'Sem Fluxo';
        if (!acc[flow]) acc[flow] = [];
        acc[flow].push(p);
        return acc;
    }, {});

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} style={{ color: '#1f3c6b', marginBottom: 24 }}>
                Esteira de Processos
            </Title>

            {Object.entries(groups).map(([flow, items], gi) => {
                const color = GROUP_COLORS[gi % GROUP_COLORS.length];
                return (
                    <div key={flow} style={{ marginBottom: 36 }}>
                        <div style={{
                            background: color,
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '6px 6px 0 0',
                            fontWeight: 700,
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.25)',
                                borderRadius: 12,
                                padding: '1px 10px',
                                fontSize: 12,
                            }}>
                                {items.length}
                            </span>
                            {flow}
                        </div>

                        <div style={{ overflowX: 'auto', border: '1px solid #e6e9ef', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: '#f5f6f8', borderBottom: '2px solid #e6e9ef' }}>
                                        <th style={th}>Cliente</th>
                                        <th style={th}>Imóvel</th>
                                        <th style={th}>Etapa Atual</th>
                                        <th style={th}>Responsável</th>
                                        <th style={th}>Prazo</th>
                                        <th style={th}>Dias em Aberto</th>
                                        <th style={th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((p, i) => {
                                        const deadline   = p.stepCurrent?.deadline ?? 0;
                                        const daysOpen   = moment().diff(moment(p.createdAt), 'days');
                                        const dlColor    = getDeadlineColor(p.createdAt, deadline, p.status);
                                        const statusInfo = STATUS_MAP[p.status] ?? { bg: '#c4c4c4', label: p.status };
                                        const isEditing  = editingId === p.id;
                                        const isSaving   = saving === p.id;

                                        return (
                                            <tr
                                                key={p.id}
                                                style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc', borderBottom: '1px solid #e6e9ef', cursor: 'pointer' }}
                                                onClick={() => { if (!isEditing) navigate(`/processos/mudar-etapa/${p.id}`); }}
                                                onMouseEnter={e => (e.currentTarget.style.background = '#eef3ff')}
                                                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbfc')}
                                            >
                                                <td style={{ ...td, borderLeft: `4px solid ${color}`, fontWeight: 600 }}>
                                                    {p.client?.name || '—'}
                                                </td>
                                                <td style={td}>{p.property?.description || '—'}</td>
                                                <td style={td}>
                                                    <span style={{ background: '#eef3ff', color: '#0073ea', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>
                                                        {p.stepCurrent?.step?.description || p.stepCurrent?.description || '—'}
                                                    </span>
                                                </td>

                                                {/* Célula de Responsável — editável */}
                                                <td
                                                    style={{ ...td, minWidth: 160 }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        if (!isSaving) {
                                                            setEditingId(isEditing ? null : p.id);
                                                            setTimeout(() => selectRef.current?.focus(), 50);
                                                        }
                                                    }}
                                                >
                                                    {isEditing ? (
                                                        <Select
                                                            ref={selectRef}
                                                            size="small"
                                                            defaultValue={p.userId}
                                                            style={{ width: '100%' }}
                                                            loading={isSaving}
                                                            autoFocus
                                                            showSearch
                                                            optionFilterProp="label"
                                                            onSelect={(val: number) => handleResponsibleChange(p.id, val)}
                                                            onBlur={() => setEditingId(null)}
                                                            onClick={e => e.stopPropagation()}
                                                            options={users.map(u => ({
                                                                value: u.id,
                                                                label: u.name || u.username,
                                                            }))}
                                                        />
                                                    ) : (
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 6,
                                                            borderRadius: 4,
                                                            padding: '2px 6px',
                                                            border: '1px dashed transparent',
                                                            cursor: 'pointer',
                                                            transition: 'border-color 0.15s',
                                                        }}
                                                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#4096ff')}
                                                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                                                        >
                                                            {p.nameUser || '—'}
                                                            <span style={{ fontSize: 10, color: '#aaa' }}>✏️</span>
                                                        </span>
                                                    )}
                                                </td>

                                                <td style={td}>
                                                    <span style={{ background: dlColor, color: '#fff', borderRadius: 4, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                                                        {deadline} dias
                                                    </span>
                                                </td>
                                                <td style={td}>{daysOpen}d</td>
                                                <td style={td}>
                                                    <span style={{ background: statusInfo.bg, color: '#fff', borderRadius: 12, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}

            {Object.keys(groups).length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: 80, color: '#aaa', fontSize: 15 }}>
                    Nenhum processo ativo encontrado.
                </div>
            )}

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
                {[
                    { color: '#00c875', label: 'No prazo' },
                    { color: '#fdab3d', label: 'Atenção (>80% do prazo)' },
                    { color: '#e44258', label: 'Atrasado' },
                    { color: '#0073ea', label: 'Concluído' },
                ].map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#676879' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
                        {label}
                    </div>
                ))}
            </div>
        </Spin>
    );
};

const th: React.CSSProperties = {
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#676879',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
    padding: '10px 14px',
    color: '#323338',
    verticalAlign: 'middle',
};

export default Board;
