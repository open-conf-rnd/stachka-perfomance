import { useEffect, useState } from 'react'
import { fetchParticipants, type Participant } from '../participants'
import './ParticipantsSlide.css'

interface ParticipantsSlideProps {
  displayToken?: string
}

export function ParticipantsSlide({ displayToken }: ParticipantsSlideProps) {
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
    <div className="participants-list">
      <ul className="participants-list__items">
        {participants.map((p, i) => (
          <li key={p.id} className="participants-list__item fragment">
            <strong>{i + 1}.</strong>{' '}
            {[p.firstName, p.lastName].filter(Boolean).join(' ')}
            {p.username ? ` (@${p.username})` : ''}
            <span className="participants-list__bingo">— {p.completionsCount ?? 0} бинго</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
