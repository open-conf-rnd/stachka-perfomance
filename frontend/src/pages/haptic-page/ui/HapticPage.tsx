import { PageLayout } from '@/components/PageLayout'
import type { ImpactStyle, NotificationType } from '../model'
import { useBehavior } from '../model'
import './HapticPage.css'

const impactStyles: ImpactStyle[] = ['light', 'medium', 'heavy', 'rigid', 'soft']
const impactLabels: Record<ImpactStyle, string> = {
  light: 'Лёгкая',
  medium: 'Средняя',
  heavy: 'Сильная',
  rigid: 'Жёсткая',
  soft: 'Мягкая',
}
const notificationLabels: Record<NotificationType, string> = {
  success: 'Успех',
  warning: 'Предупреждение',
  error: 'Ошибка',
}
const impactColors = [
  '#22c55e',
  '#84cc16',
  '#eab308',
  '#f97316',
  '#ef4444',
] as const
const impactPaddings = ['0.4rem 0.65rem', '0.55rem 0.8rem', '0.75rem 1rem', '0.9rem 1.2rem', '0.65rem 0.9rem'] as const
const impactFontSizes = ['0.8rem', '0.88rem', '1rem', '1.1rem', '0.9rem'] as const

const notificationColors: Record<NotificationType, string> = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
}

export function HapticPage() {
  const { status, runImpact, runNotification } = useBehavior()

  return (
    <PageLayout title="Вибрации" subtitle="Демо Haptic API Telegram">
      <p style={{ margin: '0 0 0.75rem' }}>Статус: {status}</p>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.45rem' }}>Impact</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {impactStyles.map((style, i) => (
            <button
              key={style}
              type="button"
              className="btn haptic__impact-btn"
              onClick={() => runImpact(style)}
              style={{
                background: impactColors[i],
                borderColor: impactColors[i],
                padding: impactPaddings[i],
                fontSize: impactFontSizes[i],
              }}
            >
              {impactLabels[style]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 700, marginBottom: '0.45rem' }}>Notification</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(['success', 'warning', 'error'] as const).map((notificationType) => (
            <button
              key={notificationType}
              type="button"
              className="btn haptic__notification-btn"
              onClick={() => runNotification(notificationType)}
              style={{
                background: notificationColors[notificationType],
                borderColor: notificationColors[notificationType],
              }}
            >
              {notificationLabels[notificationType]}
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
