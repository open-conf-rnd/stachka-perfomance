import { useCallback, useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { wsUrl } from '../../../config'
import { fetchParticipants, type Participant } from '../participants'
import './RegistrationSlide.css'

const BOT_LINK = 'https://t.me/stachkagrosh_bot'
const DISPLAY_CHANNEL = 'display:participants'

function getInitials(firstName: string, lastName: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? ''
  const last = lastName?.charAt(0)?.toUpperCase() ?? ''
  return (first + last).slice(0, 2) || '?'
}

function ParticipantBubble({ p, size }: { p: Participant; size: number }) {
  return (
    <div className="registration-bubble">
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

interface RegistrationSlideProps {
  displayToken?: string
}

export function RegistrationSlide({ displayToken }: RegistrationSlideProps) {
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
  const hasParticipants = count >= 1
  const baseSize = 120
  const minSize = 56
  const size = count <= 8 ? baseSize : Math.max(minSize, baseSize - (count - 8) * 6)

  return (
    <div className={`registration-slide ${hasParticipants ? 'registration-slide--has-participants' : ''}`}>
      {!hasParticipants && <h2 style={{ margin: 0 }}>Регистрация</h2>}
      <div className="registration-qr">
        <QRCodeSVG
          value={BOT_LINK}
          size={hasParticipants ? 100 : 180}
          level="M"
          bgColor="transparent"
          fgColor="white"
        />
        {!hasParticipants && (
          <>
            <p>Сканируйте QR — откройте бота и Mini App</p>
            <p style={{ fontSize: '0.75em', opacity: 0.7 }}>@stachkagrosh_bot</p>
          </>
        )}
      </div>
      <div className="registration-bubbles">
        {participants.map((p) => (
          <ParticipantBubble key={p.id} p={p} size={size} />
        ))}
      </div>
    </div>
  )
}
