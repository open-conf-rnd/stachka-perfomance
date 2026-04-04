import bridge from '@vkontakte/vk-bridge'

/**
 * Инициализация VK Bridge в мини-приложении (после появления launch params).
 * Без VKWebAppInit часть методов моста может быть недоступна.
 */
export async function initVkBridge(): Promise<void> {
  await bridge.send('VKWebAppInit')
}
