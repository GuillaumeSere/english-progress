import { useEffect, useState } from 'react'
import { Footer, Header } from './layout'
import type { Page } from './pageTypes'
import { LessonPage, NotFound } from './pages-lesson'
import { CoursePage, HomePage, VocabularyPage } from './pages-primary'
import { ProgressPage, PronunciationPage, WorkPage } from './pages-professional'
import {
  ConversationsPage,
  GrammarPage,
  LevelTestPage,
  ListeningPage,
  QuizPage,
} from './pages-study'
import './styles.css'
const titles: Record<Page, string> = {
  home: 'Apprendre l’anglais, un peu chaque jour.',
  cours: 'Un parcours clair, à votre rythme.',
  vocabulaire: 'Les mots qu’on utilise vraiment.',
  grammaire: 'La grammaire en clair.',
  conversations: 'L’anglais commence par une conversation.',
  listening: 'Une minute d’écoute, un pas en avant.',
  prononciation: 'Trouver le rythme de l’anglais.',
  quiz: 'Voyez ce que vous avez retenu.',
  'test-niveau': 'Faisons connaissance avec votre anglais.',
  'anglais-professionnel': 'Un anglais professionnel plus naturel.',
  progression: 'Chaque petit pas compte.',
  lesson: 'Une leçon à votre rythme.',
  'not-found': 'Cette page n’existe pas.',
}
function current() {
  return window.location.pathname + window.location.search
}
function view(url: string): Page {
  const pathname = url.split('?')[0]
  const p = pathname.split('/').filter(Boolean)
  if (!p.length) return 'home'
  if (p[0] === 'cours' && p.length === 2 && ['a1', 'a2', 'b1'].includes(p[1])) return 'cours'
  if (p[0] === 'cours' && p.length === 2) return 'not-found'
  if (p[0] === 'cours' && p.length >= 3) return 'lesson'
  if (p[0] === 'cours') return 'cours'
  if (
    [
      'vocabulaire',
      'grammaire',
      'conversations',
      'listening',
      'prononciation',
      'quiz',
      'test-niveau',
      'anglais-professionnel',
      'progression',
    ].includes(p[0]) &&
    p.length === 1
  )
    return p[0] as Page
  return 'not-found'
}
function content(page: Page) {
  switch (page) {
    case 'home':
      return <HomePage />
    case 'cours':
      return <CoursePage />
    case 'lesson':
      return <LessonPage />
    case 'vocabulaire':
      return <VocabularyPage />
    case 'grammaire':
      return <GrammarPage />
    case 'conversations':
      return <ConversationsPage />
    case 'listening':
      return <ListeningPage />
    case 'prononciation':
      return <PronunciationPage />
    case 'quiz':
      return <QuizPage />
    case 'test-niveau':
      return <LevelTestPage />
    case 'anglais-professionnel':
      return <WorkPage />
    case 'progression':
      return <ProgressPage />
    default:
      return <NotFound />
  }
}
export default function App() {
  const [url, setUrl] = useState(current)
  const page = view(url)
  useEffect(() => {
    const f = () => {
      setUrl(current())
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', f)
    return () => window.removeEventListener('popstate', f)
  }, [])
  useEffect(() => {
    document.title = `${titles[page]} | English Progress`
  }, [page])
  return (
    <>
      <Header current={page} />
      <main className="site-main">{content(page)}</main>
      <Footer />
    </>
  )
}
