interface AdminBingoTaskPreviewProps {
  title: string
  description?: string | null
}

export function AdminBingoTaskPreview({ title, description }: AdminBingoTaskPreviewProps) {
  return (
    <div
      style={{
        padding: '0.5rem 0.65rem',
        borderRadius: 8,
        background: 'color-mix(in srgb, currentColor 6%, transparent)',
        border: '1px solid color-mix(in srgb, currentColor 18%, transparent)',
        fontSize: '0.9rem',
      }}
    >
      <strong>{title}</strong>
      {description && <div style={{ opacity: 0.85, fontSize: '0.85rem' }}>{description}</div>}
    </div>
  )
}
