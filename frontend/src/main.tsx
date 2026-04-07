import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { mockTelegramEnv } from '@telegram-apps/sdk'
import { SDKProvider } from '@telegram-apps/sdk-react'
import App from './App'
import { captureVkLaunchParamsFromUrl, getVkLaunchParamsForHeaders } from '@/shared/lib/authHeaders'
import { peekAccountLinkTokenFromLocation } from '@/shared/lib/accountLinkStorage'
import { initVkBridge } from '@/shared/lib/vkBridgeClient'
import './index.css'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string
        /** Распарсенные поля initData; start_param — из ?startapp=… */
        initDataUnsafe?: {
          start_param?: string
        }
        ready?: () => void
        openTelegramLink?: (url: string) => void
        shareToStory?: (
          mediaUrl: string,
          params?: {
            text?: string
            widget_link?: {
              url: string
              name?: string
            }
          }
        ) => void
        HapticFeedback?: {
          impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred?: (type: 'success' | 'warning' | 'error') => void
        }
        BackButton?: {
          show?: () => void
          hide?: () => void
          onClick?: (handler: () => void) => void
          offClick?: (handler: () => void) => void
        }
        /** Bot API 6.9+; облако Telegram для пары ключ–значение на пользователя */
        CloudStorage?: {
          setItem?: (
            key: string,
            value: string,
            callback?: (error: string | null, success?: boolean) => void
          ) => unknown
          getItem?: (
            key: string,
            callback: (error: string | null, value?: string) => void
          ) => unknown
        }
        /** Bot API 7.7+ — свайп вниз сворачивает мини‑апп; для игр со свайпами отключать на экране */
        isVerticalSwipesEnabled?: boolean
        disableVerticalSwipes?: () => void
        enableVerticalSwipes?: () => void
      }
    }
  }
}
captureVkLaunchParamsFromUrl()

const isInsideTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initData

// В VK / обычном браузере нет tg initData, но хуки SDK (useLaunchParams, useThemeParams) всё равно нужны —
// иначе «Unable to retrieve launch parameters». Реальная авторизация VK идёт через x-vk-launch-params (authHeaders).
if (!isInsideTelegram) {
  try {
    mockTelegramEnv({
      version: '7.0',
      platform: 'web',
      themeParams: {
        bgColor: '#1c1c1e',
        textColor: '#ffffff',
      },
    })
  } catch (err) {
    // В iframe VK родитель — vk.com (cross-origin): SDK пытается присвоить window.parent.postMessage → SecurityError.
    // До этого mockTelegramEnv уже кладёт tgWebApp* в sessionStorage — этого достаточно для retrieveLaunchParams.
    if (import.meta.env.DEV && err instanceof Error && err.name !== 'SecurityError') {
      console.warn('[mockTelegramEnv]', err)
    }
  }
}

const hasVkLaunch = typeof window !== 'undefined' && getVkLaunchParamsForHeaders().length > 0
const hasTgToVkAccountLinkInUrl =
  typeof window !== 'undefined' && peekAccountLinkTokenFromLocation() !== null
if (hasVkLaunch || hasTgToVkAccountLinkInUrl) {
  initVkBridge().catch(() => {})
}

if (isInsideTelegram) {
  window.Telegram?.WebApp?.ready?.()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SDKProvider acceptCustomStyles debug>
      <App />
    </SDKProvider>
  </StrictMode>,
)
