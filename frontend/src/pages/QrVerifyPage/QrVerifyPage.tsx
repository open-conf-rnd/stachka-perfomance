import { useState } from 'react'
import { useQRScanner } from '@telegram-apps/sdk-react'
import { PageLayout } from '../../components/PageLayout'
import { apiRequestWithNotifications } from '../../lib/api'
import './QrVerifyPage.css'

export function QrVerifyPage() {
  const qrScanner = useQRScanner()
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  const handleScanQr = async () => {
    if (!qrScanner.supports('open')) {
      setError('Сканер QR доступен только в Telegram')
      return
    }
    setError(null)
    setStatus('Открываю сканер...')
    setScanning(true)
    try {
      const content = await qrScanner.open({ text: 'Наведи на QR-код задания' })
      setScanning(false)
      if (!content) {
        setStatus('Сканирование отменено')
        return
      }
      setStatus('Проверяю код...')
      await apiRequestWithNotifications<{ success: boolean; alreadyCompleted: boolean }>(
        '/api/qr/verify',
        'POST',
        { code: content.trim() },
        {
          popupTitle: 'Бинго',
          successMessage: 'QR задание бинго засчитано',
          errorMessage: 'Не удалось проверить QR',
        }
      )
      setStatus('Задание отмечено')
    } catch (err) {
      setScanning(false)
      setError(err instanceof Error ? err.message : 'Не удалось проверить QR')
      setStatus('')
    }
  }

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
