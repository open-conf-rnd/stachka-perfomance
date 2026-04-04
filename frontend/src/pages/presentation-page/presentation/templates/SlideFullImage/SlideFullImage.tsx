import './SlideFullImage.css'

interface SlideFullImageProps {
  imageSrc: string
  alt?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export function SlideFullImage({
  imageSrc,
  alt = '',
  objectFit = 'cover',
}: SlideFullImageProps) {
  return (
    <div className="slide-full-image">
      <img
        src={imageSrc}
        alt={alt}
        className="slide-full-image__image"
        style={{ objectFit }}
      />
    </div>
  )
}
