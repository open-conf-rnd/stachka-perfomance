import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { mockTelegramEnv } from '@telegram-apps/sdk'
import { SDKProvider } from '@telegram-apps/sdk-react'
import App from './App.tsx'
import './index.css'

// При открытии в браузере (вне Telegram) подменяем окружение для разработки
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string
        ready?: () => void
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

// Убираем бесконечный загрузчик: скрипт telegram-web-app.js ждёт ready()
window.Telegram?.WebApp?.ready?.()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SDKProvider acceptCustomStyles debug>
      <App />
    </SDKProvider>
  </StrictMode>,
)
