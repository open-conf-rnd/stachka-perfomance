import { QRCodeSVG } from 'qrcode.react'
import './QrTaskSlide.css'

const PRESENTATION_TASK_QR_CODE = 'stachka-bingo-presentation-qr'

export function QrTaskSlide() {
  return (
    <>
      <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(2.4rem, 4.4vmin, 72px)' }}>
        Сканируй QR в мини-аппе
      </h2>
      <p style={{ margin: '0 0 1.5rem', fontSize: 'clamp(1.3rem, 2.3vmin, 34px)' }}>
        Открой экран сканера и наведи камеру на код
      </p>

      <QRCodeSVG
        value={PRESENTATION_TASK_QR_CODE}
        size={760}
        level="M"
        bgColor="transparent"
        fgColor="#1a1a1a"
      />
    </>
  )
}
