interface PollOption {
  id: string
  label: string
}

interface PollCardProps {
  question: string
  options: PollOption[]
  counts: Record<string, number>
  total: number
  disabled: boolean
  alreadyVoted: boolean
  onVote: (optionId: string) => void
}

export function PollCard({
  question,
  options,
  counts,
  total,
  disabled,
  alreadyVoted,
  onVote,
}: PollCardProps) {
  return (
    <div className="page__card">
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="btn"
            disabled={disabled}
            onClick={() => onVote(option.id)}
            style={{ textAlign: 'left' }}
          >
            {option.label} · {counts[option.id] ?? 0}
          </button>
        ))}
      </div>
      <div style={{ opacity: 0.8, marginTop: '0.5rem', fontSize: '0.85rem' }}>
        Всего голосов: {total}
        {alreadyVoted ? ' · ваш голос учтен' : ''}
      </div>
    </div>
  )
}
