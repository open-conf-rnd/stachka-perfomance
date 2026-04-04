import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import type { ReactionRoundSummary } from './types'

export function useReactionRoundsPageBehavior() {
  const [rounds, setRounds] = useState<ReactionRoundSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await apiRequest<ReactionRoundSummary[]>('/api/reaction/rounds')
        if (!active) return
        setRounds(data)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить раунды')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  return { rounds, loading, error }
}
