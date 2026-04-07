import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBackButton } from '@telegram-apps/sdk-react'

export function useTelegramBackButton(enabled = true) {
  const navigate = useNavigate()
  const backButton = useBackButton()

  useEffect(() => {
    if (!enabled || !backButton) return

    const onBack = () => {
      navigate("/")
    }
    backButton.show()
    backButton.on('click', onBack)

    return () => {
      backButton.off('click', onBack)
      backButton.hide()
    }
  }, [enabled, navigate, backButton])
}
