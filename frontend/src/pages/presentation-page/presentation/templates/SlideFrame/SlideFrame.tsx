import { type ReactNode } from 'react'
import './SlideFrame.css'

export interface SlideFrameProps {
  children: ReactNode
  /** Дополнительный класс корня (например модификатор макета) */
  className?: string
  /** Блок в левом нижнем углу слайда (поверх подложки) */
  bottomLeft?: ReactNode
}

export function SlideFrame({ children, className, bottomLeft }: SlideFrameProps) {
  const rootClass = ['slide-frame', className].filter(Boolean).join(' ')

  return (
    <div className={rootClass}>
      <img
        src="/slides/logo.png"
        alt="СТАЧКА"
        className="slide-frame__logo"
      />
      <div className="slide-frame__content">{children}</div>
      {bottomLeft ? (
        <div className="slide-frame__bottom-left">{bottomLeft}</div>
      ) : null}
    </div>
  )
}
