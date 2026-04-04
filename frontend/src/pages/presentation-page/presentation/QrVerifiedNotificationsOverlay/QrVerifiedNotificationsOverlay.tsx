import { useEffect, useRef, useState } from 'react'
import { subscribePresentationWs } from '@/shared/lib/presentationWs'
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
    const unsubscribe = subscribePresentationWs((msg) => {
      if (msg.type !== 'qr:verified' || !msg.payload) return

      const payload = msg.payload as QrVerifiedPayload
      const userLabel =
        payload.user?.firstName ||
        (payload.user?.username ? `@${payload.user.username}` : 'Участник')
      const suffix = payload.alreadyCompleted ? 'уже выполнял(а) это задание' : 'выполнил(а) задание'
      const text = `✅ ${userLabel} ${suffix}`

      const id = nextNotificationIdRef.current++
      setNotifications((prev) => [{ id, text }, ...prev].slice(0, 5))

      const timeoutId = window.setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== id))
      }, 9000)
      timeoutIdsRef.current.push(timeoutId)
    })

    return () => {
      unsubscribe()
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
