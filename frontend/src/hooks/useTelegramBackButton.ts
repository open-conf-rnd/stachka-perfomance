import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useTelegramBackButton(enabled = true) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!enabled) return
    const backButton = window.Telegram?.WebApp?.BackButton
    if (!backButton) return

    const onBack = () => navigate('/')
    backButton.show?.()
    backButton.onClick?.(onBack)

    return () => {
      backButton.offClick?.(onBack)
      backButton.hide?.()
    }
  }, [enabled, navigate])
}
