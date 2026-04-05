import { PageLayout } from '@/shared/ui/PageLayout'
import { featureMenuItems } from '@/shared/lib/featureAccess'
import { useBehavior } from '../model'
import { HomeMenuTile } from './HomeMenuTile'
import { HomePageSkeleton } from './HomePageSkeleton'
import './HomePage.css'

const adminItem = { path: '/admin', title: 'Админка', desc: 'Панель управления' }

export function HomePage() {
  const { checking, isAdmin, enabledFeatures, error } = useBehavior()

  const menu = featureMenuItems.filter((item) => enabledFeatures.includes(item.key))
  const visibleMenu = isAdmin ? [adminItem, ...menu] : menu
  const showEmptyList = !checking && !error && visibleMenu.length === 0

  return (
    <PageLayout title="Хобби помощник" subtitle="Главная: все активности" enableBackButton={false}>
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {checking ? (
        <HomePageSkeleton />
      ) : showEmptyList ? (
        <div className="home-page__empty">
          <span className="home-page__empty-icon" aria-hidden>
            ✨
          </span>
          <h2 className="home-page__empty-title">Пока тихо — и это нормально</h2>
          <p className="home-page__empty-text">
            Разделы откроются по ходу доклада. Устройтесь поудобнее: дайте спикеру пару минут — он всё
            объяснит и включит активности.
          </p>
        </div>
      ) : (
        <div className="grid">
          {visibleMenu.map((item) => (
            <HomeMenuTile key={item.path} path={item.path} title={item.title} desc={item.desc} />
          ))}
        </div>
      )}
    </PageLayout>
  )
}
