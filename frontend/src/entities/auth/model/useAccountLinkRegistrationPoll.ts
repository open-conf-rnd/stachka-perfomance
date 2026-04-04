import { useEffect, useRef } from 'react'
import { apiRequest, type MeResponse } from '@/shared/lib/api'

const DEFAULT_POLL_MS = 3000

type PollArgs = {
  /** Ждём завершения привязки по сгенерированной ссылке */
  waiting: boolean
  deadlineMs: number | null
  onRegistered: () => void
  onWaitExpired: () => void
}

/**
 * Пуллинг `/api/me` после выдачи ссылки (VK→TG или TG→VK), пока не истечёт срок или не станет registered.
 */
export function useAccountLinkRegistrationPoll({
  waiting,
  deadlineMs,
  onRegistered,
  onWaitExpired,
}: PollArgs): void {
  const onRegisteredRef = useRef(onRegistered)
  const onWaitExpiredRef = useRef(onWaitExpired)
  onRegisteredRef.current = onRegistered
  onWaitExpiredRef.current = onWaitExpired

  useEffect(() => {
    if (!waiting || deadlineMs === null) return

    let cancelled = false
    let intervalId: number | undefined

    const stop = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId)
        intervalId = undefined
      }
    }

    const tick = async () => {
      if (cancelled) return
      if (Date.now() > deadlineMs) {
        onWaitExpiredRef.current()
        stop()
        return
      }
      try {
        const me = await apiRequest<MeResponse>('/api/me')
        if (cancelled) return
        if (me.registered) {
          onRegisteredRef.current()
          stop()
        }
      } catch {
        // сетевые сбои — следующий тик
      }
    }

    if (Date.now() > deadlineMs) {
      onWaitExpiredRef.current()
    } else {
      void tick()
      intervalId = window.setInterval(() => void tick(), DEFAULT_POLL_MS)
    }

    return () => {
      cancelled = true
      stop()
    }
  }, [waiting, deadlineMs])
}
