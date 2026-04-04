import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  subscribePresentationChannel,
  subscribePresentationWs,
} from '../../../../lib/presentationWs'
import { fetchParticipants, fetchDisplayParticipants, type Participant } from '../participants'
import './RegistrationSlide.css'

const BOT_LINK = 'https://t.me/stachkagrosh_bot?startapp=home'
const DISPLAY_CHANNEL = 'display:participants'

/**
 * Зоны покрывают весь экран: центр, все углы, края.
 * Порядок: центр → углы → края → вторичные точки.
 * Для N > 25 дублируем с небольшим смещением.
 */
const ZONE_POSITIONS: [number, number][] = [
  [50, 48], [18, 15], [82, 12], [15, 85], [88, 88],
  [48, 18], [52, 82], [12, 48], [85, 52],
  [30, 30], [72, 25], [25, 72], [75, 75],
  [38, 55], [62, 42], [22, 38], [78, 62], [55, 72], [42, 28],
  [8, 22], [92, 78], [8, 72], [92, 18], [35, 85], [65, 12],
]

/** Дополнительные зоны для N > 25: сетка со смещением, равномерно по экрану. */
function generateExtraZones(extraCount: number, startIndex: number): { left: number; top: number }[] {
  const cols = Math.ceil(Math.sqrt(extraCount * 1.3))
  const rows = Math.ceil(extraCount / cols)
  const stepX = 75 / cols
  const stepY = 70 / rows
  const offset = (startIndex % 3) * 8
  const pos: { left: number; top: number }[] = []
  for (let i = 0; i < extraCount; i++) {
    const c = i % cols
    const r = Math.floor(i / cols)
    const shiftX = (r % 2) * (stepX / 2)
    const left = 12 + c * stepX + shiftX + (offset % 7)
    const top = 12 + r * stepY + ((startIndex * 3) % 5)
    pos.push({
      left: Math.max(8, Math.min(92, left)),
      top: Math.max(8, Math.min(90, top)),
    })
  }
  return pos
}

function computeScatterPositions(
  count: number,
  _size: number,
  _containerW: number,
  _containerH: number
): { left: number; top: number }[] {
  if (count === 0) return []
  const positions: { left: number; top: number }[] = []

  for (let i = 0; i < Math.min(count, ZONE_POSITIONS.length); i++) {
    const zone = ZONE_POSITIONS[i]
    const jitterX = ((i * 7) % 11) - 5
    const jitterY = ((i * 13) % 9) - 4
    positions.push({
      left: Math.max(6, Math.min(94, zone[0] + jitterX)),
      top: Math.max(5, Math.min(92, zone[1] + jitterY)),
    })
  }

  if (count > ZONE_POSITIONS.length) {
    positions.push(
      ...generateExtraZones(count - ZONE_POSITIONS.length, ZONE_POSITIONS.length)
    )
  }

  return positions.slice(0, count)
}

/** Порядок от центра: сначала средние элементы, затем к краям (для анимации) */
function arrangeFromCenter<T>(arr: T[]): T[] {
  if (arr.length <= 1) return [...arr]
  const center = (arr.length - 1) / 2
  const indices = arr.map((_, i) => i).sort((a, b) => {
    const distA = Math.abs(a - center)
    const distB = Math.abs(b - center)
    return distA - distB
  })
  return indices.map((i) => arr[i])
}

function getInitials(firstName: string, lastName: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? ''
  const last = lastName?.charAt(0)?.toUpperCase() ?? ''
  return (first + last).slice(0, 2) || '?'
}

