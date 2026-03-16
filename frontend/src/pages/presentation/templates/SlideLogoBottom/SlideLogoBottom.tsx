import { type ReactNode } from 'react'
import './SlideLogoBottom.css'

interface SlideLogoBottomProps {
  children: ReactNode
}

export function SlideLogoBottom({ children }: SlideLogoBottomProps) {
  return (
    <div className="slide-logo-bottom">
      <div className="slide-logo-bottom__content">{children}</div>
      <img
        src="/slides/logo_gray.png"
        alt="СТАЧКА"
        className="slide-logo-bottom__logo"
      />
    </div>
  )
}
