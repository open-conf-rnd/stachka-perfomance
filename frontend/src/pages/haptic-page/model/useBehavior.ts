import { useEffect, useState } from 'react'
import { apiRequestWithNotifications } from '@/shared/lib/api'
import { triggerHaptic } from '@/shared/lib/haptic'
import { wsUrl } from '@/config'

export type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
export type NotificationType = 'success' | 'warning' | 'error'

interface HapticTriggerMessage {
  type: 'impact' | 'notification'
  style?: ImpactStyle
  notificationType?: NotificationType
}

export function useBehavior() {
  const [status, setStatus] = useState<string>('Готово')

  useEffect(() => {
    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { type: string; payload?: HapticTriggerMessage }
        if (msg.type !== 'haptic:trigger' || !msg.payload) return
        const ok = triggerHaptic(msg.payload as HapticTriggerMessage)
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
    void apiRequestWithNotifications('/api/haptic/track', 'POST', { type: 'impact', style }, {
      notifyOnSuccess: false,
      notifyOnError: false,
    }).catch(() => {})
  }

  const runNotification = (notificationType: NotificationType) => {
    const ok = triggerHaptic({ type: 'notification', notificationType })
    setStatus(ok ? `Notification: ${notificationType}` : 'Haptic недоступен в текущей среде')
    void apiRequestWithNotifications(
      '/api/haptic/track',
      'POST',
      {
        type: 'notification',
        notificationType,
      },
      {
        notifyOnSuccess: false,
        notifyOnError: false,
      }
    ).catch(() => {})
  }

  return { status, runImpact, runNotification }
}
