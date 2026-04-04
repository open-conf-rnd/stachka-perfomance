import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface Participant {
  id: string
  firstName: string
  lastName: string | null
  username: string | null
  completionsCount: number
}

export function useBehavior() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest<Participant[]>('/api/admin/participants')
      setParticipants(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { participants, loading, error }
}
