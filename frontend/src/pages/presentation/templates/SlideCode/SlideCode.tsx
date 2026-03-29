import './SlideCode.css'

export interface SlideCodeLine {
  /** Текст строки (команда или код) */
  text: string
  /** Строка — комментарий (визуально приглушённая) */
  comment?: boolean
  /** Подсветить важную строку */
  highlight?: boolean
}

interface SlideCodeProps {
  /** Строки кода/команд. По клику показывается следующая строка (или группа, если задан fragmentIndexPerLine). */
  lines?: string[] | SlideCodeLine[]
  /** Нативный блок кода для reveal highlight plugin */
  code?: string
  /** Язык для нативного блока кода, например javascript/typescript/bash */
  language?: string
  /** Опциональный заголовок слайда */
  title?: string
  /** Размер шрифта кода (CSS font-size), например: "80px", "clamp(4rem, 8vmin, 120px)" */
  codeFontSize?: string
  /** Показывать строки по клику (fragment). false — весь код виден сразу */
  revealByClick?: boolean
  /** Индекс fragment для каждой строки (0, 1, 2…). Строки с одним индексом появляются одним блоком по клику. Длина массива = lines.length. */
  fragmentIndexPerLine?: number[]
  /** Выравнивание кода внутри блока по вертикали */
  codeVerticalAlign?: 'top' | 'center'
  /** Расширить pre-блок на всю ширину контейнера */
  preFullWidth?: boolean
}

function normalizeLines(lines: string[] | SlideCodeLine[]): SlideCodeLine[] {
  return lines.map((line) =>
    typeof line === 'string' ? { text: line, comment: false } : line
  )
}

export function SlideCode({
  lines,
  code,
  language,
  title,
  codeFontSize,
  revealByClick = true,
  fragmentIndexPerLine,
  codeVerticalAlign = 'center',
  preFullWidth = false,
}: SlideCodeProps) {
  const normalized = normalizeLines(lines ?? [])
  const codeClassName = `slide-code__code ${codeVerticalAlign === 'top' ? 'slide-code__code--top' : 'slide-code__code--center'}${
    language ? ` language-${language}` : ''
  }`

  return (
    <div className="slide-code">
      {title ? <h2 className="slide-code__title">{title}</h2> : null}
      <pre className={`slide-code__pre ${preFullWidth ? 'slide-code__pre--full' : ''}`}>
        {code !== undefined ? (
          <code
            className={codeClassName}
            data-trim
            data-noescape
            style={codeFontSize ? { fontSize: codeFontSize } : undefined}
          >
            {code}
          </code>
        ) : (
          <code
            className={codeClassName}
            style={codeFontSize ? { fontSize: codeFontSize } : undefined}
          >
            {normalized.map((line, index) => {
              const fragmentIndex = fragmentIndexPerLine && fragmentIndexPerLine[index] !== undefined
                ? fragmentIndexPerLine[index]
                : index
              const useFragment = revealByClick
              return (
                <div
                  key={index}
                  className={`slide-code__line ${line.comment ? 'slide-code__line--comment' : ''} ${line.highlight ? 'slide-code__line--highlight' : ''} ${useFragment ? 'fragment' : ''}`}
                  data-fragment-index={useFragment ? fragmentIndex : undefined}
                >
                  {line.text || '\u00A0'}
                </div>
              )
            })}
          </code>
        )}
      </pre>
    </div>
  )
}
