import {useEffect, useState} from 'react'
import {CheckCircleFilled, ClockCircleOutlined, IssuesCloseOutlined} from '@ant-design/icons'
import styled, {keyframes} from 'styled-components'

type Step = {
    id?: number
    step: string
    deadline: number
    daysCompleted: number
    stepStatus?: string
    stepCompleted?: string
    stepUnforeseenDescription?: string | null
    observation?: string | null
}

export const ExternalTimelineComponent = ({steps}: { steps: Step[] }) => {
    const list = (Array.isArray(steps) ? steps : []).filter(Boolean)

    const currentIndex = list.findIndex(
        (s) => s.stepCompleted === 'UNCOMPLETED' && s.stepStatus !== 'UNFORESEEN'
    )
    const completedCount = list.filter((s) => s.stepCompleted === 'COMPLETED').length
    const total = list.length
    const pct = total ? Math.round((completedCount / total) * 100) : 0
    const allDone = total > 0 && completedCount === total

    // Anima a barra de progresso ao montar (0 -> pct)
    const [animPct, setAnimPct] = useState(0)
    useEffect(() => {
        const t = setTimeout(() => setAnimPct(pct), 150)
        return () => clearTimeout(t)
    }, [pct])

    return (
        <Wrap>
            <Header>
                <HeaderTitle>
                    {allDone ? '🎉 Processo concluído!' : 'Acompanhe seu processo'}
                </HeaderTitle>
                <HeaderSub>
                    {allDone
                        ? `Todas as ${total} etapas foram concluídas`
                        : `Você está na etapa ${Math.min(completedCount + 1, total)} de ${total}`}
                </HeaderSub>
                <BarTrack>
                    <BarFill style={{width: `${animPct}%`}}/>
                </BarTrack>
                <BarPct>{animPct}%</BarPct>
            </Header>

            <List>
                {list.map((step, index) => {
                    const isUnforeseen = step.stepStatus === 'UNFORESEEN'
                    const isCompleted = step.stepCompleted === 'COMPLETED'
                    const isCurrent = index === currentIndex && !isUnforeseen
                    const isFuture = !isCompleted && !isCurrent && !isUnforeseen
                    const isLast = index === list.length - 1

                    const state = isUnforeseen
                        ? 'unforeseen'
                        : isCompleted
                            ? 'done'
                            : isCurrent
                                ? 'current'
                                : 'future'

                    return (
                        <Item key={step.id ?? index} style={{animationDelay: `${index * 80}ms`}}>
                            <Rail>
                                <Dot $state={state}>
                                    {isUnforeseen ? (
                                        <IssuesCloseOutlined/>
                                    ) : isCompleted ? (
                                        <CheckCircleFilled/>
                                    ) : isCurrent ? (
                                        <ClockCircleOutlined/>
                                    ) : (
                                        <DotInner/>
                                    )}
                                </Dot>
                                {!isLast && <Connector $done={isCompleted}/>}
                            </Rail>

                            <Card $state={state}>
                                <CardTop>
                                    <StepName $muted={isFuture}>{step.step}</StepName>
                                    <Badge $state={state}>
                                        {isUnforeseen
                                            ? 'Pendência'
                                            : isCompleted
                                                ? 'Concluída'
                                                : isCurrent
                                                    ? '📍 Você está aqui'
                                                    : 'A fazer'}
                                    </Badge>
                                </CardTop>

                                <StepOrder>Etapa {index + 1} de {total}</StepOrder>

                                {isUnforeseen && step.stepUnforeseenDescription && (
                                    <Note $warn>⚠️ {step.stepUnforeseenDescription}</Note>
                                )}

                                {step.observation && <Note>📝 {step.observation}</Note>}

                                {!isFuture && (
                                    <Meta>
                                        Prazo: {step.deadline} dia(s)
                                        {(isCompleted || isCurrent) && ` · ${step.daysCompleted} dia(s) decorrido(s)`}
                                    </Meta>
                                )}
                            </Card>
                        </Item>
                    )
                })}
            </List>
        </Wrap>
    )
}

/* ---------- animações ---------- */
const fadeInUp = keyframes`
  from { transform: translateY(12px); }
  to   { transform: translateY(0); }
`
const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(71,98,234,0.45); }
  70%  { box-shadow: 0 0 0 12px rgba(71,98,234,0); }
  100% { box-shadow: 0 0 0 0 rgba(71,98,234,0); }
