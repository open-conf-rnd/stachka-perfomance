import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { captureVkLaunchParamsFromUrl, getAppPlatform, type AppPlatform } from '../lib/authHeaders'

const PlatformContext = createContext<AppPlatform | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const { pathname, search, hash } = useLocation()
  const [platform, setPlatform] = useState<AppPlatform>(() => getAppPlatform())

  useEffect(() => {
    captureVkLaunchParamsFromUrl()
    setPlatform(getAppPlatform())
  }, [pathname, search, hash])

  return <PlatformContext.Provider value={platform}>{children}</PlatformContext.Provider>
}

/**
 * Платформа мини-приложения: синхронизируется с URL (hash/search) и sessionStorage VK.
 * Должен вызываться под {@link PlatformProvider}; иначе — {@link getAppPlatform}.
 */
export function usePlatform(): AppPlatform {
  const ctx = useContext(PlatformContext)
  if (ctx !== null) return ctx
  return getAppPlatform()
}
