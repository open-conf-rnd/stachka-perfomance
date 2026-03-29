export const FEATURE_KEYS = ['bingo', 'qr', 'polls', 'tap', 'reaction', 'haptic', 'support', 'bingoShare'] as const

export type FeatureKey = (typeof FEATURE_KEYS)[number]
export type MenuFeatureKey = Exclude<FeatureKey, 'bingoShare'>

export interface FeatureMenuItem {
  key: MenuFeatureKey
  path: string
  title: string
  desc: string
}

export const featureMenuItems: FeatureMenuItem[] = [
  { key: 'bingo', path: '/bingo', title: 'Бинго', desc: 'Карточка заданий' },
  { key: 'qr', path: '/qr', title: 'Сканировать QR', desc: 'Отметить задание по QR-коду' },
  { key: 'polls', path: '/polls', title: 'Опросы', desc: 'Голосования доклада' },
  { key: 'tap', path: '/tap', title: 'Тапалка', desc: 'Большая кнопка и счетчик' },
  { key: 'reaction', path: '/reaction', title: 'Реакция', desc: 'Кто нажмет быстрее' },
  { key: 'haptic', path: '/haptic', title: 'Вибрации', desc: 'Демо Telegram Haptic' },
  { key: 'support', path: '/support', title: 'Поддержать', desc: 'Telegram Stars' },
]

export interface AdminFeatureToggleItem {
  key: FeatureKey
  title: string
  desc: string
}

export const adminFeatureToggleItems: AdminFeatureToggleItem[] = [
  { key: 'bingo', title: 'Бинго', desc: 'Карточка заданий' },
  { key: 'qr', title: 'Сканировать QR', desc: 'Отметить задание по QR-коду' },
  { key: 'polls', title: 'Опросы', desc: 'Голосования доклада' },
  { key: 'tap', title: 'Тапалка', desc: 'Большая кнопка и счетчик' },
  { key: 'reaction', title: 'Реакция', desc: 'Кто нажмет быстрее' },
  { key: 'haptic', title: 'Вибрации', desc: 'Демо Telegram Haptic' },
  { key: 'support', title: 'Поддержать', desc: 'Telegram Stars' },
  { key: 'bingoShare', title: 'Share в Бинго', desc: 'Share to Story и Share в чат' },
]

export function isFeatureKey(value: string): value is FeatureKey {
  return (FEATURE_KEYS as readonly string[]).includes(value)
}
