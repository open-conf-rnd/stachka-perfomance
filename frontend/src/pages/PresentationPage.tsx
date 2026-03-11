import { useCallback, useEffect, useState } from 'react'
import { Deck, Slide } from '@revealjs/react'
import { QRCodeSVG } from 'qrcode.react'
import { apiRequest } from '../lib/api'
import { apiBase, wsUrl } from '../config'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'

const BOT_LINK = 'https://t.me/stachkagrosh_bot'
const DISPLAY_CHANNEL = 'display:participants'

interface Participant {
  id: string
  firstName: string
  lastName: string | null
  username: string | null
  photoUrl?: string | null
  completionsCount?: number
}

async function fetchParticipants(displayToken?: string): Promise<Participant[]> {
  if (displayToken) {
    const url = apiBase
      ? `${apiBase}/api/display/participants?token=${encodeURIComponent(displayToken)}`
      : `/api/display/participants?token=${encodeURIComponent(displayToken)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Не удалось загрузить участников')
    return res.json()
  }
  try {
    return await apiRequest<Participant[]>('/api/admin/participants')
  } catch {
    return []
  }
}

function getInitials(firstName: string, lastName: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? ''
  const last = lastName?.charAt(0)?.toUpperCase() ?? ''
  return (first + last).slice(0, 2) || '?'
}

function ParticipantBubble({ p, size }: { p: Participant; size: number }) {
  return (
    <div className="registration-bubble" key={p.id}>
      <div
        className="registration-bubble-circle"
        style={{
          width: size,
          height: size,
          fontSize: Math.max(10, size * 0.4),
        }}
      >
        {p.photoUrl ? (
          <img src={p.photoUrl} alt="" />
        ) : (
          <span className="registration-bubble-initials">
            {getInitials(p.firstName, p.lastName)}
          </span>
        )}
      </div>
      <span className="registration-bubble-name">
        {[p.firstName, p.lastName].filter(Boolean).join(' ')}
      </span>
    </div>
  )
}

function RegistrationSlideContent({ displayToken }: { displayToken?: string }) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInitial = useCallback(() => {
    fetchParticipants(displayToken)
      .then(setParticipants)
      .catch((err) => setError(err instanceof Error ? err.message : 'Ошибка'))
      .finally(() => setLoading(false))
  }, [displayToken])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  useEffect(() => {
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', channel: DISPLAY_CHANNEL }))
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { type: string; payload: Participant }
        if (msg.type === 'participant:registered' && msg.payload) {
          const p = msg.payload
          setParticipants((prev) => {
            if (prev.some((x) => x.id === p.id)) return prev
            return [...prev, p]
          })
        }
      } catch {
        // ignore
      }
    }

    return () => ws.close()
  }, [])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p className="fragment">Ошибка: {error}</p>

  const count = participants.length
  const baseSize = 120
  const minSize = 56
  const size = count <= 8 ? baseSize : Math.max(minSize, baseSize - (count - 8) * 6)

  return (
    <div className="registration-slide">
      <div className="registration-qr">
        <QRCodeSVG
          value={BOT_LINK}
          size={180}
          level="M"
          bgColor="transparent"
          fgColor="white"
        />
        <p>Сканируйте QR — откройте бота и Mini App</p>
        <p style={{ fontSize: '0.75em', opacity: 0.7 }}>@stachkagrosh_bot</p>
      </div>
      <div className="registration-bubbles">
        {participants.map((p) => (
          <ParticipantBubble key={p.id} p={p} size={size} />
        ))}
      </div>
    </div>
  )
}

function ParticipantsSlideContent({ displayToken }: { displayToken?: string }) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchParticipants(displayToken)
      .then((data) => {
        if (active) setParticipants(data)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Ошибка')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [displayToken])

  if (loading) return <p>Загрузка участников...</p>
  if (error) return <p className="fragment">Ошибка: {error}</p>
  if (participants.length === 0) return <p>Пока никто не зарегистрировался</p>

  return (
    <div style={{ maxHeight: '60vh', overflowY: 'auto', textAlign: 'left' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {participants.map((p, i) => (
          <li
            key={p.id}
            className="fragment"
            style={{
              padding: '0.5rem 0.75rem',
              marginBottom: '0.25rem',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
            }}
          >
            <strong>{i + 1}.</strong>{' '}
            {[p.firstName, p.lastName].filter(Boolean).join(' ')}
            {p.username ? ` (@${p.username})` : ''}
            <span style={{ opacity: 0.8, marginLeft: '0.5rem' }}>
              — {p.completionsCount ?? 0} бинго
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PresentationPage() {
  const displayToken =
    typeof location !== 'undefined'
      ? new URLSearchParams(location.search).get('token')
      : undefined

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <style>{`
        .registration-slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 0.5rem;
        }
        .registration-qr {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .registration-qr p {
          margin: 0;
          font-size: 0.9em;
        }
        .registration-bubbles {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.6rem 1rem;
          max-width: 95%;
        }
        .registration-bubble {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          animation: bubble-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .registration-bubble-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: width 0.3s ease, height 0.3s ease, font-size 0.3s ease;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(139, 92, 246, 0.7));
          border: 2px solid rgba(255, 255, 255, 0.35);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .registration-bubble-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .registration-bubble-initials {
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .registration-bubble-name {
          font-size: 0.65em;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.95;
          text-align: center;
        }
        @keyframes bubble-pop {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <Deck
        config={{
          hash: true,
          transition: 'slide',
          controls: true,
          progress: true,
          center: true,
        }}
      >
        <Slide>
          <h2>Пишем помощника для</h2>
          <h2>вашего хобби на</h2>
          <h2>Telegram mini App</h2>
        </Slide>

        <Slide>
          <h2>Кто я</h2>
          <p>Фулстек-разработчик в Айтулаб</p>
          <p>Дима Гро</p>
        </Slide>

        <Slide>
          <h2>Делаю разные митапы и конференции</h2>
          <p>OpenCon · Фронтенд? Да, ну · Кодь</p>
        </Slide>

        <Slide>
          <h2>Чего ждать от доклада</h2>
        </Slide>

        <Slide>
          <h2>Регистрация</h2>
          <RegistrationSlideContent displayToken={displayToken ?? undefined} />
        </Slide>

        <Slide>
          <h2>Участники</h2>
          <p style={{ fontSize: '0.8em', opacity: 0.8 }}>Зарегистрированные участники</p>
          <ParticipantsSlideContent displayToken={displayToken ?? undefined} />
        </Slide>

        <Slide>
          <h2>Спасибо!</h2>
          <p>Используйте стрелки или пробел для навигации</p>
        </Slide>
      </Deck>
    </div>
  )
}
