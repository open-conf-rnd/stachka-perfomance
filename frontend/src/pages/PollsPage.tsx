import { useEffect, useMemo, useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { apiRequest } from '../lib/api'

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

export function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [submittingPollId, setSubmittingPollId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [votedPollIds, setVotedPollIds] = useState<Record<string, true>>({})

  const votedCount = useMemo(() => Object.keys(votedPollIds).length, [votedPollIds])

  const loadPolls = async (silent = false) => {
    if (silent) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)
    try {
      const data = await apiRequest<Poll[]>('/api/polls')
      setPolls(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить опросы')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadPolls()
  }, [])

  const vote = async (pollId: string, optionId: string) => {
    setSubmittingPollId(pollId)
    setError(null)
    try {
      await apiRequest(`/api/polls/${pollId}/vote`, 'POST', { optionId })
      setVotedPollIds((prev) => ({ ...prev, [pollId]: true }))
      await loadPolls(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось отправить голос'
      if (message.toLowerCase().includes('already voted')) {
        setVotedPollIds((prev) => ({ ...prev, [pollId]: true }))
        await loadPolls(true)
      } else {
        setError(message)
      }
    } finally {
      setSubmittingPollId(null)
    }
  }

  return (
    <PageLayout title="Опросы" subtitle="Список опросов и голосование">
      {loading ? <p className="page__loading">Загружаем опросы...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {!loading && !error && polls.length === 0 ? (
        <p>
          Опросов пока нет. Добавь через Postman: <code>POST /api/polls</code>
          <br />
          <small style={{ opacity: 0.85 }}>
            Пример тела: {`{ "question": "Какой трек?", "options": ["React", "Node.js", "DevOps"] }`}
          </small>
        </p>
      ) : null}
      {!loading && polls.length > 0 ? (
        <>
          <p className="page__subtitle" style={{ marginBottom: '0.75rem' }}>
            Проголосовано в {votedCount} из {polls.length}
            {refreshing ? ' · обновляем...' : ''}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {polls.map((poll) => {
              const isSubmitting = submittingPollId === poll.id
              const alreadyVoted = Boolean(votedPollIds[poll.id])
              return (
                <div key={poll.id} className="page__card">
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{poll.question}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {poll.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="btn"
                        disabled={isSubmitting || alreadyVoted}
                        onClick={() => vote(poll.id, option.id)}
                        style={{ textAlign: 'left' }}
                      >
                        {option.label} · {poll.counts[option.id] ?? 0}
                      </button>
                    ))}
                  </div>
                  <div style={{ opacity: 0.8, marginTop: '0.5rem', fontSize: '0.85rem' }}>
                    Всего голосов: {poll.total}
                    {alreadyVoted ? ' · ваш голос учтен' : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </PageLayout>
  )
}
