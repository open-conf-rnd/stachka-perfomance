import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, type MeResponse } from '@/shared/lib/api'
import { isFeatureKey, type FeatureKey } from '@/shared/lib/featureAccess'

export function useBehavior() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [enabledFeatures, setEnabledFeatures] = useState<FeatureKey[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const me = await apiRequest<MeResponse>('/api/me')
        if (!active) return
        if (!me.registered) {
          navigate('/register', { replace: true })
          return
        }
        const [adminCheck, featuresResponse] = await Promise.all([
          apiRequest<{ admin: boolean }>('/api/admin/check').catch(() => ({ admin: false })),
          apiRequest<{ enabled: string[] }>('/api/features').catch(() => ({ enabled: [] })),
        ])
        if (!active) return

        setIsAdmin(adminCheck.admin)
        const allowedFeatures: FeatureKey[] = []
        for (const feature of featuresResponse.enabled) {
          if (isFeatureKey(feature)) {
            allowedFeatures.push(feature)
          }
        }
        setEnabledFeatures(allowedFeatures)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось проверить пользователя')
      } finally {
        if (active) setChecking(false)
      }
    })()

    return () => {
      active = false
    }
  }, [navigate])

  return { checking, isAdmin, enabledFeatures, error }
}
