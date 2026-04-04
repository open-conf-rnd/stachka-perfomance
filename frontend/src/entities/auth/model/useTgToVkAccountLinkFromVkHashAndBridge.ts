import { useEffect } from 'react'
import bridge from '@vkontakte/vk-bridge'
import type { VKBridgeSubscribeHandler } from '@vkontakte/vk-bridge'
import { useNavigate } from 'react-router-dom'
import {
  COMPLETED_VK_TG_ACCOUNT_LINK_TOKEN_KEY,
  peekAccountLinkTokenFromLocation,
  peekAccountLinkTokenFromVkBridgeLocation,
  stripAccountLinkHashFromLocation,
} from '@/shared/lib/accountLinkStorage'
import { completeAccountLink } from '../requests/authRequests'
import type { AccountLinkAutoFlowOptions } from './useTelegramVkAccountLinkFromStartParam'
import { usePlatform } from '@/shared/lib/platform/PlatformContext'

const PENDING_LOCK_MAX_MS = 90_000

function autorunStorageKey(token: string): string {
  return `stachka_vk_tg_autorun_${token}`
}

/**
 * Telegram→VK: в мини-приложении VK читает `account_link` из hash URL (как в ссылке из Telegram)
 * и из событий моста `VKWebAppLocationChanged` / `VKWebAppChangeFragment` (`data.location`),
 * затем вызывает `/api/auth/complete-account-link` и переносит на главную.
 */
export function useTgToVkAccountLinkFromVkHashAndBridge(options?: AccountLinkAutoFlowOptions): void {
  const navigate = useNavigate()
  const platform = usePlatform()
  const onLinkedSuccess = options?.onLinkedSuccess

  useEffect(() => {
    if (platform !== 'vk') return

    const tryLink = (token: string) => {
      if (sessionStorage.getItem(COMPLETED_VK_TG_ACCOUNT_LINK_TOKEN_KEY) === token) return

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
          sessionStorage.setItem(COMPLETED_VK_TG_ACCOUNT_LINK_TOKEN_KEY, token)
          stripAccountLinkHashFromLocation()
          onLinkedSuccess?.()
          navigate('/', { replace: true })
        })
        .catch(() => {
          sessionStorage.removeItem(lockKey)
          navigate('/register', { replace: true })
        })
    }

    const fromUrl = peekAccountLinkTokenFromLocation()
    if (fromUrl) tryLink(fromUrl)

    const handler: VKBridgeSubscribeHandler = (event) => {
      const { type, data } = event.detail
      if (type !== 'VKWebAppLocationChanged' && type !== 'VKWebAppChangeFragment') return
      if (!data || typeof data !== 'object' || !('location' in data)) return
      const loc = (data as { location: string }).location
      const t = peekAccountLinkTokenFromVkBridgeLocation(loc)
      if (t) tryLink(t)
    }

    bridge.subscribe(handler)
    return () => bridge.unsubscribe(handler)
  }, [platform, navigate, onLinkedSuccess])
}
