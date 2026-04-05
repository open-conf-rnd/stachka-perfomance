export type TelegramNotificationType = 'success' | 'warning' | 'error'

type PopupButtonType = 'default' | 'destructive' | 'ok' | 'close' | 'cancel'

interface TelegramPopupButton {
  id?: string
  type: PopupButtonType
  text?: string
}

interface TelegramPopupParams {
  title?: string
  message: string
  buttons?: TelegramPopupButton[]
}

interface TelegramWebAppNotifications {
  HapticFeedback?: {
    notificationOccurred?: (type: TelegramNotificationType) => void
  }
  showAlert?: (message: string, callback?: () => void) => void
  showPopup?: (
    params: TelegramPopupParams,
    callback?: (buttonId: string | null) => void
  ) => void
}

function getWebAppNotifications(): TelegramWebAppNotifications | undefined {
  return window.Telegram?.WebApp
}

function triggerHaptic(type: TelegramNotificationType) {
  getWebAppNotifications()?.HapticFeedback?.notificationOccurred?.(type)
}

function showTelegramPopup(message: string, title?: string) {
  const webApp = getWebAppNotifications()
  if (!webApp) return false

  if (typeof webApp.showAlert === 'function') {
    webApp.showAlert(message)
    return true
  }

  if (typeof webApp.showPopup === 'function') {
    webApp.showPopup({
      title: title ?? 'Уведомление',
      message,
      buttons: [{ type: 'close' }],
    })
    return true
  }

  return false
}

export function notifyTelegramResult(type: TelegramNotificationType, message: string, title?: string) {
  triggerHaptic(type)
  const popupShown = showTelegramPopup(message, title)
  if (!popupShown) {
    window.alert(message)
  }
}

/**
 * То же, что notifyTelegramResult, но с задержкой. Нужно после закрытия нативного UI Telegram
 * (сканер QR и т.п.): иначе showAlert/showPopup даёт ошибку WebAppPopupOpened.
 */
export function notifyTelegramResultDeferred(
  type: TelegramNotificationType,
  message: string,
  title?: string,
  delayMs = 280
): void {
  window.setTimeout(() => {
    notifyTelegramResult(type, message, title)
  }, delayMs)
}
