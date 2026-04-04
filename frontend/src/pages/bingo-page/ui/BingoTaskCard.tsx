import type { BingoTask } from '@/entities/bingo'

interface BingoTaskCardProps {
  task: BingoTask
  onToggleDescription: (task: BingoTask) => void
}

export function BingoTaskCard({ task, onToggleDescription }: BingoTaskCardProps) {
  const completed = Boolean(task.completed)
  const hasDescription = Boolean(task.description)

  return (
    <div
      role="button"
      tabIndex={0}
      className={`bingo__card ${completed ? 'bingo__card--completed' : ''} ${hasDescription ? 'bingo__card--clickable' : ''}`}
      title={task.title}
      onClick={() => {
        if (hasDescription) onToggleDescription(task)
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && hasDescription) {
          e.preventDefault()
          onToggleDescription(task)
        }
      }}
    >
      <div className="bingo__card-title">{task.title}</div>
    </div>
  )
}
