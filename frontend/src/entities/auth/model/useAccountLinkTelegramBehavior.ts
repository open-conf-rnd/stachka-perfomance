import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLaunchParams } from '@telegram-apps/sdk-react'
import { apiRequest } from '@/lib/api'
import {
  COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY,
  PENDING_VK_LINK_TOKEN_KEY,
} from '@/lib/accountLinkStorage'
import { parseTelegramAccountLinkStartParam } from '@/entities/auth/lib/parseTelegramAccountLinkStartParam'
import { usePlatform } from '@/platform/PlatformContext'

/** Страница /account-link: токен из start_param/sessionStorage и завершение привязки VK↔TG. */
export function useAccountLinkTelegramBehavior() {
  const navigate = useNavigate()
  const launchParams = useLaunchParams()
  const platform = usePlatform()
  const [token, setToken] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (platform !== 'telegram') {
      navigate('/', { replace: true })
      return
    }
    const fromParam = parseTelegramAccountLinkStartParam(launchParams.startParam)
    const stored = sessionStorage.getItem(PENDING_VK_LINK_TOKEN_KEY)
    const raw = (stored && /^[a-f0-9]{32}$/i.test(stored) ? stored.toLowerCase() : null) || fromParam
    if (!raw) {
      navigate('/', { replace: true })
      setResolved(true)
      return
    }
    sessionStorage.setItem(PENDING_VK_LINK_TOKEN_KEY, raw)
    setToken(raw)
    setResolved(true)
  }, [platform, launchParams.startParam, navigate])

  const onLink = useCallback(async () => {
    if (!token) return
    setBusy(true)
    setError(null)
    try {
      await apiRequest('/api/auth/complete-account-link', 'POST', { token })
      sessionStorage.removeItem(PENDING_VK_LINK_TOKEN_KEY)
      const sp = launchParams.startParam ?? ''
      if (sp) sessionStorage.setItem(COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY, sp)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось связать аккаунт')
    } finally {
      setBusy(false)
    }
  }, [token, launchParams.startParam])

  return { resolved, token, busy, error, done, onLink, navigate }
}
