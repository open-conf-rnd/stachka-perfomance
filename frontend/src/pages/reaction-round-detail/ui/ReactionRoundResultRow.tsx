interface ReactionRoundResultRowProps {
  place: number
  firstName: string
  username?: string | null
  timeLabel: string
}

export function ReactionRoundResultRow({
  place,
  firstName,
  username,
  timeLabel,
}: ReactionRoundResultRowProps) {
  return (
    <div
      style={{
        padding: '0.5rem 0.75rem',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{place}.</span>
      {firstName}
      {username ? ` (@${username})` : ''}
      <span style={{ opacity: 0.8, marginLeft: '0.5rem', fontSize: '0.9rem' }}>— {timeLabel}</span>
    </div>
  )
}
