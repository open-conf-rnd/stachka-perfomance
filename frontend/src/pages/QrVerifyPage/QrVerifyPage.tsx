import { useState } from 'react'
import { useQRScanner } from '@telegram-apps/sdk-react'
import { PageLayout } from '../../components/PageLayout'
import { apiRequest } from '../../lib/api'
import { notifyTelegramResult } from '../../lib/telegramNotifications'
import { setBingoStartParamConsumed } from '../../lib/telegramCloudStorage'
import './QrVerifyPage.css'

function clearLaunchParamsFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('tgWebAppStartParam')
  url.searchParams.delete('startapp')
  url.searchParams.delete('startattach')
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}

interface VerifyQrResponse {
  success: boolean
  alreadyCompleted?: boolean
  feedbackSent?: boolean
}

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
      const response = await apiRequest<VerifyQrResponse>(
        '/api/qr/verify',
        'POST',
        { code: content.trim() }
      )
      if (response.feedbackSent) {
        notifyTelegramResult(
          'success',
          'Ссылка на форму отправлена вам в бота',
          'Обратная связь'
        )
        setStatus('Отправили ссылку на форму в бот')
      } else {
        notifyTelegramResult('success', 'QR задание бинго засчитано', 'Бинго')
        setStatus('Задание отмечено')
      }
      await setBingoStartParamConsumed()
      clearLaunchParamsFromUrl()
    } catch (err) {
      setScanning(false)
      setError(err instanceof Error ? err.message : 'Не удалось проверить QR')
      notifyTelegramResult('error', 'Не удалось проверить QR', 'Бинго')
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
