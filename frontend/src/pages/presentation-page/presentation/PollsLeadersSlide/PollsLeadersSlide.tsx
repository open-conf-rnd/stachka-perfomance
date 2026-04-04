import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '@/shared/lib/api'
import {
  subscribePresentationChannel,
  subscribePresentationWs,
} from '@/shared/lib/presentationWs'
import './PollsLeadersSlide.css'

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

function getSortedOptionsByVotes(poll: Poll): PollOption[] {
  return [...poll.options].sort((a, b) => getOptionVotes(poll, b.id) - getOptionVotes(poll, a.id))
}

export function PollsLeadersSlide() {
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

  return (
    <div className="polls-leaders-slide">
      <h2 className="polls-leaders-slide__title">Лидеры по вопросам</h2>
      <p className="polls-leaders-slide__subtitle">Топ-ответ в каждом из 3 опросов</p>

      {loading ? <p className="polls-leaders-slide__status">Загружаем данные...</p> : null}
      {error ? <p className="polls-leaders-slide__status">Ошибка: {error}</p> : null}
      {!loading && !error && topPolls.length === 0 ? (
        <p className="polls-leaders-slide__status">Опросов пока нет</p>
      ) : null}

      {!loading && !error && topPolls.length > 0 ? (
        <div className="polls-leaders-slide__grid">
          {topPolls.map((poll) => {
            const sorted = getSortedOptionsByVotes(poll)
            const leader = sorted[0]
            const leaderVotes = leader ? getOptionVotes(poll, leader.id) : 0
            const leaderPercent = poll.total > 0 ? Math.round((leaderVotes / poll.total) * 100) : 0
            const second = sorted[1]
            const secondVotes = second ? getOptionVotes(poll, second.id) : 0

            return (
              <article key={poll.id} className="polls-leaders-slide__card">
                <h3 className="polls-leaders-slide__question">{poll.question}</h3>
                <div className="polls-leaders-slide__leader">
                  <span className="polls-leaders-slide__leader-label">Лидер</span>
                  <div className="polls-leaders-slide__leader-value">{leader?.label ?? '—'}</div>
                  <div className="polls-leaders-slide__leader-stats">
                    {leaderVotes} голосов · {leaderPercent}%
                  </div>
                </div>
                <p className="polls-leaders-slide__runner-up">
                  2 место: {second?.label ?? '—'} ({secondVotes})
                </p>
              </article>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
