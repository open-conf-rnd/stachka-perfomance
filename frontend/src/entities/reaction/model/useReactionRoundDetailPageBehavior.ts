import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiRequest } from '@/shared/lib/api'
import type { ReactionRoundDetail } from './types'

export function useReactionRoundDetailPageBehavior() {
  const { id } = useParams<{ id: string }>()
  const [round, setRound] = useState<ReactionRoundDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    ;(async () => {
      try {
        const data = await apiRequest<ReactionRoundDetail>(`/api/reaction/rounds/${id}`)
        if (!active) return
        setRound(data)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить раунд')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [id])

  return { id, round, loading, error }
}
