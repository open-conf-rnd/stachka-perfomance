import './SlideCode.css'

export interface SlideCodeLine {
  /** Текст строки (команда или код) */
  text: string
  /** Строка — комментарий (визуально приглушённая) */
  comment?: boolean
}

interface SlideCodeProps {
  /** Строки кода/команд. По клику показывается следующая строка. */
  lines: string[] | SlideCodeLine[]
  /** Опциональный заголовок слайда */
  title?: string
  /** Размер шрифта кода (CSS font-size), например: "80px", "clamp(4rem, 8vmin, 120px)" */
  codeFontSize?: string
}

function normalizeLines(lines: string[] | SlideCodeLine[]): SlideCodeLine[] {
  return lines.map((line) =>
    typeof line === 'string' ? { text: line, comment: false } : line
  )
}

export function SlideCode({ lines, title, codeFontSize }: SlideCodeProps) {
  const normalized = normalizeLines(lines)

  return (
    <div className="slide-code">
      {title ? <h2 className="slide-code__title">{title}</h2> : null}
      <pre className="slide-code__pre">
        <code
          className="slide-code__code"
          style={codeFontSize ? { fontSize: codeFontSize } : undefined}
        >
          {normalized.map((line, index) => (
            <div
              key={index}
              className={`slide-code__line ${line.comment ? 'slide-code__line--comment' : ''} fragment`}
              data-fragment-index={index}
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
