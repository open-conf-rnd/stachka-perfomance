import type { ReactNode } from 'react'
import { useTelegramBackButton } from '../../hooks/useTelegramBackButton'
import './PageLayout.css'

interface PageLayoutProps {
  title: string
  subtitle: string
  children?: ReactNode
  enableBackButton?: boolean
}

export function PageLayout({ title, subtitle, children, enableBackButton = true }: PageLayoutProps) {
  useTelegramBackButton(enableBackButton)

  return (
    <main className="page">
      <h1 className="page__title">{title}</h1>
      <p className="page__subtitle">{subtitle}</p>
      <section className="page__card">{children}</section>
    </main>
  )
}
