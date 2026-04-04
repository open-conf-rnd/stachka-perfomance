import { PageLayout } from '@/shared/ui/PageLayout'
import type { BingoTask } from '@/entities/bingo'
import { useBehavior } from '../model'
import { BingoDescriptionTooltip } from './BingoDescriptionTooltip'
import { BingoTaskCard } from './BingoTaskCard'
import './BingoPage.css'

export function BingoPage() {
  const {
    tasks,
    loading,
    error,
    status,
    shareEnabled,
    completedCount,
    tooltipTask,
    setTooltipTask,
    shareToStory,
    shareInChat,
  } = useBehavior()

  const toggleDescription = (task: BingoTask) => {
    setTooltipTask(tooltipTask?.id === task.id ? null : task)
  }

  return (
    <PageLayout
      title="Бинго"
      subtitle={shareEnabled ? 'Карточка заданий и Share to Story' : 'Карточка заданий'}
    >
      <p style={{ margin: '0 0 0.5rem' }}>
        Выполнено: {completedCount} / {tasks.length}
      </p>
      <p style={{ margin: '0 0 0.75rem' }}>Статус: {status}</p>

      {shareEnabled && (
        <div className="page__actions" style={{ marginTop: 0, marginBottom: '0.75rem' }}>
          <button type="button" className="btn" onClick={shareToStory}>
            Share to Story
          </button>
          <button type="button" className="btn" onClick={shareInChat}>
            Share в чат
          </button>
        </div>
      )}

      {loading ? <p className="page__loading">Загружаем задания...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {!loading && tasks.length === 0 ? <p>Заданий пока нет.</p> : null}
      {tooltipTask ? (
        <BingoDescriptionTooltip
          title={tooltipTask.title}
          description={tooltipTask.description}
          onClose={() => setTooltipTask(null)}
        />
      ) : null}
      {tasks.length > 0 ? (
        <div className="bingo__grid">
          {tasks.map((task) => (
            <BingoTaskCard key={task.id} task={task} onToggleDescription={toggleDescription} />
          ))}
        </div>
      ) : null}
    </PageLayout>
  )
}
