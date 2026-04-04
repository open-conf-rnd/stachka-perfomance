import { PageLayout } from '@/components/PageLayout'
import { useBehavior } from '../model'
import './QrVerifyPage.css'

export function QrVerifyPage() {
  const { status, error, scanning, handleScanQr } = useBehavior()

  return (
    <PageLayout title="Сканировать QR" subtitle="Отметь задание бинго по QR-коду">
      <div className="qr-verify__content">
        <div className="qr-verify__illustration" aria-hidden>
          📷
        </div>
        <p className="qr-verify__text">
          Нажми кнопку и наведи камеру на QR-код с задания бинго.
        </p>
        {status ? <p style={{ margin: '0 0 0.5rem', opacity: 0.9 }}>{status}</p> : null}
        {error ? <p className="page__error">{error}</p> : null}
        <button
          type="button"
          className="btn btn--primary qr-verify__btn"
          onClick={handleScanQr}
          disabled={scanning}
        >
          {scanning ? 'Сканирую...' : 'Сканировать QR'}
        </button>
      </div>
    </PageLayout>
  )
}
