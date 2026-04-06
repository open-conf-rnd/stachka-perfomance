import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useLaunchParams, useThemeParams } from '@telegram-apps/sdk-react'
import './App.css'
import '@/shared/ui/Grid'
import '@/shared/ui/Button'
import { WsUserHapticListener } from '@/shared/ui/WsUserHapticListener'
import {
  useTelegramVkAccountLinkFromStartParam,
  useTgToVkAccountLinkFromVkHashAndBridge,
} from '@/entities/auth/model'
import { PlatformProvider } from '@/shared/lib/platform/PlatformContext'
import { notifyAccountLinkSuccess } from '@/shared/lib/accountLinkSuccessNotify'
import { getBingoStartParamConsumed, setBingoStartParamConsumed } from '@/shared/lib/telegramCloudStorage'

// Lazy-загрузка страниц: меньший первый чанк → быстрее грузится при медленном VPN (~7 KB/s)
const HomePage = lazy(() => import('@/pages/home').then(m => ({ default: m.HomePage })))
const RegisterPage = lazy(() => import('@/pages/register').then(m => ({ default: m.RegisterPage })))
const PrivacyPolicyPage = lazy(() => import('@/pages/privacy').then(m => ({ default: m.PrivacyPolicyPage })))
const AccountLinkTelegramPage = lazy(() =>
  import('@/pages/account-link').then(m => ({ default: m.AccountLinkTelegramPage }))
)
const WelcomePage = lazy(() => import('@/pages/welcome').then(m => ({ default: m.WelcomePage })))
const BingoPage = lazy(() => import('@/pages/bingo-page').then(m => ({ default: m.BingoPage })))
const BingoSharePage = lazy(() =>
  import('@/pages/bingo-share-page').then(m => ({ default: m.BingoSharePage }))
)
const QrVerifyPage = lazy(() => import('@/pages/qr-verify-page').then(m => ({ default: m.QrVerifyPage })))
const PollsPage = lazy(() => import('@/pages/polls').then(m => ({ default: m.PollsPage })))
const TapPage = lazy(() => import('@/pages/tap').then(m => ({ default: m.TapPage })))
const ReactionPage = lazy(() => import('@/pages/reaction').then(m => ({ default: m.ReactionPage })))
const ReactionResultsPage = lazy(() =>
  import('@/pages/reaction-results-page').then(m => ({ default: m.ReactionResultsPage }))
)
const ReactionRoundsPage = lazy(() => import('@/pages/reaction-rounds').then(m => ({ default: m.ReactionRoundsPage })))
const ReactionRoundDetailPage = lazy(() =>
  import('@/pages/reaction-round-detail').then(m => ({ default: m.ReactionRoundDetailPage }))
)
const HapticPage = lazy(() => import('@/pages/haptic-page').then(m => ({ default: m.HapticPage })))
const Merge2048Page = lazy(() => import('@/pages/merge-2048-page').then(m => ({ default: m.Merge2048Page })))
const AdminLayout = lazy(() => import('@/shared/ui/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminParticipantsPage = lazy(() =>
  import('@/pages/admin/participants').then(m => ({ default: m.AdminParticipantsPage }))
)
const AdminReactionPage = lazy(() => import('@/pages/admin/reaction').then(m => ({ default: m.AdminReactionPage })))
const AdminPollsPage = lazy(() => import('@/pages/admin/polls').then(m => ({ default: m.AdminPollsPage })))
const AdminHapticPage = lazy(() => import('@/pages/admin/haptic').then(m => ({ default: m.AdminHapticPage })))
const AdminBingoPage = lazy(() => import('@/pages/admin/bingo').then(m => ({ default: m.AdminBingoPage })))
const AdminPagesAccessPage = lazy(() =>
  import('@/pages/admin/pages-access').then(m => ({ default: m.AdminPagesAccessPage }))
)
const PresentationPage = lazy(() =>
  import('@/pages/presentation-page').then(m => ({ default: m.PresentationPage }))
)

const BINGO_START_PARAM = 'bingo'

function App() {
  const themeParams = useThemeParams()

  return (
    <div className="app">
      <WsUserHapticListener />
      <BrowserRouter>
        <PlatformProvider>
          <AppContent themeParams={themeParams} />
        </PlatformProvider>
      </BrowserRouter>
    </div>
  )
}

function telegramStartParamFromInitData(): string | undefined {
  return typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.start_param : undefined
}

type TelegramWebAppInsets = {
  safeAreaInset?: { top: number; bottom: number; left: number; right: number }
  contentSafeAreaInset?: { top: number; bottom: number; left: number; right: number }
  onEvent?: (eventType: string, eventHandler: () => void) => void
  offEvent?: (eventType: string, eventHandler: () => void) => void
}

function applyTelegramViewportInsetsToCss() {
  const wa = window.Telegram?.WebApp as TelegramWebAppInsets | undefined
  if (!wa) return
  const s = wa.safeAreaInset
  const c = wa.contentSafeAreaInset
  const top =
    (typeof s?.top === 'number' ? s.top : 0) +
    (typeof c?.top === 'number' ? c.top : 0)
  const bottom =
    (typeof s?.bottom === 'number' ? s.bottom : 0) +
    (typeof c?.bottom === 'number' ? c.bottom : 0)
  const root = document.documentElement
  if (top > 0) {
    root.style.setProperty('--app-telegram-top-inset', `${top}px`)
  } else {
    root.style.removeProperty('--app-telegram-top-inset')
  }
  if (bottom > 0) {
    root.style.setProperty('--app-telegram-bottom-inset', `${bottom}px`)
  } else {
    root.style.removeProperty('--app-telegram-bottom-inset')
  }
}

function AppContent({ themeParams }: { themeParams: ReturnType<typeof useThemeParams> }) {
  const location = useLocation()
  const navigate = useNavigate()
  const launchParams = useLaunchParams()
  const startParam = launchParams.startParam ?? telegramStartParamFromInitData()
  const isPresentation = location.pathname === '/presentation'
  const bg = isPresentation ? '#f8f8f8' : (themeParams?.bgColor ?? '#1c1c1e')
  const fg = isPresentation ? '#1a1a1a' : (themeParams?.textColor ?? '#ffffff')

  useTelegramVkAccountLinkFromStartParam({ onLinkedSuccess: notifyAccountLinkSuccess })
  useTgToVkAccountLinkFromVkHashAndBridge({ onLinkedSuccess: notifyAccountLinkSuccess })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Telegram?.WebApp?.initData) return
    applyTelegramViewportInsetsToCss()
    const wa = window.Telegram.WebApp as TelegramWebAppInsets
    const handler = () => applyTelegramViewportInsetsToCss()
    wa.onEvent?.('safeAreaChanged', handler)
    return () => {
      wa.offEvent?.('safeAreaChanged', handler)
    }
  }, [])

  useEffect(() => {
    const shouldOpenBingo = startParam === BINGO_START_PARAM && location.pathname === '/'
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
  }, [startParam, location.pathname, navigate])

  return (
    <div className="app__route" style={{ backgroundColor: bg, color: fg }}>
      <Suspense fallback={null}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/provacy" element={<Navigate to="/privacy" replace />} />
        <Route path="/account-link" element={<AccountLinkTelegramPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/bingo/share" element={<BingoSharePage />} />
        <Route path="/bingo" element={<BingoPage />} />
        <Route path="/qr" element={<QrVerifyPage />} />
        <Route path="/polls" element={<PollsPage />} />
        <Route path="/tap" element={<TapPage />} />
        <Route path="/reaction/results" element={<ReactionResultsPage />} />
        <Route path="/reaction" element={<ReactionPage />} />
        <Route path="/reaction/rounds" element={<ReactionRoundsPage />} />
        <Route path="/reaction/rounds/:id" element={<ReactionRoundDetailPage />} />
        <Route path="/haptic" element={<HapticPage />} />
        <Route path="/merge2048" element={<Merge2048Page />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/participants" replace />} />
          <Route path="participants" element={<AdminParticipantsPage />} />
          <Route path="reaction" element={<AdminReactionPage />} />
          <Route path="polls" element={<AdminPollsPage />} />
          <Route path="haptic" element={<AdminHapticPage />} />
          <Route path="bingo" element={<AdminBingoPage />} />
          <Route path="pages" element={<AdminPagesAccessPage />} />
        </Route>

        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
