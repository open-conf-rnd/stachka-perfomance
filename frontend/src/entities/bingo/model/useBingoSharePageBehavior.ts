import { useCallback, useEffect, useState } from 'react'
import { apiRequest, apiRequestWithNotifications } from '@/shared/lib/api'
import { isFeatureKey } from '@/shared/lib/featureAccess'

export function useBingoSharePageBehavior() {
  const [shareTaskIds, setShareTaskIds] = useState<{
    shareStoriesTaskId: string | null
    shareChatTaskId: string | null
  }>({ shareStoriesTaskId: null, shareChatTaskId: null })
  /** Только фича `bingoShare` (Share to Story / чат), без флага `bingo`. */
  const [bingoShareEnabled, setBingoShareEnabled] = useState(false)
  const [featuresLoaded, setFeaturesLoaded] = useState(false)
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    void apiRequest<{ shareStoriesTaskId: string | null; shareChatTaskId: string | null }>(
      '/api/bingo/config'
    )
      .then(setShareTaskIds)
      .catch(() => {})
  }, [])

  useEffect(() => {
    void apiRequest<{ enabled: string[] }>('/api/features')
      .then((data) => {
        const enabledSet = new Set(data.enabled.filter((key) => isFeatureKey(key)))
        setBingoShareEnabled(enabledSet.has('bingoShare'))
      })
      .catch(() => {
        setBingoShareEnabled(false)
      })
      .finally(() => setFeaturesLoaded(true))
  }, [])

  const completeTaskById = useCallback(async (taskId: string) => {
    try {
      await apiRequestWithNotifications<{ success: boolean; alreadyCompleted: boolean }>(
        `/api/bingo/tasks/${taskId}/complete`,
        'POST',
        undefined,
        {
          popupTitle: 'Бинго',
          successMessage: 'Задание бинго отмечено как выполненное',
          errorMessage: 'Не удалось отметить задание бинго',
        }
      )
    } catch {
      // ignore
    }
  }, [])

  const shareToStory = async () => {
    const share = window.Telegram?.WebApp?.shareToStory
    if (!share) {
      setStatus('shareToStory недоступен в текущей среде')
      return
    }

    share('https://telegram.org/img/t_logo.png', {
      text: 'Прохожу бинго на докладе!',
      widget_link: { url: window.location.href, name: 'Открыть TMA' },
    })
    setStatus('Открыли share to story')
    if (shareTaskIds.shareStoriesTaskId) {
      await completeTaskById(shareTaskIds.shareStoriesTaskId)
    }
  }

  const shareInChat = async () => {
    const text = encodeURIComponent('Я прохожу бинго на докладе 🚀')
    const url = encodeURIComponent(window.location.href)
    const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    const openTelegramLink = window.Telegram?.WebApp?.openTelegramLink
    if (openTelegramLink) {
      openTelegramLink(shareUrl)
    } else {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
    setStatus('Открыли share в чат')
    if (shareTaskIds.shareChatTaskId) {
      await completeTaskById(shareTaskIds.shareChatTaskId)
    }
  }

  return {
    bingoShareEnabled,
    featuresLoaded,
    status,
    shareToStory,
    shareInChat,
  }
}
