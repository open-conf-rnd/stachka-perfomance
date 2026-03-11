import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { mockTelegramEnv } from '@telegram-apps/sdk'
import { SDKProvider } from '@telegram-apps/sdk-react'
import App from './App'
import './index.css'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string
        ready?: () => void
        openInvoice?: (
          url: string,
          callback?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void
        ) => void
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
      }
    }
  }
}
const isInsideTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp?.initData

if (!isInsideTelegram) {
  mockTelegramEnv({
    version: '7.0',
    platform: 'web',
    themeParams: {
      bgColor: '#1c1c1e',
      textColor: '#ffffff',
    },
  })
}

window.Telegram?.WebApp?.ready?.()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SDKProvider acceptCustomStyles debug>
      <App />
    </SDKProvider>
  </StrictMode>,
)
