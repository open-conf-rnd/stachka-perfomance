import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../../lib/api'
import {
  subscribePresentationChannel,
  subscribePresentationWs,
} from '../../../lib/presentationWs'
import './PollsSummarySlide.css'

interface PollOption {
  id: string
  label: string
}

interface Poll {
  id: string
  question: string
  options: PollOption[]
  counts: Record<string, number>
  total: number
}

interface PollStatsMessagePayload {
  pollId: string
  question: string
  options: PollOption[]
  counts: Record<string, number>
  total: number
}

function getOptionVotes(poll: Poll, optionId: string): number {
  return poll.counts[optionId] ?? 0
}

function getLeaderPercent(poll: Poll): number {
  if (poll.total <= 0) return 0
  let maxVotes = 0
  for (const option of poll.options) {
    maxVotes = Math.max(maxVotes, getOptionVotes(poll, option.id))
  }
  return Math.round((maxVotes / poll.total) * 100)
}

export function PollsSummarySlide() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void apiRequest<Poll[]>('/api/polls')
      .then((response) => {
        if (cancelled) return
        setPolls(response)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить опросы')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribePresentationWs((msg) => {
      if (msg.type !== 'poll:stats' || !msg.payload) return
      const payload = msg.payload as PollStatsMessagePayload
      setPolls((prev) =>
        prev.map((poll) =>
          poll.id === payload.pollId
            ? {
                id: payload.pollId,
                question: payload.question,
                options: payload.options,
                counts: payload.counts,
                total: payload.total,
              }
            : poll
        )
      )
    })

    return unsubscribe
  }, [])

  const topPolls = useMemo(() => polls.slice(0, 3), [polls])

  useEffect(() => {
    const unsubscribes = topPolls.map((poll) =>
      subscribePresentationChannel(`poll:${poll.id}`)
    )
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [topPolls])

  const summary = useMemo(() => {
    const totalVotes = topPolls.reduce((sum, poll) => sum + poll.total, 0)
    const avgVotes = topPolls.length > 0 ? Math.round(totalVotes / topPolls.length) : 0
    const mostActivePoll = topPolls.reduce<Poll | null>(
      (best, poll) => (!best || poll.total > best.total ? poll : best),
      null
    )
    const strongestConsensusPoll = topPolls.reduce<Poll | null>((best, poll) => {
      if (!best) return poll
      return getLeaderPercent(poll) > getLeaderPercent(best) ? poll : best
    }, null)

    return {
      totalVotes,
      avgVotes,
      mostActivePoll,
      strongestConsensusPoll,
    }
  }, [topPolls])

  return (
    <div className="polls-summary-slide">
      <h2 className="polls-summary-slide__title">Summary по опросам</h2>
      <p className="polls-summary-slide__subtitle">Быстрые метрики по первым 3 опросам</p>

      {loading ? <p className="polls-summary-slide__status">Загружаем метрики...</p> : null}
      {error ? <p className="polls-summary-slide__status">Ошибка: {error}</p> : null}
      {!loading && !error && topPolls.length === 0 ? (
        <p className="polls-summary-slide__status">Опросов пока нет</p>
      ) : null}

      {!loading && !error && topPolls.length > 0 ? (
        <div className="polls-summary-slide__grid">
          <article className="polls-summary-slide__card">
            <div className="polls-summary-slide__label">Всего голосов</div>
            <div className="polls-summary-slide__value">{summary.totalVotes}</div>
          </article>
          <article className="polls-summary-slide__card">
            <div className="polls-summary-slide__label">Среднее на опрос</div>
            <div className="polls-summary-slide__value">{summary.avgVotes}</div>
          </article>
          <article className="polls-summary-slide__card">
            <div className="polls-summary-slide__label">Самый активный вопрос</div>
            <div className="polls-summary-slide__text">
              {summary.mostActivePoll?.question ?? '—'}
            </div>
            <div className="polls-summary-slide__meta">
              Голосов: {summary.mostActivePoll?.total ?? 0}
            </div>
          </article>
          <article className="polls-summary-slide__card">
            <div className="polls-summary-slide__label">Самый однозначный ответ</div>
            <div className="polls-summary-slide__text">
              {summary.strongestConsensusPoll?.question ?? '—'}
            </div>
            <div className="polls-summary-slide__meta">
              Лидер: {summary.strongestConsensusPoll ? `${getLeaderPercent(summary.strongestConsensusPoll)}%` : '0%'}
            </div>
          </article>
        </div>
      ) : null}
    </div>
  )
}
