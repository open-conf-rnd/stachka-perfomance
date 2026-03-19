import './SlideProsCons.css'

interface SlideProsConsProps {
  /** Заголовок подхода (например "ngrok" или "Docker + Nginx") */
  title: string
  /** Плюсы */
  pros: string[]
  /** Минусы */
  cons: string[]
  /** Показывать пункты по клику */
  revealByClick?: boolean
  /** Размер шрифта заголовка слайда (CSS font-size) */
  titleFontSize?: string
  /** Размер шрифта заголовков колонок «Плюсы»/«Минусы» (CSS font-size) */
  columnTitleFontSize?: string
  /** Размер шрифта пунктов списка (CSS font-size) */
  itemFontSize?: string
}

export function SlideProsCons({
  title,
  pros,
  cons,
  revealByClick = true,
  titleFontSize,
  columnTitleFontSize,
  itemFontSize,
}: SlideProsConsProps) {
  return (
    <div className="slide-pros-cons">
      <h2
        className="slide-pros-cons__title"
        style={titleFontSize ? { fontSize: titleFontSize } : undefined}
      >
        {title} — плюсы и минусы
      </h2>
      <div className="slide-pros-cons__grid">
        <div className="slide-pros-cons__column slide-pros-cons__column--pros">
          <h3
            className="slide-pros-cons__column-title"
            style={columnTitleFontSize ? { fontSize: columnTitleFontSize } : undefined}
          >
            Плюсы
          </h3>
          <ul className="slide-pros-cons__list">
            {pros.map((text, index) => (
              <li
                key={index}
                className={`slide-pros-cons__item ${revealByClick ? 'fragment' : ''}`}
                data-fragment-index={revealByClick ? index : undefined}
                style={itemFontSize ? { fontSize: itemFontSize } : undefined}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="slide-pros-cons__column slide-pros-cons__column--cons">
          <h3
            className="slide-pros-cons__column-title"
            style={columnTitleFontSize ? { fontSize: columnTitleFontSize } : undefined}
          >
            Минусы
          </h3>
          <ul className="slide-pros-cons__list">
            {cons.map((text, index) => (
              <li
                key={index}
                className={`slide-pros-cons__item ${revealByClick ? 'fragment' : ''}`}
                data-fragment-index={revealByClick ? pros.length + index : undefined}
                style={itemFontSize ? { fontSize: itemFontSize } : undefined}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
