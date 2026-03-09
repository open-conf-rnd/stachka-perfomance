import { useEffect, useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { apiRequest, apiRequestWithNotifications } from '../lib/api'
import { wsUrl } from '../config'
import { notifyTelegramResult } from '../lib/telegramNotifications'

interface InvoiceResponse {
  invoiceUrl: string
  amount: number
  currency: string
}

interface SupportersResponse {
  supporters: Array<{
    userId: string
    firstName: string
    username: string | null
    paymentsCount: number
    totalAmount: number
    currency: string
  }>
  totalAmount: number
  totalPayments: number
  currency: string
}

export function SupportPage() {
  const [supporters, setSupporters] = useState<SupportersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [status, setStatus] = useState<string>('Готово')
  const [error, setError] = useState<string | null>(null)

  const loadSupporters = async () => {
    setError(null)
    try {
      const data = await apiRequest<SupportersResponse>('/api/payments/supporters')
      setSupporters(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить список поддержавших')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSupporters()

    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { type: string }
        if (msg.type === 'payment:success') {
          setStatus('Получен новый платеж')
          loadSupporters()
        }
      } catch {
        // ignore malformed ws messages
      }
    }
    return () => ws.close()
  }, [])

  const onSupport = async () => {
    setPaying(true)
    setError(null)
    try {
      console.info('[payments] creating invoice...')
      const invoice = await apiRequestWithNotifications<InvoiceResponse>(
        '/api/payments/invoice',
        'POST',
        undefined,
        {
          notifyOnSuccess: false,
          errorMessage: 'Не удалось создать инвойс',
        }
      )
      console.info('[payments] invoice created', {
        invoiceUrl: invoice.invoiceUrl,
        amount: invoice.amount,
        currency: invoice.currency,
      })
      const openInvoice = window.Telegram?.WebApp?.openInvoice
      if (!openInvoice) {
        setStatus('OpenInvoice недоступен, открой TMA в Telegram')
        console.warn('[payments] openInvoice unavailable')
        return
      }

      openInvoice(invoice.invoiceUrl, (paymentStatus) => {
        console.info('[payments] invoice callback', { paymentStatus, invoiceUrl: invoice.invoiceUrl })
        setStatus(`Статус оплаты: ${paymentStatus}`)
        if (paymentStatus === 'paid') {
          notifyTelegramResult('success', 'Оплата прошла, бинго-задание поддержки засчитано', 'Бинго')
          loadSupporters()
          return
        }
        if (paymentStatus === 'failed') {
          notifyTelegramResult('error', 'Оплата не прошла. Проверьте баланс Stars и повторите попытку.')
          return
        }
        if (paymentStatus === 'cancelled') {
          notifyTelegramResult('warning', 'Оплата отменена')
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать инвойс')
      console.error('[payments] invoice flow failed', err)
    } finally {
      setPaying(false)
    }
  }

  return (
    <PageLayout title="Поддержать доклад" subtitle="Telegram Stars">
      <p style={{ margin: '0 0 0.65rem' }}>Статус: {status}</p>
      <div className="page__actions">
        <button type="button" className="btn" onClick={onSupport} disabled={paying}>
          {paying ? 'Создаем счет...' : 'Поддержать ⭐'}
        </button>
        <button type="button" className="btn" onClick={loadSupporters} disabled={loading}>
          Обновить
        </button>
      </div>

      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {loading ? <p className="page__loading">Загружаем список поддержавших...</p> : null}

      {supporters ? (
        <div style={{ marginTop: '0.85rem' }}>
          <p style={{ margin: '0 0 0.5rem' }}>
            Всего: {supporters.totalAmount} {supporters.currency} ({supporters.totalPayments} платежей)
          </p>
          {supporters.supporters.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.82 }}>Пока никто не поддержал доклад.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {supporters.supporters.map((item, index) => (
                <div key={item.userId}>
                  {index + 1}. {item.firstName}
                  {item.username ? ` (@${item.username})` : ''}
                  {' — '}
                  {item.totalAmount} {item.currency}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </PageLayout>
  )
}
