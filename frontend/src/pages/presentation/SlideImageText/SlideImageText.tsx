import './SlideImageText.css'

interface SlideImageTextProps {
  title: string
  description: string
  imageSrc: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none'
}

export function SlideImageText({
  title,
  description,
  imageSrc,
  objectFit = 'contain',
}: SlideImageTextProps) {
  return (
    <div className="slide-image-text">
      <div className="slide-image-text__text">
        <h2 className="slide-image-text__title">{title}</h2>
        <p className="slide-image-text__description">{description}</p>
      </div>
      <div className="slide-image-text__image-container">
        <img
          src={imageSrc}
          alt=""
          className="slide-image-text__image"
          style={{ objectFit }}
        />
      </div>
    </div>
  )
}
