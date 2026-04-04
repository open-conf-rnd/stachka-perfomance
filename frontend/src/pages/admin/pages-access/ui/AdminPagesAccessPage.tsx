import { adminFeatureToggleItems } from '@/lib/featureAccess'
import { useBehavior } from '../model'
import { AdminFeatureAccessRow } from './AdminFeatureAccessRow'

export function AdminPagesAccessPage() {
  const { features, loading, pendingKey, error, toggleFeature } = useBehavior()

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
              <AdminFeatureAccessRow
                key={item.key}
                title={item.title}
                desc={item.desc}
                enabled={enabled}
                pending={pending}
                onToggle={() => void toggleFeature(item.key, !enabled)}
              />
            )
          })}
        </div>
      )}
      {error && <p className="page__error">{error}</p>}
    </div>
  )
}
