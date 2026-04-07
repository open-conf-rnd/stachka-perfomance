import { SlideFrame } from '../templates/SlideFrame'
import './TitleSlide.css'

const EVENT_DATE_PLACE = '10–11 апреля 2026  Ульяновск  Разработка'

export function TitleSlide() {
  return (
    <SlideFrame
      className="slide-frame--title"
      bottomLeft={<p className="title-slide__meta">{EVENT_DATE_PLACE}</p>}
    >
      <div className="title-slide">
        <h1 className="title-slide__title">
          Пишем помощника для вашего хобби на Telegram mini Apps
        </h1>
      </div>
    </SlideFrame>
  )
}
