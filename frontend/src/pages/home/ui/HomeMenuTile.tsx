import { Link } from 'react-router-dom'

interface HomeMenuTileProps {
  path: string
  title: string
  desc: string
}

export function HomeMenuTile({ path, title, desc }: HomeMenuTileProps) {
  return (
    <Link to={path} className="grid__item">
      <span className="grid__item-title">{title}</span>
      <span className="grid__item-desc">{desc}</span>
    </Link>
  )
}
