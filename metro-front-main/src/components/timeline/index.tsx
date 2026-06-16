import {CheckCircleFilled, ClockCircleOutlined, IssuesCloseOutlined,} from '@ant-design/icons'
import {Space, Timeline, Typography} from 'antd'

const {Text} = Typography

export const TimelineComponent = ({steps, process}) => {
    return (
        <Timeline mode="left">
            {steps.map((step, index) => (
                <Timeline.Item
                    key={index}
                    dot={
                        (parseInt(step.orderStep) === process?.stepCurrent?.orderStep && (
                            <ClockCircleOutlined
                                style={{fontSize: '16px', color: '#8A6D3B'}}
                            />
                        )) ||
                        (parseInt(step.orderStep) < process?.stepCurrent?.orderStep &&
                            step.statusStep !== 'UNFORESEEN' && (
                                <CheckCircleFilled
                                    style={{fontSize: '16px', color: '#45f0a1'}}
                                />
                            )) ||
                        (step.statusStep === 'UNFORESEEN' && (
                            <IssuesCloseOutlined style={{fontSize: '16px', color: 'red'}}/>
                        ))
                    }
                >
                    {step.statusStep === 'UNFORESEEN' ? (
                        <Text style={{color: 'red'}}>
                            <Space>
                                <strong>
                                    Etapa {index + 1}/{steps.length}:
                                </strong>
                                {step.step}
                            </Space>
                            <br/>
                            <Space>
                                <strong>Prazo:</strong>
                                {step.deadline} dia(s)
                            </Space>
                        </Text>
                    ) : (
                        <Text>
                            <Space>
                                <strong>
                                    Etapa {index + 1}/{steps.length}:
                                </strong>
                                {step.step}
                            </Space>
                            <br/>
                            <Space>
                                <strong>Prazo:</strong>
                                {step.deadline} dia(s)
                            </Space>
                        </Text>
                    )}
                </Timeline.Item>
            ))}
        </Timeline>
    )
}
