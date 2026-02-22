import { useThemeParams } from '@telegram-apps/sdk-react'
import './App.css'

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
      <h1>TG Mini App</h1>
      <p>Локальная разработка: React + TypeScript + Vite</p>
    </div>
  )
}

export default App
