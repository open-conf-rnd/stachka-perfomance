import { Navigate } from 'react-router-dom'
import { PageLayout } from '@/shared/ui/PageLayout'
import { useBehavior } from '../model'
import './BingoSharePage.css'

export function BingoSharePage() {
  const { bingoShareEnabled, featuresLoaded, shareToStory, shareInChat } = useBehavior()

  if (featuresLoaded && !bingoShareEnabled) {
    return <Navigate to="/bingo" replace />
  }

  return (
    <PageLayout
      title="Поделиться бинго"
      subtitle="Share to Story и ссылка в чат — задания бинго засчитаются после действия"
    >
      {!featuresLoaded ? <p className="page__loading">Загрузка…</p> : null}

      {featuresLoaded ? (
        <>
          <div className="bingo-share-page__actions">
            <button
              type="button"
              className="btn bingo-share-page__action-btn"
              onClick={() => void shareToStory()}
            >
              Share to Story
            </button>
            <button
              type="button"
              className="btn bingo-share-page__action-btn"
              onClick={() => void shareInChat()}
            >
              Share в чат
            </button>
          </div>
        </>
      ) : null}
    </PageLayout>
  )
}
