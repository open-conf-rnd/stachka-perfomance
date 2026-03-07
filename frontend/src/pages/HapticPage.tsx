import { useEffect, useState } from 'react'
import { PageLayout } from '../components/PageLayout'
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

  const runImpact = (style: ImpactStyle) => {
    const ok = triggerHaptic({ type: 'impact', style })
    setStatus(ok ? `Impact: ${style}` : 'Haptic недоступен в текущей среде')
  }

  const runNotification = (notificationType: NotificationType) => {
    const ok = triggerHaptic({ type: 'notification', notificationType })
    setStatus(ok ? `Notification: ${notificationType}` : 'Haptic недоступен в текущей среде')
  }

  return (
    <PageLayout title="Вибрации" subtitle="Демо Haptic API Telegram">
      <p style={{ margin: '0 0 0.75rem' }}>Статус: {status}</p>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.45rem' }}>Impact</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button type="button" className="btn" onClick={() => runImpact('light')}>light</button>
          <button type="button" className="btn" onClick={() => runImpact('medium')}>medium</button>
          <button type="button" className="btn" onClick={() => runImpact('heavy')}>heavy</button>
          <button type="button" className="btn" onClick={() => runImpact('rigid')}>rigid</button>
          <button type="button" className="btn" onClick={() => runImpact('soft')}>soft</button>
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 700, marginBottom: '0.45rem' }}>Notification</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button type="button" className="btn" onClick={() => runNotification('success')}>success</button>
          <button type="button" className="btn" onClick={() => runNotification('warning')}>warning</button>
          <button type="button" className="btn" onClick={() => runNotification('error')}>error</button>
        </div>
      </div>
    </PageLayout>
  )
}