function ParticipantBubble({
  p,
  size,
  index,
  pulseDelay,
  position,
}: {
  p: Participant
  size: number
  index: number
  pulseDelay: number
  position: { left: number; top: number }
}) {
  return (
    <div
      className="registration-bubble"
      style={{
        animationDelay: `${index * 0.12}s`,
        left: `${position.left}%`,
        top: `${position.top}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="registration-bubble-circle"
        style={{
          width: size,
          height: size,
          fontSize: Math.max(10, size * 0.4),
          animationDelay: `${pulseDelay}s`,
          animationDuration: `${1.8 + (index % 3) * 0.4}s`,
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

export function RegistrationSlide() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const bubblesRef = useRef<HTMLDivElement>(null)
  const [computedSize, setComputedSize] = useState(80)
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 })

  const count = participants.length
  const hasParticipants = count >= 1

  const displayToken =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('display_token') ||
        (import.meta as unknown as { env?: { VITE_DISPLAY_TOKEN?: string } }).env?.VITE_DISPLAY_TOKEN ||
        ''
      : ''

  const loadInitial = useCallback(() => {
    const load =
      displayToken.length > 0
        ? fetchDisplayParticipants(displayToken)
        : fetchParticipants()
    load
      .then(setParticipants)
      .catch((err) => setError(err instanceof Error ? err.message : 'Ошибка'))
      .finally(() => setLoading(false))
  }, [displayToken])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  // Подписка на канал и приём событий регистрации в реальном времени
  useEffect(() => {
    const unsubscribeChannel = subscribePresentationChannel(DISPLAY_CHANNEL)
    const unsubscribeMessages = subscribePresentationWs((msg) => {
      if (msg.type !== 'participant:registered' || !msg.payload) return
      const p = msg.payload as Participant
      setParticipants((prev) => {
        if (prev.some((x) => x.id === p.id)) return prev
        return [...prev, p]
      })
    })

    return () => {
      unsubscribeMessages()
      unsubscribeChannel()
    }
  }, [])

  // Подстраховка: периодический refetch, если WS-события не дошли (например API не достучится до WS)
  useEffect(() => {
    const interval = setInterval(() => {
      const load =
        displayToken.length > 0
          ? fetchDisplayParticipants(displayToken)
          : fetchParticipants()
      load.then(setParticipants).catch(() => {})
    }, 15000)
    return () => clearInterval(interval)
  }, [displayToken])

  useEffect(() => {
    if (!hasParticipants || count === 0) return
    const el = bubblesRef.current
    if (!el) return
    const updateSize = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      if (w <= 0 || h <= 0) return
      setContainerSize({ w, h })
      const area = w * h
      const bubbleArea = (area * 0.8) / count
      const rawSize = Math.sqrt(bubbleArea)
      setComputedSize(Math.max(40, Math.min(200, rawSize)))
    }
    const raf = requestAnimationFrame(updateSize)
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [hasParticipants, count])

  const arranged = useMemo(() => arrangeFromCenter(participants), [participants])
  const positions = useMemo(
    () =>
      computeScatterPositions(
        arranged.length,
        computedSize,
        containerSize.w,
        containerSize.h
      ),
    [arranged.length, computedSize, containerSize.w, containerSize.h]
  )

  if (loading && participants.length === 0) return <p>Загрузка...</p>
  if (error && participants.length === 0) return <p className="fragment">Ошибка: {error}</p>

  return (
    <div className={`registration-slide ${hasParticipants ? 'registration-slide--has-participants' : ''}`}>
      {!hasParticipants && <h2 className="registration-title">Регистрация</h2>}
      <div className={`registration-qr ${hasParticipants ? 'registration-qr--compact' : 'registration-qr--full'}`}>
        <div className="registration-qr__svg">
          <QRCodeSVG
            value={BOT_LINK}
            size={600}
            level="M"
            bgColor="transparent"
            fgColor="#1a1a1a"
          />
        </div>
        {!hasParticipants && (
          <>
            <p className="registration-text">Сканируйте QR — откройте бота и Mini App</p>
            <p className="registration-bot">@stachkagrosh_bot</p>
          </>
        )}
      </div>
      {hasParticipants && (
      <div ref={bubblesRef} className="registration-bubbles">
        {arranged.map((p, i) => (
          <ParticipantBubble
            key={p.id}
            p={p}
            size={computedSize}
            index={i}
            pulseDelay={i * 0.35}
            position={positions[i] ?? { left: 50, top: 50 }}
          />
        ))}
      </div>
      )}
    </div>
  )
}
