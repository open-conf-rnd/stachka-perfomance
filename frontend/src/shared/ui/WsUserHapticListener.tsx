import { useEffect } from 'react'
import { apiRequest, type MeResponse } from '@/shared/lib/api'
import { triggerHaptic, type HapticPayload } from '@/shared/lib/haptic'
import { wsUrl } from '@/config'

interface WsHapticPayload {
  type: 'impact' | 'notification'
  style?: string
  notificationType?: string
}

/** Подписка на user-канал WS для получения целевой вибрации от админа */
export function WsUserHapticListener() {
  useEffect(() => {
    let ws: WebSocket | null = null

    void apiRequest<MeResponse>('/api/me')
      .then((me) => {
        const userId = me.user?.id
        if (!userId) return

        ws = new WebSocket(wsUrl)
        ws.onopen = () => {
          ws?.send(JSON.stringify({ type: 'subscribe', channel: `user:${userId}` }))
        }
        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data) as { type: string; payload?: WsHapticPayload }
            if (msg.type !== 'haptic:trigger' || !msg.payload) return
            triggerHaptic(msg.payload as HapticPayload)
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {})

    return () => {
      ws?.close()
    }
  }, [])

  return null
}
