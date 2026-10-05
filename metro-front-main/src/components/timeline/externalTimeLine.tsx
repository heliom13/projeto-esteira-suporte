import {
    CheckCircleFilled,
    ClockCircleOutlined,
    IssuesCloseOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons'
import {Progress, Timeline, Typography} from 'antd'
import styled from 'styled-components'

const {Text} = Typography

export const ExternalTimelineComponent = ({steps}) => {
    const list = (Array.isArray(steps) ? steps : []).filter(Boolean)

    // Etapa atual = primeira ainda nao concluida (e que nao seja um imprevisto).
    const currentIndex = list.findIndex(
        (s) => s.stepCompleted === 'UNCOMPLETED' && s.stepStatus !== 'UNFORESEEN'
    )
    const completedCount = list.filter((s) => s.stepCompleted === 'COMPLETED').length
    const pct = list.length ? Math.round((completedCount / list.length) * 100) : 0
    const allDone = list.length > 0 && completedCount === list.length

    return (
        <div>
            <ProgressWrap>
                <Text strong style={{color: '#474a51'}}>
                    {allDone
                        ? '🎉 Processo concluído!'
                        : `Você está na etapa ${completedCount + 1} de ${list.length}`}
                </Text>
                <Progress
                    percent={pct}
                    strokeColor={allDone ? '#45f0a1' : '#4762EA'}
                    style={{marginTop: 4}}
                />
            </ProgressWrap>

            <Timeline mode="left">
                {list.map((step, index) => {
                    const isUnforeseen = step.stepStatus === 'UNFORESEEN'
                    const isCompleted = step.stepCompleted === 'COMPLETED'
                    const isCurrent = index === currentIndex && !isUnforeseen
                    const isFuture = !isCompleted && !isCurrent && !isUnforeseen

                    let dot
                    let badge
                    let badgeColor

                    if (isUnforeseen) {
                        dot = <IssuesCloseOutlined style={{fontSize: 18, color: '#e44258'}}/>
                        badge = 'Pendência'
                        badgeColor = '#e44258'
                    } else if (isCompleted) {
                        dot = <CheckCircleFilled style={{fontSize: 18, color: '#45f0a1'}}/>
                        badge = 'Concluída'
                        badgeColor = '#1b8a5a'
                    } else if (isCurrent) {
                        dot = <ClockCircleOutlined style={{fontSize: 18, color: '#4762EA'}}/>
                        badge = '📍 Você está aqui'
                        badgeColor = '#4762EA'
                    } else {
                        dot = <MinusCircleOutlined style={{fontSize: 16, color: '#c4c4c4'}}/>
                        badge = 'A fazer'
                        badgeColor = '#9aa0a6'
                    }

                    return (
                        <Timeline.Item key={step.id ?? index} dot={dot}>
                            <StepCard $current={isCurrent} $future={isFuture}>
                                <StepTitle $muted={isFuture}>
                                    Etapa {index + 1}/{list.length}: {step.step}
                                </StepTitle>
                                <Badge style={{color: badgeColor, borderColor: badgeColor}}>
                                    {badge}
                                </Badge>

                                {isUnforeseen && step.stepUnforeseenDescription && (
                                    <Line>
                                        <strong>Motivo:</strong> {step.stepUnforeseenDescription}
                                    </Line>
                                )}

                                {!isFuture && (
                                    <Line $muted>
                                        Prazo: {step.deadline} dia(s)
                                        {isCompleted || isCurrent
                                            ? ` · Dias: ${step.daysCompleted} dia(s)`
                                            : ''}
                                    </Line>
                                )}

                                {step.observation && (
                                    <Line>📝 {step.observation}</Line>
                                )}
                            </StepCard>
                        </Timeline.Item>
                    )
                })}
            </Timeline>
        </div>
    )
}

const ProgressWrap = styled.div`
  margin-bottom: 20px;
`

const StepCard = styled.div<{ $current?: boolean; $future?: boolean }>`
  padding: ${(p) => (p.$current ? '10px 12px' : '2px 0')};
  border-radius: 8px;
  background: ${(p) => (p.$current ? '#eef1fe' : 'transparent')};
  border: ${(p) => (p.$current ? '1px solid #cdd6fb' : 'none')};
  opacity: ${(p) => (p.$future ? 0.6 : 1)};
`

const StepTitle = styled.div<{ $muted?: boolean }>`
  font-weight: 600;
  color: ${(p) => (p.$muted ? '#9aa0a6' : '#323338')};
  @media screen and (max-width: 480px) {
    font-size: 13px;
  }
`

const Badge = styled.span`
  display: inline-block;
  margin-top: 4px;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 10px;
  border: 1px solid;
`

const Line = styled.div<{ $muted?: boolean }>`
  margin-top: 4px;
  font-size: 12px;
  color: ${(p) => (p.$muted ? '#8a8f98' : '#474a51')};
`