`
const grow = keyframes`
  from { width: 0; }
`

/* ---------- layout ---------- */
const Wrap = styled.div`
  max-width: 560px;
  margin: 0 auto;
  padding: 4px 4px 32px;
`

const Header = styled.div`
  background: linear-gradient(135deg, #4762EA 0%, #6b8cff 100%);
  color: #fff;
  border-radius: 16px;
  padding: 20px 22px 16px;
  box-shadow: 0 8px 24px rgba(71, 98, 234, 0.25);
  margin-bottom: 26px;
`
const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
`
const HeaderSub = styled.div`
  font-size: 13px;
  opacity: 0.92;
  margin-top: 2px;
`
const BarTrack = styled.div`
  margin-top: 14px;
  height: 10px;
  background: rgba(255, 255, 255, 0.28);
  border-radius: 20px;
  overflow: hidden;
`
const BarFill = styled.div`
  height: 100%;
  background: #fff;
  border-radius: 20px;
  transition: width 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  animation: ${grow} 1.1s cubic-bezier(0.22, 1, 0.36, 1);
`
const BarPct = styled.div`
  text-align: right;
  font-size: 12px;
  font-weight: 700;
  margin-top: 4px;
`

const List = styled.div`
  position: relative;
`
const Item = styled.div`
  display: flex;
  gap: 14px;
  animation: ${fadeInUp} 0.45s ease both;
`
const Rail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`

const dotColors: Record<string, string> = {
    done: '#17b978',
    current: '#4762EA',
    future: '#d4d7dd',
    unforeseen: '#e44258',
}

const Dot = styled.div<{ $state: string }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 15px;
  background: ${(p) => dotColors[p.$state]};
  border: ${(p) => (p.$state === 'future' ? '2px solid #e3e5e9' : 'none')};
  ${(p) => (p.$state === 'current' ? `animation: ${pulse} 1.8s infinite;` : '')}
  z-index: 1;
`
const DotInner = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b9bdc5;
`
const Connector = styled.div<{ $done?: boolean }>`
  flex: 1;
  width: 3px;
  min-height: 26px;
  margin: 2px 0;
  background: ${(p) => (p.$done ? '#17b978' : '#e3e5e9')};
  border-radius: 2px;
`

const cardBg: Record<string, string> = {
    done: '#ffffff',
    current: '#eef1fe',
    future: '#ffffff',
    unforeseen: '#fff4f4',
}
const cardBorder: Record<string, string> = {
    done: '#eceef2',
    current: '#c9d4fb',
    future: '#f0f1f4',
    unforeseen: '#f6d2d6',
}

const Card = styled.div<{ $state: string }>`
  flex: 1;
  margin-bottom: 8px;
  background: ${(p) => cardBg[p.$state]};
  border: 1px solid ${(p) => cardBorder[p.$state]};
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: ${(p) =>
          p.$state === 'current' ? '0 6px 18px rgba(71,98,234,0.15)' : '0 1px 3px rgba(0,0,0,0.04)'};
  opacity: ${(p) => (p.$state === 'future' ? 0.66 : 1)};
  transition: box-shadow 0.2s;
`
const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`
const StepName = styled.div<{ $muted?: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${(p) => (p.$muted ? '#9aa0a6' : '#2b2f36')};
  line-height: 1.25;
`

const badgeStyle: Record<string, { bg: string; fg: string }> = {
    done: {bg: '#e6f8f0', fg: '#0f8a5f'},
    current: {bg: '#4762EA', fg: '#ffffff'},
    future: {bg: '#f1f2f4', fg: '#9aa0a6'},
    unforeseen: {bg: '#fde7ea', fg: '#c9304a'},
}
const Badge = styled.span<{ $state: string }>`
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: 20px;
  white-space: nowrap;
  background: ${(p) => badgeStyle[p.$state].bg};
  color: ${(p) => badgeStyle[p.$state].fg};
`
const StepOrder = styled.div`
  font-size: 11px;
  color: #9aa0a6;
  margin-top: 2px;
`
const Meta = styled.div`
  font-size: 12px;
  color: #6b7079;
  margin-top: 8px;
`
const Note = styled.div<{ $warn?: boolean }>`
  font-size: 12.5px;
  margin-top: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  background: ${(p) => (p.$warn ? '#fde7ea' : '#f5f6f8')};
  color: ${(p) => (p.$warn ? '#c9304a' : '#474a51')};
`
