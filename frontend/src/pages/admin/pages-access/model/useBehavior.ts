import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { type FeatureKey } from '@/lib/featureAccess'

interface FeatureState {
  key: FeatureKey
  enabled: boolean
}

export function useBehavior() {
  const [features, setFeatures] = useState<FeatureState[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingKey, setPendingKey] = useState<FeatureKey | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadFeatures = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    void loadFeatures()
  }, [loadFeatures])

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

  return { features, loading, pendingKey, error, toggleFeature }
}
