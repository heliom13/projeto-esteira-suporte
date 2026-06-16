import {CheckCircleFilled, ClockCircleOutlined, IssuesCloseOutlined,} from '@ant-design/icons'
import {Timeline, Typography} from 'antd'
import styled from 'styled-components'

const {Text} = Typography

export const ExternalTimelineComponent = ({steps, process}) => {
    return (
        <Timeline mode="left">
            {steps.map((step, index) => (
                <Timeline.Item
                    key={index}
                    dot={
                        (step.stepCurrent === process?.step && (
                            <ClockCircleOutlined
                                style={{fontSize: '16px', color: '#8A6D3B'}}
                            />
                        )) ||
                        (step.stepCompleted !== 'UNCOMPLETED' && (
                            <CheckCircleFilled
                                style={{fontSize: '16px', color: '#45f0a1'}}
                            />
                        )) ||
                        (step.stepStatus === 'UNFORESEEN' && (
                            <IssuesCloseOutlined style={{fontSize: '16px', color: 'red'}}/>
                        ))
                    }
                >
                    {step.stepStatus === 'UNFORESEEN' ? (
                        <Text style={{color: 'red'}}>
                            <Strong>
                                Etapa {index + 1}/{steps.length}: <Label>{step.step}</Label>
                            </Strong>
                            <br/>
                            <Strong>
                                Prazo: <Label>{step.deadline} dia(s)</Label>
                            </Strong>
                            <br/>
                            <Strong>
                                Dias Completos: <Label>{step.daysCompleted} dia(s)</Label>
                            </Strong>
                        </Text>
                    ) : (
                        <Text>
                            <Strong>
                                Etapa {index + 1}/{steps.length}: <Label>{step.step}</Label>
                            </Strong>
                            <br/>
                            <Strong>
                                Prazo: <Label>{step.deadline} dia(s)</Label>
                            </Strong>
                            <br/>
                            <Strong>
                                Dias Completos: <Label> {step.daysCompleted} dia(s)</Label>
                            </Strong>
                        </Text>
                    )}
                </Timeline.Item>
            ))}
        </Timeline>
    )
}

const Label = styled.span`
  font-weight: 500;
  color: #474a51;
  @media screen and (max-width: 480px) {
    font-size: 12px;
    white-space: no-wrap;
  }
`

const Strong = styled.strong`
  font-weight: 500;
  color: #474a51;
  @media screen and (max-width: 480px) {
    font-size: 12px;
    white-space: no-wrap;
  }
`
