import type { AppPlatform } from '@/shared/lib/authHeaders'

export function alreadyHaveAccountLabel(platform: AppPlatform): string {
  switch (platform) {
    case 'vk':
      return 'У меня уже есть аккаунт в Telegram'
    case 'telegram':
      return 'У меня уже есть аккаунт во ВКонтакте'
    default:
      return 'У меня уже есть аккаунт'
  }
}
