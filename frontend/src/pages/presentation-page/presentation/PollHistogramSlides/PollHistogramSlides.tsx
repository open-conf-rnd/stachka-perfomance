import { Fragment, useEffect, useMemo, useState } from 'react'
import { Slide } from '@revealjs/react'
import { apiRequest } from '@/shared/lib/api'
import { SlideLogoBottom } from '../templates'
import {
  subscribePresentationChannel,
  subscribePresentationWs,
} from '@/shared/lib/presentationWs'
import './PollHistogramSlide.css'

export interface PollOption {
  id: string
  label: string
}

export interface PresentationPoll {
  id: string
  question: string
  options: PollOption[]
  counts: Record<string, number>
  total: number
  correctOptionId: string | null
}

interface PollStatsMessagePayload {
  pollId: string
  question: string
  options: PollOption[]
  counts: Record<string, number>
  total: number
  correctOptionId: string | null
}

function getOptionVotes(poll: PresentationPoll, optionId: string): number {
  return poll.counts[optionId] ?? 0
}

function mergePayloadIntoPolls(prev: PresentationPoll[], payload: PollStatsMessagePayload): PresentationPoll[] {
  const next: PresentationPoll = {
    id: payload.pollId,
    question: payload.question,
    options: payload.options,
    counts: payload.counts,
    total: payload.total,
    correctOptionId: payload.correctOptionId ?? null,
  }
  const idx = prev.findIndex((p) => p.id === payload.pollId)
  if (idx === -1) {
    return [...prev, next]
  }
  const copy = [...prev]
  copy[idx] = next
  return copy
}

function PollHistogramChart({ poll }: { poll: PresentationPoll }) {
  const maxCount = useMemo(() => {
    let m = 0
    for (const o of poll.options) {
      m = Math.max(m, getOptionVotes(poll, o.id))
    }
    return m
  }, [poll])

  const hasAnswerKey = poll.correctOptionId != null && poll.correctOptionId.length > 0

  return (
    <div className="poll-histogram">
      <h2 className="poll-histogram__question">{poll.question}</h2>
      {hasAnswerKey ? (
        <p className="poll-histogram__hint">Зелёный — верный ответ, красный — остальные варианты</p>
      ) : (
        <p className="poll-histogram__hint">Распределение голосов по вариантам</p>
      )}
      <div className="poll-histogram__chart">
        {poll.options.map((option) => {
          const count = getOptionVotes(poll, option.id)
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
          let tone: 'correct' | 'wrong' | 'neutral' = 'neutral'
          if (hasAnswerKey) {
            tone = option.id === poll.correctOptionId ? 'correct' : 'wrong'
          }
          return (
            <div key={option.id} className="poll-histogram__col">
              <div className="poll-histogram__count">{count}</div>
              <div className="poll-histogram__bar-track">
                <div
                  className={`poll-histogram__bar poll-histogram__bar--${tone}`}
                  style={{ height: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                  role="img"
                  aria-label={`${option.label}: ${count} голосов`}
                />
              </div>
              <div className="poll-histogram__label">{option.label}</div>
            </div>
          )
        })}
      </div>
      <p className="poll-histogram__total">Всего голосов: {poll.total}</p>
    </div>
  )
}

export function PollHistogramSlides() {
  const [polls, setPolls] = useState<PresentationPoll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void apiRequest<PresentationPoll[]>('/api/polls')
      .then((response) => {
        if (cancelled) return
        setPolls(
          response.map((p) => ({
            ...p,
            correctOptionId: p.correctOptionId ?? null,
          }))
        )
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить опросы')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribePresentationWs((msg) => {
      if (msg.type !== 'poll:stats' || !msg.payload) return
      const payload = msg.payload as PollStatsMessagePayload
      setPolls((prev) => mergePayloadIntoPolls(prev, payload))
    })
    return unsubscribe
  }, [])

  const pollIdsKey = useMemo(() => polls.map((p) => p.id).sort().join(','), [polls])

  useEffect(() => {
    const unsubscribes = polls.map((poll) => subscribePresentationChannel(`poll:${poll.id}`))
    return () => {
      unsubscribes.forEach((u) => u())
    }
  }, [pollIdsKey, polls])

  const slides = useMemo(() => {
    if (loading) {
      return (
        <Slide key="poll-histogram-loading" className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <div className="poll-histogram">
              <p className="poll-histogram__status">Загружаем опросы…</p>
            </div>
          </SlideLogoBottom>
        </Slide>
      )
    }
    if (error) {
      return (
        <Slide key="poll-histogram-error" className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <div className="poll-histogram">
              <p className="poll-histogram__status">Ошибка: {error}</p>
            </div>
          </SlideLogoBottom>
        </Slide>
      )
    }
    if (polls.length === 0) {
      return (
        <Slide key="poll-histogram-empty" className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <div className="poll-histogram">
              <p className="poll-histogram__status">Опросов пока нет — слайды появятся после создания опросов в админке</p>
            </div>
          </SlideLogoBottom>
        </Slide>
      )
    }
    return polls.map((poll) => (
      <Slide key={poll.id} className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <PollHistogramChart poll={poll} />
        </SlideLogoBottom>
      </Slide>
    ))
  }, [loading, error, polls])

  return <Fragment>{slides}</Fragment>
}
