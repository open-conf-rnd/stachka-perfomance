import { useEffect, useRef, useState } from 'react'
import { wsUrl } from '../../../config'
import './QrVerifiedNotificationsOverlay.css'

interface QrVerifiedPayload {
  user?: {
    firstName?: string
    username?: string | null
  }
  alreadyCompleted?: boolean
}

interface QrSlideNotification {
  id: number
  text: string
}

export function QrVerifiedNotificationsOverlay() {
  const [notifications, setNotifications] = useState<QrSlideNotification[]>([])
  const nextNotificationIdRef = useRef(1)
  const timeoutIdsRef = useRef<number[]>([])

  useEffect(() => {
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { type: string; payload?: QrVerifiedPayload }
        if (msg.type !== 'qr:verified' || !msg.payload) return

        const userLabel =
          msg.payload.user?.firstName ||
          (msg.payload.user?.username ? `@${msg.payload.user.username}` : 'Участник')
        const suffix = msg.payload.alreadyCompleted ? 'уже выполнял(а) это задание' : 'выполнил(а) задание'
        const text = `✅ ${userLabel} ${suffix}`

        const id = nextNotificationIdRef.current++
        setNotifications((prev) => [{ id, text }, ...prev].slice(0, 5))

        const timeoutId = window.setTimeout(() => {
          setNotifications((prev) => prev.filter((item) => item.id !== id))
        }, 9000)
        timeoutIdsRef.current.push(timeoutId)
      } catch {
        // ignore malformed ws messages
      }
    }

    return () => {
      ws.close()
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id))
      timeoutIdsRef.current = []
    }
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="presentation-qr-notifications-overlay" aria-live="polite">
      {notifications.map((notification) => (
        <div key={notification.id} className="presentation-qr-notification">
          {notification.text}
        </div>
      ))}
    </div>
  )
}
