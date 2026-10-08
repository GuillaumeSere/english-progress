import { useEffect, useState } from 'react'
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  Headphones,
  Home,
  Languages,
  Library,
  Menu,
  MessageCircle,
  Mic2,
  Target,
  X,
} from './icons'
import type { Page } from './pageTypes'
import { Button, go } from './ui'
const nav: { title: string; href: Page; icon: typeof Home }[] = [
  { title: 'Accueil', href: 'home', icon: Home },
  { title: 'Cours', href: 'cours', icon: BookOpen },
  { title: 'Vocabulaire', href: 'vocabulaire', icon: Library },
  { title: 'Grammaire', href: 'grammaire', icon: Languages },
  { title: 'Conversations', href: 'conversations', icon: MessageCircle },
  { title: 'Listening', href: 'listening', icon: Headphones },
  { title: 'Prononciation', href: 'prononciation', icon: Mic2 },
  { title: 'Quiz', href: 'quiz', icon: Target },
  { title: 'English for Work', href: 'anglais-professionnel', icon: BriefcaseBusiness },
]
function href(p: Page) {
  if (p === 'home') return '/'
  if (p === 'anglais-professionnel') return '/anglais-professionnel'
  return `/${p}`
}
export function Header({ current }: { current: Page }) {
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [current])
  return (
    <header className="site-header">
      <div className="nav-shell">
        <button className="brand" onClick={() => go('/')} aria-label="English Progress, accueil">
          <span className="brand-mark">
            <span />
          </span>
          <span>
            english<span className="brand-light">progress</span>
          </span>
        </button>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {nav.map(({ title, href: page }) => (
            <button
              key={page}
              onClick={() => go(href(page))}
              className={`nav-link ${current === page ? 'active' : ''}`}
            >
              {title}
            </button>
          ))}
        </nav>
        <Button tone="light" size="small" onClick={() => go('/progression')}>
          Ma progression <ChevronRight size={15} />
        </Button>
        <button
          className="mobile-menu-button"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Navigation mobile">
          {nav.map(({ title, href: page, icon: Icon }) => (
            <button
              key={page}
              onClick={() => go(href(page))}
              className={current === page ? 'active' : ''}
            >
              <Icon size={17} />
              {title}
            </button>
          ))}
          <button onClick={() => go('/progression')}>Ma progression</button>
        </nav>
      )}
    </header>
  )
}
export function Footer() {
  return (
    <footer className="site-footer">
      <button className="brand footer-brand" onClick={() => go('/')}>
        <span className="brand-mark">
          <span />
        </span>
        <span>
          english<span className="brand-light">progress</span>
        </span>
      </button>
      <span>Apprenez à votre façon. À votre rythme.</span>
      <span>© 2026 ENGLISH PROGRESS</span>
    </footer>
  )
}
