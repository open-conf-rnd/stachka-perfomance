import { type CSSProperties, type ReactNode } from 'react'
import './SlideImageText.css'

interface SlideImageTextProps {
  title: string
  description: string
  imageSrc: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none'
  imageContent?: ReactNode
  titleScale?: number
  descriptionScale?: number
}

export function SlideImageText({
  title,
  description,
  imageSrc,
  objectFit = 'contain',
  imageContent,
  titleScale,
  descriptionScale,
}: SlideImageTextProps) {
  const rootStyle: CSSProperties & Record<string, string> = {}
  if (typeof titleScale === 'number') {
    rootStyle['--slide-image-text-title-scale' as string] = String(titleScale)
  }
  if (typeof descriptionScale === 'number') {
    rootStyle['--slide-image-text-description-scale' as string] = String(descriptionScale)
  }

  return (
    <div className="slide-image-text" style={rootStyle}>
      <div className="slide-image-text__text">
        <h2 className="slide-image-text__title">{title}</h2>
        <p className="slide-image-text__description">{description}</p>
      </div>
      <div className="slide-image-text__image-container">
        {imageContent ?? (
          <img
            src={imageSrc}
            alt=""
            className="slide-image-text__image"
            style={{ objectFit }}
          />
        )}
      </div>
    </div>
  )
}
