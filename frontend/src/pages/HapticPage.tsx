import { useEffect, useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { apiRequest } from '../lib/api'
import { wsUrl } from '../config'

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
type NotificationType = 'success' | 'warning' | 'error'

interface HapticTriggerMessage {
  type: 'impact' | 'notification'
  style?: ImpactStyle
  notificationType?: NotificationType
}

function triggerHaptic(payload: HapticTriggerMessage) {
  const haptic = window.Telegram?.WebApp?.HapticFeedback
  if (!haptic) return false

  if (payload.type === 'impact') {
    haptic.impactOccurred?.(payload.style ?? 'medium')
    return true
  }

  haptic.notificationOccurred?.(payload.notificationType ?? 'success')
  return true
}

export function HapticPage() {
  const [status, setStatus] = useState<string>('Готово')

  useEffect(() => {
    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { type: string; payload?: HapticTriggerMessage }
        if (msg.type !== 'haptic:trigger' || !msg.payload) return
        const ok = triggerHaptic(msg.payload)
        setStatus(ok ? 'Получена массовая вибрация' : 'Haptic недоступен в текущей среде')
      } catch {
        // ignore malformed ws messages
      }
    }
    return () => ws.close()
  }, [])

  const impactStyles: ImpactStyle[] = ['light', 'medium', 'heavy', 'rigid', 'soft']
  const impactLabels: Record<ImpactStyle, string> = {
    light: 'Лёгкая',
    medium: 'Средняя',
    heavy: 'Сильная',
    rigid: 'Жёсткая',
    soft: 'Мягкая',
  }
  const notificationLabels: Record<NotificationType, string> = {
    success: 'Успех',
    warning: 'Предупреждение',
    error: 'Ошибка',
  }
  const impactColors = [
    '#22c55e', // light — зелёный
    '#84cc16', // medium — лайм
    '#eab308', // heavy — жёлтый
    '#f97316', // rigid — оранжевый
    '#ef4444', // soft — красный
  ] as const
  const impactPaddings = ['0.4rem 0.65rem', '0.55rem 0.8rem', '0.75rem 1rem', '0.9rem 1.2rem', '0.65rem 0.9rem'] as const
  const impactFontSizes = ['0.8rem', '0.88rem', '1rem', '1.1rem', '0.9rem'] as const

  const runImpact = (style: ImpactStyle) => {
    const ok = triggerHaptic({ type: 'impact', style })
    setStatus(ok ? `Impact: ${style}` : 'Haptic недоступен в текущей среде')
    void apiRequest('/api/haptic/track', 'POST', { type: 'impact', style }).catch(() => {})
  }

  const runNotification = (notificationType: NotificationType) => {
    const ok = triggerHaptic({ type: 'notification', notificationType })
    setStatus(ok ? `Notification: ${notificationType}` : 'Haptic недоступен в текущей среде')
    void apiRequest('/api/haptic/track', 'POST', {
      type: 'notification',
      notificationType,
    }).catch(() => {})
  }

  const notificationColors: Record<NotificationType, string> = {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  }

  return (
    <PageLayout title="Вибрации" subtitle="Демо Haptic API Telegram">
      <p style={{ margin: '0 0 0.75rem' }}>Статус: {status}</p>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.45rem' }}>Impact</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {impactStyles.map((style, i) => (
            <button
              key={style}
              type="button"
              className="btn haptic__impact-btn"
              onClick={() => runImpact(style)}
              style={{
                background: impactColors[i],
                borderColor: impactColors[i],
                padding: impactPaddings[i],
                fontSize: impactFontSizes[i],
              }}
            >
              {impactLabels[style]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 700, marginBottom: '0.45rem' }}>Notification</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(['success', 'warning', 'error'] as const).map((notificationType) => (
            <button
              key={notificationType}
              type="button"
              className="btn haptic__notification-btn"
              onClick={() => runNotification(notificationType)}
              style={{
                background: notificationColors[notificationType],
                borderColor: notificationColors[notificationType],
              }}
            >
              {notificationLabels[notificationType]}
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
