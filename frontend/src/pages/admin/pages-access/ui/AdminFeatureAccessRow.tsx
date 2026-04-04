interface AdminFeatureAccessRowProps {
  title: string
  desc: string
  enabled: boolean
  pending: boolean
  onToggle: () => void
}

export function AdminFeatureAccessRow({
  title,
  desc,
  enabled,
  pending,
  onToggle,
}: AdminFeatureAccessRowProps) {
  return (
    <div
      style={{
        padding: '0.6rem 0.75rem',
        borderRadius: 8,
        border: '1px solid color-mix(in srgb, currentColor 18%, transparent)',
        background: 'color-mix(in srgb, currentColor 6%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <strong>{title}</strong>
        <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>{desc}</span>
      </div>
      <button
        type="button"
        className={enabled ? 'btn' : 'btn btn--primary'}
        disabled={pending}
        onClick={onToggle}
      >
        {pending ? '...' : enabled ? 'Закрыть' : 'Открыть'}
      </button>
    </div>
  )
}
