import { Link } from 'react-router-dom'

interface ReactionRoundListLinkProps {
  id: string
  roundNumber: number
  participantsCount: number
  metaLine: string
}

export function ReactionRoundListLink({
  id,
  roundNumber,
  participantsCount,
  metaLine,
}: ReactionRoundListLinkProps) {
  return (
    <Link
      to={`/reaction/rounds/${id}`}
      className="grid__item"
      style={{ textDecoration: 'none' }}
    >
      <span className="grid__item-title">
        Раунд №{roundNumber}
        {roundNumber === 0 ? ` (${id.slice(0, 8)}…)` : ''}
      </span>
      <span className="grid__item-desc">
        {participantsCount} участников · {metaLine}
      </span>
    </Link>
  )
}
