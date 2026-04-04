import './SlideFlow.css'

export interface SlideFlowStep {
  /** Короткая метка (например "Telegram", "Bot API") */
  label: string
  /** Описание шага */
  description: string
  /** Подпись на стрелке после этого блока (например "HTTPS", "DNS") */
  arrowLabel?: string
  /** Зона: "cloud" | "local" — визуально выделяет CLOUD / LOCALHOST */
  zone?: 'cloud' | 'local'
}

interface SlideFlowProps {
  title: string
  subtitle?: string
  /** Шаги цепочки. По клику показывается следующий блок (блок + стрелка). */
  steps: SlideFlowStep[]
  /** Показывать блоки по клику (fragment) */
  revealByClick?: boolean
  /** Размер шрифта метки блока (CSS font-size), например "clamp(1.6rem, 3.2vmin, 48px)" */
  blockLabelFontSize?: string
  /** Размер шрифта описания блока (CSS font-size), например "clamp(1.2rem, 2.4vmin, 32px)" */
  blockDescFontSize?: string
}

export function SlideFlow({
  title,
  subtitle,
  steps,
  revealByClick = true,
  blockLabelFontSize,
  blockDescFontSize,
}: SlideFlowProps) {
  return (
    <div className="slide-flow">
      <h2 className="slide-flow__title">{title}</h2>
      {subtitle ? <p className="slide-flow__subtitle">{subtitle}</p> : null}
      <div className="slide-flow__chain">
        {steps.map((step, index) => (
          <div key={index} className="slide-flow__step-wrap">
            {index > 0 ? (
              <div
                className={`slide-flow__arrow ${revealByClick ? 'fragment' : ''}`}
                data-fragment-index={revealByClick ? index : undefined}
              >
                <span className="slide-flow__arrow-line" />
                {step.arrowLabel ? (
                  <span className="slide-flow__arrow-label">{step.arrowLabel}</span>
                ) : null}
              </div>
            ) : null}
            <div
              className={`slide-flow__block ${step.zone ? `slide-flow__block--${step.zone}` : ''} ${revealByClick ? 'fragment' : ''}`}
              data-fragment-index={revealByClick ? index : undefined}
            >
              {step.zone ? (
                <span className="slide-flow__zone">{step.zone === 'cloud' ? 'CLOUD' : 'LOCALHOST'}</span>
              ) : null}
              <div
                className="slide-flow__block-label"
                style={blockLabelFontSize ? { fontSize: blockLabelFontSize } : undefined}
              >
                {step.label}
              </div>
              <div
                className="slide-flow__block-desc"
                style={blockDescFontSize ? { fontSize: blockDescFontSize } : undefined}
              >
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
