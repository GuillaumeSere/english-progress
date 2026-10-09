import { useMemo, useState } from 'react'
import {
  ALL_LESSONS,
  LEVELS,
  VOCABULARY,
  VOCABULARY_CATEGORIES,
  type VocabularyWord,
} from '../data/index'
import { Check, Heart, MoveRight, RotateCcw, Search } from './icons'
import {
  getLevelCompletion,
  getNextLesson,
  getProgress,
  markWordAsKnown,
} from './services/progressStore'
import { Button, CourseCard, LevelCard, PageIntro, Pill, SectionTitle, SpeakButton, go } from './ui'
export function HomePage() {
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="YOUR EVERYDAY ENGLISH ROUTINE"
        title="L’anglais, à votre rythme."
        description="Des cours courts, des dialogues naturels et des exercices bien pensés. Juste ce qu’il faut pour progresser, un peu chaque jour."
      />
      <div className="hero-actions">
        <Button
          onClick={() => {
            const l = getNextLesson()
            go(l ? `/cours/${l.level.toLowerCase()}/${l.id.slice(l.level.length + 1)}` : '/cours')
          }}
        >
          Continuer mon apprentissage <MoveRight size={17} />
        </Button>
        <Button tone="light" onClick={() => go('/test-niveau')}>
          Tester mon niveau
        </Button>
      </div>
      <section className="level-section">
        <SectionTitle
          eyebrow=""
          title="Trouvez votre niveau."
          description="À chaque étape, des leçons adaptées et de nouveaux repères."
        />
        <div className="level-grid">
          {LEVELS.map((l) => (
            <LevelCard
              key={l.id}
              level={l}
              progress={getLevelCompletion(l.name as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2')}
              onClick={() => go(`/cours/${l.name.toLowerCase()}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
export function CoursePage() {
  const readLevel = () => {
    const value = new URLSearchParams(window.location.search).get('level')
    const routeLevel = window.location.pathname.split('/').filter(Boolean)[1]?.toUpperCase()
    const level = routeLevel ?? value
    return level && LEVELS.some((item) => item.name === level) ? level : 'Tout mon parcours'
  }
  const [filter, setFilter] = useState(readLevel)
  const selectLevel = (value: string) => {
    setFilter(value)
    const url = value === 'Tout mon parcours' ? '/cours' : `/cours/${value.toLowerCase()}`
    window.history.replaceState({}, '', url)
  }
  const filters = ['Tout mon parcours', ...LEVELS.map((level) => level.name)]
  const items = ALL_LESSONS.filter((l) => filter === 'Tout mon parcours' || l.level === filter)
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="PARCOURS D’APPRENTISSAGE"
        title={filter === 'Tout mon parcours' ? 'Un parcours, étape par étape.' : `Parcours ${filter}`}
        description={filter === 'Tout mon parcours' ? 'Choisissez un point de départ. Chaque leçon va à l’essentiel, pour avancer sans pression.' : `Les leçons de niveau ${filter}, dans l’ordre qui vous convient.`}
      />
      <div className="level-grid">
        {LEVELS.map((l) => (
          <LevelCard
            key={l.id}
            level={l}
            progress={getLevelCompletion(l.name as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2')}
            onClick={() => selectLevel(l.name)}
          />
        ))}
      </div>
      <div className="course-list-heading">
        <SectionTitle
          eyebrow="VOTRE PARCOURS"
          title="Les leçons"
          description={`${items.length} leçons à découvrir · commencez par celle qui vous inspire.`}
        />
        <div className="filter-pills">
          {filters.map((f) => (
            <button key={f} className={filter === f ? 'selected' : ''} onClick={() => selectLevel(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="course-list">
        {items.map((l, i) => (
          <CourseCard
            key={l.id}
            lesson={l}
            index={i}
            onClick={() => go(`/cours/${l.level.toLowerCase()}/${l.id.slice(l.level.length + 1)}`)}
          />
        ))}
      </div>
    </div>
  )
}
function WordCard({ word }: { word: VocabularyWord }) {
  const [known, setKnown] = useState(getProgress().knownWords.includes(word.id))
  return (
    <article className="vocab-card">
      <div className="vocab-card-top">
        <Pill tone="muted">{word.category}</Pill>
        <SpeakButton text={word.english} audioFile={`vocabulary/${word.id}.mp3`} />
      </div>
      <span className="vocab-number">{word.level} · {word.id}</span>
      <h3>{word.english}</h3>
      <span className="pronunciation">/{word.pronunciation}/</span>
      <p className="vocab-translation">{word.french}</p>
      {word.context && <div className="vocab-example"><div><span>IN CONTEXT</span><p>{word.context}</p><small>{word.contextFr}</small><SpeakButton text={word.context} /></div></div>}
      <div className="vocab-example">
        <div>
          <span>EXAMPLE</span>
          <p>{word.example}</p>
          <small>{word.exampleFr}</small>
        </div>
        <button
          className={`know-button ${known ? 'known' : ''}`}
          onClick={() => {
            if (!known) {
              markWordAsKnown(word.id)
              setKnown(true)
            }
          }}
          aria-label={`Je connais ${word.english}`}
        >
          {known ? <Check size={15} /> : <Heart size={15} />}
        </button>
      </div>
    </article>
  )
}
export function VocabularyPage() {
  const [category, setCategory] = useState('Toutes')
  const [levelFilter, setLevelFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [flash, setFlash] = useState(false)
  const [card, setCard] = useState(0)
  const [flip, setFlip] = useState(false)
  const items = useMemo(
    () =>
      VOCABULARY.filter(
        (w) =>
          (category === 'Toutes' || category === w.category) &&
          (levelFilter === 'Tous' || levelFilter === w.level) &&
          (w.english.toLowerCase().includes(query.toLowerCase()) ||
            w.french.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, category, levelFilter],
  )
  const reviewItems = useMemo(
    () => items.filter((word) => !getProgress().knownWords.includes(word.id)),
    [items, card, flash],
  )
  const current = reviewItems[card % Math.max(reviewItems.length, 1)]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="A LITTLE VOCABULARY GOES A LONG WAY"
        title="Les bons mots, au bon moment."
        description="Plus de 150 expressions, collocations et mots utiles, avec leur traduction, leur prononciation, des exemples et une lecture audio. Filtrez par niveau pour réviser à votre rythme."
      />
      <div className="vocab-toolbar">
        <label className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher un mot…"
            aria-label="Chercher un mot"
          />
        </label>
        <Button
          tone="light"
          onClick={() => {
            setCard(0)
            setFlip(false)
            setFlash(true)
          }}
        >
          Réviser les mots <RotateCcw size={15} />
        </Button>
      </div>
      <div className="vocabulary-filters" aria-label="Filtres du vocabulaire">
        <div className="category-strip level-filter-strip" aria-label="Filtrer par niveau">
          {['Tous', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
            <button type="button" aria-pressed={levelFilter === level} className={levelFilter === level ? 'selected' : ''} key={level} onClick={() => { setLevelFilter(level); setCategory('Toutes'); setCard(0); setFlip(false) }}>{level}</button>
          ))}
        </div>
        <div className="category-strip topic-filter-strip" aria-label="Filtrer par thème">
          {VOCABULARY_CATEGORIES.map((c) => (
            <button type="button" aria-pressed={category === c} className={category === c ? 'selected' : ''} onClick={() => { setCategory(c); setLevelFilter('Tous'); setCard(0); setFlip(false) }} key={c}>{c}</button>
          ))}
        </div>
      </div>      {flash && reviewItems.length === 0 && (
        <div className="flashcard-section flashcard-empty">
          <p>Tous les mots de cette sélection sont déjà marqués comme connus.</p>
          <Button tone="light" onClick={() => setFlash(false)}>Fermer</Button>
        </div>
      )}
      {flash && reviewItems.length > 0 && (
        <div className="flashcard-section">
          <button className="flashcard-face" onClick={() => setFlip(!flip)}>
            <span className="eyebrow">
              CARTE {card + 1} / {reviewItems.length}
            </span>
            <h2>{flip ? current.french : current.english}</h2>
            <p>{flip ? current.example : 'Touchez pour révéler la réponse'}</p>
          </button>
          <div className="flashcard-actions">
            <Button
              tone="light"
              onClick={() => {
                setCard((card + 1) % reviewItems.length)
                setFlip(false)
              }}
            >
              À revoir <RotateCcw size={15} />
            </Button>
            <SpeakButton text={current.english} audioFile={`vocabulary/${current.id}.mp3`} />
            <Button
              onClick={() => {
                markWordAsKnown(current.id)
                setCard(0)
                setFlip(false)
              }}
            >
              Je connais <Heart size={15} />
            </Button>
            <button className="icon-button" onClick={() => setFlash(false)} aria-label="Fermer">
              ×
            </button>
          </div>
        </div>
      )}
      {items.length === 0 ? (
        <div className="vocab-empty" role="status">
          <strong>Aucun mot trouvé avec ces filtres.</strong>
          <p>Essayez un autre niveau ou thème, ou effacez votre recherche.</p>
          <button type="button" onClick={() => { setLevelFilter('Tous'); setCategory('Toutes'); setQuery('') }}>Réinitialiser les filtres</button>
        </div>
      ) : (
        <div className="vocab-grid">
          {items.map((w) => <WordCard key={w.id} word={w} />)}
        </div>
      )}
    </div>
  )
}
