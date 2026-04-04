import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api'
import { adminFeatureToggleItems, type FeatureKey } from '../../lib/featureAccess'

interface FeatureState {
  key: FeatureKey
  enabled: boolean
}

export function AdminPagesAccessPage() {
  const [features, setFeatures] = useState<FeatureState[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingKey, setPendingKey] = useState<FeatureKey | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadFeatures = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest<FeatureState[]>('/api/admin/features')
      setFeatures(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить настройки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFeatures()
  }, [])

  const toggleFeature = async (key: FeatureKey, enabled: boolean) => {
    setPendingKey(key)
    setError(null)
    try {
      await apiRequest(`/api/admin/features/${key}`, 'PUT', { enabled })
      setFeatures((prev) => prev.map((item) => (item.key === key ? { ...item, enabled } : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить настройку')
    } finally {
      setPendingKey(null)
    }
  }

  return (
    <div className="admin-section">
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>Доступность страниц</h2>
      <p style={{ margin: '0 0 1rem', opacity: 0.85, fontSize: '0.9rem' }}>
        Закрытые страницы скрываются на главной у участников.
      </p>
      {loading ? (
        <p className="page__loading">Загрузка...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {adminFeatureToggleItems.map((item) => {
            const current = features.find((feature) => feature.key === item.key)
            const enabled = current?.enabled ?? false
            const pending = pendingKey === item.key

            return (
              <div
                key={item.key}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid color-mix(in srgb, currentColor 18%, transparent)',
                  background: 'color-mix(in srgb, currentColor 6%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong>{item.title}</strong>
                  <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>{item.desc}</span>
                </div>
                <button
                  type="button"
                  className={enabled ? 'btn' : 'btn btn--primary'}
                  disabled={pending}
                  onClick={() => void toggleFeature(item.key, !enabled)}
                >
                  {pending ? '...' : enabled ? 'Закрыть' : 'Открыть'}
                </button>
              </div>
            )
          })}
        </div>
      )}
      {error && <p className="page__error">{error}</p>}
    </div>
  )
}
