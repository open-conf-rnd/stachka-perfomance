interface BingoDescriptionTooltipProps {
  title: string
  description?: string | null
  onClose: () => void
}

export function BingoDescriptionTooltip({ title, description, onClose }: BingoDescriptionTooltipProps) {
  return (
    <div
      className="bingo__tooltip-backdrop"
      onClick={onClose}
      role="button"
      tabIndex={-1}
      aria-label="Закрыть"
    >
      <div className="bingo__tooltip" onClick={(e) => e.stopPropagation()}>
        <div className="bingo__tooltip-title">{title}</div>
        <div className="bingo__tooltip-desc">{description}</div>
        <button type="button" className="btn bingo__tooltip-close" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  )
}
