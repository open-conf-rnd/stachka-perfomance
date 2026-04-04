import bridge from '@vkontakte/vk-bridge'
import { getAppPlatform } from './authHeaders'
import { notifyTelegramResult } from './telegramNotifications'

const TITLE = 'Готово'
const MESSAGE = 'Аккаунты Telegram и ВКонтакте успешно связаны.'

/** Уведомление после успешного complete-account-link (TG или VK мини-приложение). */
export function notifyAccountLinkSuccess(): void {
  const platform = getAppPlatform()
  if (platform === 'telegram') {
    notifyTelegramResult('success', MESSAGE, TITLE)
    return
  }
  if (platform === 'vk') {
    bridge.send('VKWebAppTapticNotificationOccurred', { type: 'success' }).catch(() => {})
  }
  window.alert(`${TITLE}\n\n${MESSAGE}`)
}
