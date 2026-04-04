import { useEffect, useRef, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useLaunchParams, useThemeParams } from '@telegram-apps/sdk-react'
import './App.css'
import '../components/Grid'
import '../components/Button'
import { WsUserHapticListener } from '../components/WsUserHapticListener'
import { ACCOUNT_LINK_STARTAPP_PREFIX } from '../config'
import {
  COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY,
  PENDING_VK_LINK_TOKEN_KEY,
  peekAccountLinkTokenFromLocation,
  stripAccountLinkHashFromLocation,
} from '../lib/accountLinkStorage'
import { captureVkLaunchParamsFromUrl, getAppPlatform } from '../lib/authHeaders'
import {
  parseAccountLinkTokenFromVkRef,
  peekAccountLinkTokenFromVkLaunchParams,
} from '../lib/vkAccountLinkRef'
import { getBingoStartParamConsumed, setBingoStartParamConsumed } from '../lib/telegramCloudStorage'

// Lazy-загрузка страниц: меньший первый чанк → быстрее грузится при медленном VPN (~7 KB/s)
const HomePage = lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage })))
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const WelcomePage = lazy(() => import('../pages/WelcomePage').then(m => ({ default: m.WelcomePage })))
const BingoPage = lazy(() => import('../pages/BingoPage').then(m => ({ default: m.BingoPage })))
const QrVerifyPage = lazy(() => import('../pages/QrVerifyPage').then(m => ({ default: m.QrVerifyPage })))
const PollsPage = lazy(() => import('../pages/PollsPage').then(m => ({ default: m.PollsPage })))
const TapPage = lazy(() => import('../pages/TapPage').then(m => ({ default: m.TapPage })))
const ReactionPage = lazy(() => import('../pages/ReactionPage').then(m => ({ default: m.ReactionPage })))
const ReactionRoundsPage = lazy(() => import('../pages/ReactionRoundsPage').then(m => ({ default: m.ReactionRoundsPage })))
const ReactionRoundDetailPage = lazy(() => import('../pages/ReactionRoundDetailPage').then(m => ({ default: m.ReactionRoundDetailPage })))
const HapticPage = lazy(() => import('../pages/HapticPage').then(m => ({ default: m.HapticPage })))
const AdminLayout = lazy(() => import('../components/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminParticipantsPage = lazy(() => import('../pages/admin/AdminParticipantsPage').then(m => ({ default: m.AdminParticipantsPage })))
const AdminReactionPage = lazy(() => import('../pages/admin/AdminReactionPage').then(m => ({ default: m.AdminReactionPage })))
const AdminPollsPage = lazy(() => import('../pages/admin/AdminPollsPage').then(m => ({ default: m.AdminPollsPage })))
const AdminHapticPage = lazy(() => import('../pages/admin/AdminHapticPage').then(m => ({ default: m.AdminHapticPage })))
const AdminBingoPage = lazy(() => import('../pages/admin/AdminBingoPage').then(m => ({ default: m.AdminBingoPage })))
const AdminPagesAccessPage = lazy(() => import('../pages/admin/AdminPagesAccessPage').then(m => ({ default: m.AdminPagesAccessPage })))
const PresentationPage = lazy(() => import('../pages/PresentationPage').then(m => ({ default: m.PresentationPage })))
const AccountLinkTelegramPage = lazy(() =>
  import('../pages/AccountLinkTelegramPage').then(m => ({ default: m.AccountLinkTelegramPage }))
)

const BINGO_START_PARAM = 'bingo'

function App() {
  const themeParams = useThemeParams()

  return (
    <div className="app">
      <WsUserHapticListener />
      <BrowserRouter>
        <AppContent themeParams={themeParams} />
      </BrowserRouter>
    </div>
  )
}

function AppContent({ themeParams }: { themeParams: ReturnType<typeof useThemeParams> }) {
  const location = useLocation()
  const navigate = useNavigate()
  const launchParams = useLaunchParams()
  const vkRefProbeGen = useRef(0)
  const isPresentation = location.pathname === '/presentation'
  const bg = isPresentation ? '#f8f8f8' : (themeParams?.bgColor ?? '#1c1c1e')
  const fg = isPresentation ? '#1a1a1a' : (themeParams?.textColor ?? '#ffffff')

  useEffect(() => {
    if (getAppPlatform() !== 'telegram') return
    if (location.pathname === '/account-link') return
    const sp = launchParams.startParam ?? ''
    const prefix = ACCOUNT_LINK_STARTAPP_PREFIX
    if (!sp.startsWith(prefix) || sp.length !== prefix.length + 32) return
    if (sessionStorage.getItem(COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY) === sp) return
    const token = sp.slice(prefix.length)
    if (!/^[a-f0-9]{32}$/i.test(token)) return
    sessionStorage.setItem(PENDING_VK_LINK_TOKEN_KEY, token.toLowerCase())
    navigate('/account-link', { replace: true })
  }, [launchParams.startParam, location.pathname, navigate])

  /**
   * VK: токен привязки из hash, query или vk_ref/ref (launch params + bridge).
   */
  useEffect(() => {
    if (getAppPlatform() === 'telegram') return

    const probeId = ++vkRefProbeGen.current
    let cancelled = false

    const accountInRoute = new URLSearchParams(location.search).get('account_link')
    if (accountInRoute && /^[a-f0-9]{32}$/i.test(accountInRoute)) {
      stripAccountLinkHashFromLocation()
      return
    }

    const applyToken = (token: string) => {
      const current = new URLSearchParams(window.location.search).get('account_link')
      if (current?.toLowerCase() === token) {
        stripAccountLinkHashFromLocation()
        return
      }
      stripAccountLinkHashFromLocation()
      navigate(`/register?account_link=${encodeURIComponent(token)}`, { replace: true })
    }

    const resolveFromUrl = (): string | null => {
      captureVkLaunchParamsFromUrl()
      return peekAccountLinkTokenFromLocation() ?? peekAccountLinkTokenFromVkLaunchParams()
    }

    const immediate = resolveFromUrl()
    if (immediate) {
      applyToken(immediate)
      return () => {
        cancelled = true
      }
    }

    const retryDelays = [50, 200, 600]
    const retryIds = retryDelays.map((ms) =>
      window.setTimeout(() => {
        if (cancelled) return
        const t = resolveFromUrl()
        if (t) applyToken(t)
      }, ms)
    )

    void (async () => {
      try {
        const { default: bridge } = await import('@vkontakte/vk-bridge')
        await bridge.send('VKWebAppInit')
        const data = await bridge.send('VKWebAppGetLaunchParams')
        if (cancelled || probeId !== vkRefProbeGen.current) return
        const vkRef =
          typeof data === 'object' && data !== null && 'vk_ref' in data
            ? String((data as { vk_ref: string }).vk_ref)
            : ''
        const token = parseAccountLinkTokenFromVkRef(vkRef)
        if (token) applyToken(token)
      } catch {
        // вне клиента VK — норма
      }
    })()

    return () => {
      cancelled = true
      retryIds.forEach((id) => window.clearTimeout(id))
    }
  }, [location.pathname, location.search, location.hash, navigate])

  useEffect(() => {
    const shouldOpenBingo = launchParams.startParam === BINGO_START_PARAM && location.pathname === '/'
    if (!shouldOpenBingo) return

    let cancelled = false
    void (async () => {
      const consumed = await getBingoStartParamConsumed()
      if (cancelled || consumed) return
      await setBingoStartParamConsumed()
      if (!cancelled) {
        navigate('/bingo', { replace: true })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [launchParams.startParam, location.pathname, navigate])

  return (
    <div className="app__route" style={{ backgroundColor: bg, color: fg }}>
      <Suspense fallback={null}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account-link" element={<AccountLinkTelegramPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/bingo" element={<BingoPage />} />
        <Route path="/qr" element={<QrVerifyPage />} />
        <Route path="/polls" element={<PollsPage />} />
        <Route path="/tap" element={<TapPage />} />
        <Route path="/reaction" element={<ReactionPage />} />
        <Route path="/reaction/rounds" element={<ReactionRoundsPage />} />
        <Route path="/reaction/rounds/:id" element={<ReactionRoundDetailPage />} />
        <Route path="/haptic" element={<HapticPage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/participants" replace />} />
          <Route path="participants" element={<AdminParticipantsPage />} />
          <Route path="reaction" element={<AdminReactionPage />} />
          <Route path="polls" element={<AdminPollsPage />} />
          <Route path="haptic" element={<AdminHapticPage />} />
          <Route path="bingo" element={<AdminBingoPage />} />
          <Route path="pages" element={<AdminPagesAccessPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
