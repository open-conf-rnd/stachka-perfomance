type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
type NotificationType = 'success' | 'warning' | 'error'

export interface HapticPayload {
  type: 'impact' | 'notification'
  style?: ImpactStyle
  notificationType?: NotificationType
}

export function triggerHaptic(payload: HapticPayload): boolean {
  const haptic = window.Telegram?.WebApp?.HapticFeedback
  if (!haptic) return false

  if (payload.type === 'impact') {
    haptic.impactOccurred?.(payload.style ?? 'medium')
    return true
  }

  haptic.notificationOccurred?.(payload.notificationType ?? 'success')
  return true
}
