import React from 'react'
import { CheckCircleFilled, ClockCircleOutlined, IssuesCloseOutlined, MessageOutlined } from '@ant-design/icons'
import { Badge, Space, Timeline, Tooltip, Typography } from 'antd'

const { Text } = Typography

type StepItem = {
    processStepId?: string
    orderStep: string
    statusStep: string
    processStepStatus?: string
    deadline: string
    stepStartedAt?: string
    flow?: string
    step: string
    notesCount?: string
}

type Props = {
    steps: StepItem[]
    process: any
    onNoteClick?: (processStepId: number, notesCount: number) => void
}

function getDeadlineDot(step: StepItem, currentOrderStep: number): React.ReactNode {
    const order = parseFloat(step.orderStep)
    const deadline = parseInt(step.deadline, 10)

    if (step.statusStep === 'UNFORESEEN') {
        return <DeadlineDot color="#e44258" label="Imprevisto" />
    }

    if (order > currentOrderStep) {
        return <DeadlineDot color="#d9d9d9" label="Não iniciada" />
    }

    if (order < currentOrderStep) {
        return <DeadlineDot color="#52c41a" label="Concluída" />
    }

    // current step — calcula pelo tempo decorrido
    if (step.stepStartedAt) {
        const started = new Date(step.stepStartedAt)
        const daysElapsed = (Date.now() - started.getTime()) / (1000 * 60 * 60 * 24)
        if (daysElapsed > deadline) {
            return <DeadlineDot color="#e44258" label={`Atrasada (${Math.floor(daysElapsed)}d de ${deadline}d)`} />
        }
        if (daysElapsed > deadline * 0.8) {
            return <DeadlineDot color="#fdab3d" label={`Atenção (${Math.floor(daysElapsed)}d de ${deadline}d)`} />
        }
        return <DeadlineDot color="#52c41a" label={`No prazo (${Math.floor(daysElapsed)}d de ${deadline}d)`} />
    }

    return null
}

function DeadlineDot({ color, label }: { color: string; label: string }) {
    return (
        <Tooltip title={label}>
            <span style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
                boxShadow: `0 0 0 2px ${color}33`,
            }} />
        </Tooltip>
    )
}

export const TimelineComponent = ({ steps, process, onNoteClick }: Props) => {
    const currentOrderStep: number = process?.stepCurrent?.orderStep ?? -1

    return (
        <Timeline mode="left">
            {steps.map((step, index) => {
                const notesCount = parseInt(step.notesCount ?? '0', 10)
                const processStepId = step.processStepId ? parseInt(step.processStepId, 10) : null

                const dot =
                    (parseFloat(step.orderStep) === currentOrderStep && (
                        <ClockCircleOutlined style={{ fontSize: '16px', color: '#8A6D3B' }} />
                    )) ||
                    (parseFloat(step.orderStep) < currentOrderStep &&
                        step.statusStep !== 'UNFORESEEN' && (
                            <CheckCircleFilled style={{ fontSize: '16px', color: '#45f0a1' }} />
                        )) ||
                    (step.statusStep === 'UNFORESEEN' && (
                        <IssuesCloseOutlined style={{ fontSize: '16px', color: 'red' }} />
                    ))

                const textColor = step.statusStep === 'UNFORESEEN' ? 'red' : undefined
                const deadlineDot = getDeadlineDot(step, currentOrderStep)

                const isCurrentStep = parseFloat(step.orderStep) === currentOrderStep
                let elapsedDays: number | null = null
                if (isCurrentStep && step.stepStartedAt) {
                    const started = new Date(step.stepStartedAt)
                    if (!isNaN(started.getTime())) {
                        elapsedDays = Math.floor((Date.now() - started.getTime()) / (1000 * 60 * 60 * 24))
                    }
                }

                return (
                    <Timeline.Item key={index} dot={dot}>
                        <Text style={{ color: textColor }}>
                            <Space align="center" wrap={false}>
                                <span>
                                    <strong>Etapa {index + 1}/{steps.length}:</strong>{' '}
                                    {step.step}
                                </span>
                                {processStepId && onNoteClick && (
                                    <Badge
                                        count={notesCount}
                                        size="small"
                                        style={{ backgroundColor: '#52c41a' }}
                                        showZero={false}
                                    >
                                        <MessageOutlined
                                            onClick={e => {
                                                e.stopPropagation()
                                                onNoteClick(processStepId, notesCount)
                                            }}
                                            style={{
                                                fontSize: 16,
                                                color: notesCount > 0 ? '#52c41a' : '#bbb',
                                                cursor: 'pointer',
                                                transition: 'color 0.2s',
                                            }}
                                            title="Ver / adicionar anotações"
                                        />
                                    </Badge>
                                )}
                            </Space>
                        </Text>
                        <br />
                        <Text style={{ color: textColor }}>
                            <Space align="center">
                                {deadlineDot}
                                <strong>Prazo:</strong>
                                {step.deadline} dia(s)
                                {elapsedDays !== null && (
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        · {elapsedDays}d decorridos
                                    </Text>
                                )}
                            </Space>
                        </Text>
                    </Timeline.Item>
                )
            })}
        </Timeline>
    )
}
