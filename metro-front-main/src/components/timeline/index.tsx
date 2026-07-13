import { CheckCircleFilled, ClockCircleOutlined, IssuesCloseOutlined, MessageOutlined } from '@ant-design/icons'
import { Badge, Space, Timeline, Typography } from 'antd'

const { Text } = Typography

type StepItem = {
    processStepId?: string
    orderStep: string
    statusStep: string
    deadline: string
    flow: string
    step: string
    notesCount?: string
}

type Props = {
    steps: StepItem[]
    process: any
    onNoteClick?: (processStepId: number, notesCount: number) => void
}

export const TimelineComponent = ({ steps, process, onNoteClick }: Props) => {
    return (
        <Timeline mode="left">
            {steps.map((step, index) => {
                const notesCount = parseInt(step.notesCount ?? '0', 10)
                const processStepId = step.processStepId ? parseInt(step.processStepId, 10) : null

                const dot =
                    (parseInt(step.orderStep) === process?.stepCurrent?.orderStep && (
                        <ClockCircleOutlined style={{ fontSize: '16px', color: '#8A6D3B' }} />
                    )) ||
                    (parseInt(step.orderStep) < process?.stepCurrent?.orderStep &&
                        step.statusStep !== 'UNFORESEEN' && (
                            <CheckCircleFilled style={{ fontSize: '16px', color: '#45f0a1' }} />
                        )) ||
                    (step.statusStep === 'UNFORESEEN' && (
                        <IssuesCloseOutlined style={{ fontSize: '16px', color: 'red' }} />
                    ))

                const textColor = step.statusStep === 'UNFORESEEN' ? 'red' : undefined

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
                            <Space>
                                <strong>Prazo:</strong>
                                {step.deadline} dia(s)
                            </Space>
                        </Text>
                    </Timeline.Item>
                )
            })}
        </Timeline>
    )
}
