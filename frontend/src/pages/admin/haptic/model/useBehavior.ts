import { useState } from 'react'
import { apiRequest } from '@/shared/lib/api'

export type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
export type NotificationType = 'success' | 'warning' | 'error'

export function useBehavior() {
  const [hapticType, setHapticType] = useState<'impact' | 'notification'>('impact')
  const [impactStyle, setImpactStyle] = useState<ImpactStyle>('medium')
  const [notificationType, setNotificationType] = useState<NotificationType>('success')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const send = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const body =
        hapticType === 'impact'
          ? { type: 'impact', style: impactStyle }
          : { type: 'notification', notificationType }
      await apiRequest('/api/haptic/trigger', 'POST', body)
      setResult('Вибрация отправлена всем участникам')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить')
    } finally {
      setLoading(false)
    }
  }

  return {
    hapticType,
    setHapticType,
    impactStyle,
    setImpactStyle,
    notificationType,
    setNotificationType,
    loading,
    result,
    error,
    send,
  }
}
