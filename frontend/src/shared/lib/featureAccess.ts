export const FEATURE_KEYS = ['bingo', 'qr', 'polls', 'tap', 'reaction', 'haptic', 'merge2048', 'bingoShare'] as const

export type FeatureKey = (typeof FEATURE_KEYS)[number]

export interface FeatureMenuItem {
  key: FeatureKey
  path: string
  title: string
  desc: string
}

export const featureMenuItems: FeatureMenuItem[] = [
  { key: 'bingo', path: '/bingo', title: 'Бинго', desc: 'Карточка заданий' },
  {
    key: 'bingoShare',
    path: '/bingo/share',
    title: 'Share в Бинго',
    desc: 'Share to Story и Share в чат',
  },
  { key: 'qr', path: '/qr', title: 'Сканировать QR', desc: 'Отметить задание по QR-коду' },
  { key: 'polls', path: '/polls', title: 'Опросы', desc: 'Голосования доклада' },
  { key: 'tap', path: '/tap', title: 'Тапалка', desc: 'Большая кнопка и счетчик' },
  { key: 'reaction', path: '/reaction', title: 'Реакция', desc: 'Кто нажмет быстрее' },
  { key: 'haptic', path: '/haptic', title: 'Вибрации', desc: 'Демо Telegram Haptic' },
  { key: 'merge2048', path: '/merge2048', title: '2048', desc: 'Слайдер плиток со свайпами' },
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
  { key: 'merge2048', title: '2048', desc: 'Игра 2048 со свайпами' },
  { key: 'bingoShare', title: 'Share в Бинго', desc: 'Share to Story и Share в чат' },
]

export function isFeatureKey(value: string): value is FeatureKey {
  return (FEATURE_KEYS as readonly string[]).includes(value)
}
