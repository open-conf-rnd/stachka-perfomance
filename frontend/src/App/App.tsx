import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useLaunchParams, useThemeParams } from '@telegram-apps/sdk-react'
import './App.css'
import '../components/Grid'
import '../components/Button'
import { WsUserHapticListener } from '../components/WsUserHapticListener'

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
const SupportPage = lazy(() => import('../pages/SupportPage').then(m => ({ default: m.SupportPage })))
const AdminLayout = lazy(() => import('../components/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminParticipantsPage = lazy(() => import('../pages/admin/AdminParticipantsPage').then(m => ({ default: m.AdminParticipantsPage })))
const AdminReactionPage = lazy(() => import('../pages/admin/AdminReactionPage').then(m => ({ default: m.AdminReactionPage })))
const AdminPollsPage = lazy(() => import('../pages/admin/AdminPollsPage').then(m => ({ default: m.AdminPollsPage })))
const AdminHapticPage = lazy(() => import('../pages/admin/AdminHapticPage').then(m => ({ default: m.AdminHapticPage })))
const AdminBingoPage = lazy(() => import('../pages/admin/AdminBingoPage').then(m => ({ default: m.AdminBingoPage })))
const AdminPagesAccessPage = lazy(() => import('../pages/admin/AdminPagesAccessPage').then(m => ({ default: m.AdminPagesAccessPage })))
const PresentationPage = lazy(() => import('../pages/PresentationPage').then(m => ({ default: m.PresentationPage })))

const BINGO_START_PARAM = 'bingo'
const BINGO_START_PARAM_CONSUMED_KEY = 'bingo-start-param-consumed'

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
  const isPresentation = location.pathname === '/presentation'
  const bg = isPresentation ? '#f8f8f8' : (themeParams?.bgColor ?? '#1c1c1e')
  const fg = isPresentation ? '#1a1a1a' : (themeParams?.textColor ?? '#ffffff')

  useEffect(() => {
    const shouldOpenBingo = launchParams.startParam === BINGO_START_PARAM && location.pathname === '/'
    if (!shouldOpenBingo) return

    const alreadyConsumed = sessionStorage.getItem(BINGO_START_PARAM_CONSUMED_KEY) === '1'
    if (!alreadyConsumed) {
      sessionStorage.setItem(BINGO_START_PARAM_CONSUMED_KEY, '1')
      navigate('/bingo', { replace: true })
    }
  }, [launchParams.startParam, location.pathname, navigate])

  return (
    <div className="app__route" style={{ backgroundColor: bg, color: fg, flex: 1, minHeight: 0 }}>
      <Suspense fallback={null}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/bingo" element={<BingoPage />} />
        <Route path="/qr" element={<QrVerifyPage />} />
        <Route path="/polls" element={<PollsPage />} />
        <Route path="/tap" element={<TapPage />} />
        <Route path="/reaction" element={<ReactionPage />} />
        <Route path="/reaction/rounds" element={<ReactionRoundsPage />} />
        <Route path="/reaction/rounds/:id" element={<ReactionRoundDetailPage />} />
        <Route path="/haptic" element={<HapticPage />} />
        <Route path="/support" element={<SupportPage />} />
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
