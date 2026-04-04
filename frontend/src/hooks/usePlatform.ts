import { useEffect, useState } from 'react'
import { getAppPlatform, type AppPlatform } from '../lib/authHeaders'

export type { AppPlatform }

export function usePlatform(): AppPlatform {
  const [platform, setPlatform] = useState<AppPlatform>(getAppPlatform)

  useEffect(() => {
    setPlatform(getAppPlatform())
  }, [])

  return platform
}
