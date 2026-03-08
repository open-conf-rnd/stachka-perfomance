import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useThemeParams } from '@telegram-apps/sdk-react'
import './App.css'
import { HomePage } from './pages/HomePage'
import { RegisterPage } from './pages/RegisterPage'
import { WelcomePage } from './pages/WelcomePage'
import { BingoPage } from './pages/BingoPage'
import { QrVerifyPage } from './pages/QrVerifyPage'
import { PollsPage } from './pages/PollsPage'
import { TapPage } from './pages/TapPage'
import { ReactionPage } from './pages/ReactionPage'
import { ReactionRoundsPage } from './pages/ReactionRoundsPage'
import { ReactionRoundDetailPage } from './pages/ReactionRoundDetailPage'
import { HapticPage } from './pages/HapticPage'
import { SupportPage } from './pages/SupportPage'

function App() {
  const themeParams = useThemeParams()

  return (
    <div
      className="app"
      style={{
        backgroundColor: themeParams?.bgColor ?? '#1c1c1e',
        color: themeParams?.textColor ?? '#ffffff',
      }}
    >
      <BrowserRouter>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
