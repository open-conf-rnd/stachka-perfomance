import { SlideFrame } from '../templates/SlideFrame'
import './TitleSlide.css'

export function TitleSlide() {
  return (
    <SlideFrame>
      <h1 className="title-slide__title">
        Пишем помощника для вашего хобби на Telegram mini Apps
      </h1>
    </SlideFrame>
  )
}
