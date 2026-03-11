import { type ReactNode } from 'react'
import './SlideFrame.css'

interface SlideFrameProps {
  children: ReactNode
}

export function SlideFrame({ children }: SlideFrameProps) {
  return (
    <div className="slide-frame">
      <img
        src="/slides/logo.png"
        alt="СТАЧКА"
        className="slide-frame__logo"
      />
      <div className="slide-frame__content">{children}</div>
    </div>
  )
}
