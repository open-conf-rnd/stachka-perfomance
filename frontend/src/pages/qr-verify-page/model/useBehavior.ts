import { useState } from 'react'
import { useQRScanner } from '@telegram-apps/sdk-react'
import { apiRequest } from '@/shared/lib/api'
import { notifyTelegramResult } from '@/shared/lib/telegramNotifications'
import { setBingoStartParamConsumed } from '@/shared/lib/telegramCloudStorage'

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

export function useBehavior() {
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

  return { status, error, scanning, handleScanQr }
}
