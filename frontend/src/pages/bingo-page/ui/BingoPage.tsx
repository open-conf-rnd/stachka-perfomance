import { Link } from 'react-router-dom'
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
    shareEnabled,
    completedCount,
    tooltipTask,
    setTooltipTask,
  } = useBehavior()

  const toggleDescription = (task: BingoTask) => {
    setTooltipTask(tooltipTask?.id === task.id ? null : task)
  }

  return (
    <PageLayout
      title="Бинго"
      subtitle={shareEnabled ? 'Карточка заданий; шаринг — на отдельной странице' : 'Карточка заданий'}
    >
      <p style={{ margin: '0 0 0.5rem' }}>
        Выполнено: {completedCount} / {tasks.length}
      </p>

      {shareEnabled ? (
        <p style={{ margin: '0 0 0.75rem' }}>
          <Link to="/bingo/share">Поделиться (Story / чат)</Link>
        </p>
      ) : null}

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
