import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useLaunchParams, useThemeParams } from '@telegram-apps/sdk-react'
import './App.css'
import '../components/Grid'
import '../components/Button'
import { HomePage } from '../pages/HomePage'
import { RegisterPage } from '../pages/RegisterPage'
import { WelcomePage } from '../pages/WelcomePage'
import { BingoPage } from '../pages/BingoPage'
import { QrVerifyPage } from '../pages/QrVerifyPage'
import { PollsPage } from '../pages/PollsPage'
import { TapPage } from '../pages/TapPage'
import { ReactionPage } from '../pages/ReactionPage'
import { ReactionRoundsPage } from '../pages/ReactionRoundsPage'
import { ReactionRoundDetailPage } from '../pages/ReactionRoundDetailPage'
import { HapticPage } from '../pages/HapticPage'
import { SupportPage } from '../pages/SupportPage'
import { AdminLayout } from '../components/AdminLayout'
import { AdminParticipantsPage } from '../pages/admin/AdminParticipantsPage'
import { AdminReactionPage } from '../pages/admin/AdminReactionPage'
import { AdminPollsPage } from '../pages/admin/AdminPollsPage'
import { AdminHapticPage } from '../pages/admin/AdminHapticPage'
import { AdminBingoPage } from '../pages/admin/AdminBingoPage'
import { PresentationPage } from '../pages/PresentationPage'
import { WsUserHapticListener } from '../components/WsUserHapticListener'

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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
