import { useState } from 'react'
import { apiRequest } from '../../lib/api'

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
type NotificationType = 'success' | 'warning' | 'error'

export function AdminHapticPage() {
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

  return (
    <div className="admin-section">
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>Вибрация всем участникам</h2>
      <p style={{ margin: '0 0 1rem', opacity: 0.85, fontSize: '0.9rem' }}>
        Отправит вибрацию на все подключённые устройства
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
            Тип вибрации
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <button
              type="button"
              className="btn"
              style={{
                flex: 1,
                background: hapticType === 'impact' ? '#3b82f6' : undefined,
              }}
              onClick={() => setHapticType('impact')}
            >
              Impact
            </button>
            <button
              type="button"
              className="btn"
              style={{
                flex: 1,
                background: hapticType === 'notification' ? '#3b82f6' : undefined,
              }}
              onClick={() => setHapticType('notification')}
            >
              Notification
            </button>
          </div>
          {hapticType === 'impact' ? (
            <select
              value={impactStyle}
              onChange={(e) => setImpactStyle(e.target.value as ImpactStyle)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 8,
                border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
                background: 'color-mix(in srgb, currentColor 8%, transparent)',
                color: 'inherit',
              }}
            >
              {(['light', 'medium', 'heavy', 'rigid', 'soft'] as const).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value as NotificationType)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 8,
                border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
                background: 'color-mix(in srgb, currentColor 8%, transparent)',
                color: 'inherit',
              }}
            >
              {(['success', 'warning', 'error'] as const).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          type="button"
          className="btn btn--primary"
          disabled={loading}
          onClick={() => void send()}
        >
          {loading ? 'Отправка...' : 'Отправить вибрацию всем'}
        </button>
      </div>
      {result && <p style={{ marginTop: '0.75rem', color: '#22c55e' }}>{result}</p>}
      {error && <p className="page__error">{error}</p>}
    </div>
  )
}
