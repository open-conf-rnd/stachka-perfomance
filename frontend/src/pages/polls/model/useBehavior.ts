import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest, apiRequestWithNotifications } from '@/shared/lib/api'

interface PollOption {
  id: string
  label: string
}

interface Poll {
  id: string
  question: string
  options: PollOption[]
  counts: Record<string, number>
  total: number
  correctOptionId?: string | null
}

export function useBehavior() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [submittingPollId, setSubmittingPollId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [votedPollIds, setVotedPollIds] = useState<Record<string, true>>({})

  const votedCount = useMemo(() => Object.keys(votedPollIds).length, [votedPollIds])

  const loadPolls = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)
    try {
      const data = await apiRequest<Poll[]>('/api/polls')
      setPolls(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить опросы')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadPolls()
  }, [loadPolls])

  const vote = async (pollId: string, optionId: string) => {
    setSubmittingPollId(pollId)
    setError(null)
    const willCompleteAllPolls = !votedPollIds[pollId] && votedCount + 1 >= polls.length && polls.length > 0
    try {
      await apiRequestWithNotifications(`/api/polls/${pollId}/vote`, 'POST', { optionId }, {
        notifyOnSuccess: willCompleteAllPolls,
        popupTitle: 'Бинго',
        successMessage: 'Все опросы пройдены, бинго-задание засчитано',
        errorMessage: 'Не удалось отправить голос',
      })
      setVotedPollIds((prev) => ({ ...prev, [pollId]: true }))
      await loadPolls(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось отправить голос'
      if (message.toLowerCase().includes('already voted')) {
        setVotedPollIds((prev) => ({ ...prev, [pollId]: true }))
        await loadPolls(true)
      } else {
        setError(message)
      }
    } finally {
      setSubmittingPollId(null)
    }
  }

  return {
    polls,
    loading,
    refreshing,
    submittingPollId,
    error,
    votedPollIds,
    votedCount,
    vote,
  }
}
