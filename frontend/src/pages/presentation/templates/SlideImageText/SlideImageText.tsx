import { type ReactNode } from 'react'
import './SlideImageText.css'

interface SlideImageTextProps {
  title: string
  description: string
  imageSrc: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none'
  imageContent?: ReactNode
}

export function SlideImageText({
  title,
  description,
  imageSrc,
  objectFit = 'contain',
  imageContent,
}: SlideImageTextProps) {
  return (
    <div className="slide-image-text">
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
