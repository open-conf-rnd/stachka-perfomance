import { useEffect } from 'react'
import { useLaunchParams } from '@telegram-apps/sdk-react'
import { useNavigate } from 'react-router-dom'
import {
  COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY,
  PENDING_VK_LINK_TOKEN_KEY,
} from '@/lib/accountLinkStorage'
import { parseTelegramAccountLinkStartParam } from '../lib/parseTelegramAccountLinkStartParam'
import { completeAccountLink } from '../requests/authRequests'
import { usePlatform } from '@/platform/PlatformContext'

const PENDING_LOCK_MAX_MS = 90_000

function autorunStorageKey(token: string): string {
  return `stachka_tg_al_autorun_${token}`
}

export type AccountLinkAutoFlowOptions = {
  /** После успешного complete-account-link, до перехода на главную */
  onLinkedSuccess?: () => void
}

/**
 * VK→Telegram: при открытии мини-приложения по ссылке `?startapp=al{token}` читает start_param,
 * вызывает `/api/auth/complete-account-link` с initData Telegram и переносит на главную при успехе.
 */
export function useTelegramVkAccountLinkFromStartParam(options?: AccountLinkAutoFlowOptions): void {
  const navigate = useNavigate()
  const launchParams = useLaunchParams()
  const platform = usePlatform()
  const onLinkedSuccess = options?.onLinkedSuccess

  useEffect(() => {
    if (platform !== 'telegram') return

    const sp = launchParams.startParam
    if (!sp) return
    if (sessionStorage.getItem(COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY) === sp) return

    const token = parseTelegramAccountLinkStartParam(sp)
    if (!token) return

    const lockKey = autorunStorageKey(token)
    const lockVal = sessionStorage.getItem(lockKey)
    if (lockVal === 'ok') return
    if (lockVal?.startsWith('pending:')) {
      const ts = Number(lockVal.slice('pending:'.length))
      if (Number.isFinite(ts) && Date.now() - ts < PENDING_LOCK_MAX_MS) return
    }

    sessionStorage.setItem(lockKey, `pending:${Date.now()}`)

    completeAccountLink(token)
      .then(() => {
        sessionStorage.setItem(lockKey, 'ok')
        sessionStorage.removeItem(PENDING_VK_LINK_TOKEN_KEY)
        sessionStorage.setItem(COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY, sp)
        onLinkedSuccess?.()
        navigate('/', { replace: true })
      })
      .catch(() => {
        sessionStorage.removeItem(lockKey)
        navigate('/account-link', { replace: true })
      })
  }, [platform, launchParams.startParam, navigate, onLinkedSuccess])
}
