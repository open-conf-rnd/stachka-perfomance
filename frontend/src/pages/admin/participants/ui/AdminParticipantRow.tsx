interface AdminParticipantRowProps {
  rank: number
  displayName: string
  completionsCount: number
}

export function AdminParticipantRow({ rank, displayName, completionsCount }: AdminParticipantRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.6rem 0.75rem',
        borderRadius: 8,
        background: 'color-mix(in srgb, currentColor 6%, transparent)',
        border: '1px solid color-mix(in srgb, currentColor 18%, transparent)',
      }}
    >
      <span>
        <strong>{rank}.</strong> {displayName}
      </span>
      <span style={{ fontWeight: 600 }}>{completionsCount}</span>
    </div>
  )
}
