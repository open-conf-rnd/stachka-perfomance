import { PageLayout } from '@/shared/ui/PageLayout'
import { useBehavior } from '../model'
import { PollCard } from './PollCard'

export function PollsPage() {
  const {
    polls,
    loading,
    refreshing,
    submittingPollId,
    error,
    votedPollIds,
    votedCount,
    vote,
  } = useBehavior()

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
                <PollCard
                  key={poll.id}
                  question={poll.question}
                  options={poll.options}
                  counts={poll.counts}
                  total={poll.total}
                  disabled={isSubmitting || alreadyVoted}
                  alreadyVoted={alreadyVoted}
                  onVote={(optionId) => vote(poll.id, optionId)}
                />
              )
            })}
          </div>
        </>
      ) : null}
    </PageLayout>
  )
}
