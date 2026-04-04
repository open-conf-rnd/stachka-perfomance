import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '@/shared/lib/api'
import {
  subscribePresentationChannel,
  subscribePresentationWs,
} from '@/shared/lib/presentationWs'
import './PollsStatsSlide.css'

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

function getLeaderOptionId(poll: Poll): string | null {
  if (poll.options.length === 0) return null
  let leaderId: string | null = null
  let leaderVotes = -1
  for (const option of poll.options) {
    const votes = getOptionVotes(poll, option.id)
    if (votes > leaderVotes) {
      leaderVotes = votes
      leaderId = option.id
    }
  }
  return leaderId
}

export function PollsStatsSlide() {
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
    <div className="polls-stats-slide">
      <h2 className="polls-stats-slide__title">Что выбирают чаще всего</h2>
      <p className="polls-stats-slide__subtitle">Статистика по первым 3 опросам</p>

      {loading ? <p className="polls-stats-slide__status">Загружаем статистику...</p> : null}
      {error ? <p className="polls-stats-slide__status">Ошибка: {error}</p> : null}
      {!loading && !error && topPolls.length === 0 ? (
        <p className="polls-stats-slide__status">Опросов пока нет</p>
      ) : null}

      {!loading && !error && topPolls.length > 0 ? (
        <div className="polls-stats-slide__grid">
          {topPolls.map((poll) => {
            const leaderId = getLeaderOptionId(poll)
            return (
              <article key={poll.id} className="polls-stats-slide__card">
                <h3 className="polls-stats-slide__question">{poll.question}</h3>
                <div className="polls-stats-slide__options">
                  {poll.options.map((option) => {
                    const votes = getOptionVotes(poll, option.id)
                    const percent = poll.total > 0 ? (votes / poll.total) * 100 : 0
                    const isLeader = option.id === leaderId && votes > 0
                    return (
                      <div key={option.id} className="polls-stats-slide__option">
                        <div className="polls-stats-slide__option-header">
                          <span>{option.label}</span>
                          <span>
                            {votes} ({Math.round(percent)}%)
                          </span>
                        </div>
                        <div className="polls-stats-slide__bar-track">
                          <div
                            className={`polls-stats-slide__bar-fill ${isLeader ? 'polls-stats-slide__bar-fill--leader' : ''}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="polls-stats-slide__total">Всего голосов: {poll.total}</p>
              </article>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
