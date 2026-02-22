import { useState, useCallback } from 'react'
import { useThemeParams } from '@telegram-apps/sdk-react'
import { apiBase, wsUrl } from './config'
import './App.css'

type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

interface StatsPayload {
  pollId: string
  question: string
  optionIds: string[]
  optionLabels: Record<string, string>
  counts: Record<string, number>
  total: number
}

function App() {
  const themeParams = useThemeParams()
  const [apiResult, setApiResult] = useState<string | null>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [wsStatus, setWsStatus] = useState<WsStatus>('idle')
  const [wsStats, setWsStats] = useState<StatsPayload | null>(null)
  const [wsConn, setWsConn] = useState<WebSocket | null>(null)
  const [wsError, setWsError] = useState<string | null>(null)

  const checkApi = useCallback(async () => {
    setApiLoading(true)
    setApiResult(null)
    try {
      const url = apiBase ? `${apiBase}/health` : '/api/health'
      const res = await fetch(url)
      const data = await res.json().catch(() => ({}))
      setApiResult(res.ok ? `OK: ${JSON.stringify(data)}` : `HTTP ${res.status}: ${JSON.stringify(data)}`)
    } catch (e) {
      setApiResult(`Ошибка: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setApiLoading(false)
    }
  }, [])

  const checkWs = useCallback(() => {
    if (wsConn) {
      wsConn.close(1000, 'Normal closure')
      setWsConn(null)
      setWsStatus('closed')
      setWsStats(null)
      setWsError(null)
      return
    }
    setWsStatus('connecting')
    setWsStats(null)
    setWsError(null)
    const ws = new WebSocket(wsUrl)
    ws.onopen = () => {
      setWsStatus('open')
      setWsError(null)
      ws.send(JSON.stringify({ type: 'subscribe', pollId: 'test-poll' }))
    }
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'stats' && msg.payload) setWsStats(msg.payload)
      } catch {
        // ignore
      }
    }
    ws.onclose = (event) => {
      setWsConn(null)
      // 1000 = нормальное закрытие, 1005 = закрыто без кода (часто при явном disconnect)
      if (event.code !== 1000 && event.code !== 1005) {
        setWsStatus('error')
        setWsError(`Код ${event.code}${event.reason ? `: ${event.reason}` : ''}`)
      } else {
        setWsStatus('closed')
      }
    }
    ws.onerror = () => {
      setWsStatus('error')
      setWsConn(null)
      setWsError('Ошибка соединения')
    }
    setWsConn(ws)
  }, [wsConn, wsUrl])

  const sendVote = useCallback(() => {
    if (!wsConn || wsConn.readyState !== WebSocket.OPEN) return
    wsConn.send(
      JSON.stringify({
        type: 'vote',
        pollId: 'test-poll',
        optionId: 'yes',
        question: 'Тест в Telegram?',
        optionIds: ['yes', 'no'],
        optionLabels: { yes: 'Да', no: 'Нет' },
      })
    )
  }, [wsConn])

  return (
    <div
      className="app"
      style={{
        backgroundColor: themeParams?.bgColor ?? '#1c1c1e',
        color: themeParams?.textColor ?? '#ffffff',
      }}
    >
      <h1>TG Mini App</h1>
      <p className="app__subtitle">Проверка API и WebSocket</p>

      <section className="app__tests">
        <div className="app__block">
          <button type="button" className="app__btn" onClick={checkApi} disabled={apiLoading}>
            {apiLoading ? 'Запрос…' : 'Проверить API'}
          </button>
          {apiResult !== null && (
            <pre className="app__result">{apiResult}</pre>
          )}
        </div>

        <div className="app__block">
          <button type="button" className="app__btn" onClick={checkWs}>
            {wsConn ? 'Отключить WS' : 'Проверить WS'}
          </button>
          <span className="app__status">WS: {wsStatus}</span>
          {(wsStatus !== 'idle' || wsError) && (
            <span className="app__url" title={wsUrl}>{wsUrl}</span>
          )}
          {wsError && (
            <span className="app__error">
              {wsError}
              {wsError.includes('1006') && (
                <span className="app__error-hint">
                  {' '}Обычно: сервис ws не запущен или nginx не проксирует. Проверьте <code>docker ps</code> и логи <code>ws</code>, <code>nginx</code>.
                </span>
              )}
            </span>
          )}
          {wsStats && (
            <div className="app__result">
              <div className="app__result-title">{wsStats.question || wsStats.pollId}</div>
              <div className="app__result-total">Голосов: {wsStats.total}</div>
              {wsStats.total === 0 ? (
                <div className="app__result-empty">Пока нет голосов. Нажми «Отправить голос».</div>
              ) : (
                <ul className="app__result-list">
                  {(wsStats.optionIds?.length ? wsStats.optionIds : Object.keys(wsStats.counts)).map((id) => (
                    <li key={id}>
                      {wsStats.optionLabels?.[id] ?? id}: {wsStats.counts[id] ?? 0}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {wsConn && wsConn.readyState === WebSocket.OPEN && (
            <button type="button" className="app__btn app__btn--small" onClick={sendVote}>
              Отправить голос
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
