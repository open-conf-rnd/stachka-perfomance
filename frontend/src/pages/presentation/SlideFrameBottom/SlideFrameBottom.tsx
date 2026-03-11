import { type ReactNode } from 'react'
import './SlideFrameBottom.css'

interface SlideFrameBottomProps {
  children: ReactNode
}

export function SlideFrameBottom({ children }: SlideFrameBottomProps) {
  return (
    <div className="slide-frame-bottom">
      <div className="slide-frame-bottom__content">{children}</div>
      <img
        src="/slides/logo_gray.png"
        alt="СТАЧКА"
        className="slide-frame-bottom__logo"
      />
    </div>
  )
}
