import { useState } from 'react'
import { ALL_LESSONS, type VocabularyWord } from '../data/index'
import { Check, CheckCircle2, ChevronRight, Clock3, Heart, MoveRight, Play } from './icons'
import { speakEnglish } from './services/audioService'
import { completeLesson, getNextLesson, getProgress, markWordAsKnown, saveLessonStep } from './services/progressStore'
import { AudioPlayer, Button, Pill, ProgressBar, go } from './ui'
function getCurrentLesson() {
  const s = window.location.pathname.split('/').filter(Boolean)
  return ALL_LESSONS.find((l) => l.level.toLowerCase() === s[1] && l.id === `${s[1]}-${s[2]}`)
}
export function LessonPage() {
  const lesson = getCurrentLesson()
  const [step, setStep] = useState(() =>
    lesson ? getProgress().lessonSteps?.[lesson.id] ?? 0 : 0,
  )
  const [done, setDone] = useState(!!lesson && getProgress().completedLessons.includes(lesson.id))
  if (!lesson) return <NotFound />
  const currentLesson = lesson
  const goToStep = (nextStep: number) => {
    setStep(nextStep)
    saveLessonStep(currentLesson.id, nextStep)
  }
  const complete = () => {
    completeLesson(currentLesson.id)
    setDone(true)
  }
  const last = 6
  const words = currentLesson.words
  return (
    <div className="page-content lesson-page">
      <button className="back-link" onClick={() => go('/cours')}>
        ← Tous les cours
      </button>
      <div className="lesson-heading">
        <div>
          <div className="eyebrow">
            {currentLesson.level} · LEÇON {String(currentLesson.number).padStart(2, '0')}
          </div>
          <h1>{currentLesson.title}.</h1>
          <p>{currentLesson.subtitle}</p>
        </div>
        <Pill tone="green">
          <Clock3 size={12} /> {currentLesson.minutes} min
        </Pill>
      </div>
      <div className="lesson-progress-label">
        <span>VOTRE PARCOURS</span>
        <strong>
          Étape {step + 1} <i>/</i> {last + 1}
        </strong>
      </div>
      <ProgressBar value={((step + 1) / (last + 1)) * 100} />
      <main className="lesson-body">
        {done ? (
          <div className="lesson-complete">
            <span className="complete-icon">
              <CheckCircle2 size={27} />
            </span>
            <div className="eyebrow">C’EST DANS LA BOÎTE</div>
            <h2>Lesson completed!</h2>
            <p>Une leçon de plus, des mots que vous retrouverez bientôt.</p>
            <Pill tone="green">+50 XP</Pill>
            <Button
              onClick={() => {
                const next = getNextLesson(getProgress(), currentLesson.level)
                if (next)
                  go(`/cours/${next.level.toLowerCase()}/${next.id.slice(next.level.length + 1)}`)
              }}
            >
              Continuer <MoveRight size={15} />
            </Button>
          </div>
        ) : step === 0 ? (
          <LessonIntro lesson={currentLesson} />
        ) : step === 1 ? (
          <div className="lesson-step">
            <div className="eyebrow">STEP 02 · VOCABULARY</div>
            <h2>Des mots à emporter.</h2>
            <p>Écoutez chaque mot. Prenez le temps de le prononcer à votre tour.</p>
            <div className="lesson-words">
              {words.map((w, i) => (
                <LessonWord word={w} index={i} key={`${w.id}-${i}`} />
              ))}
            </div>
          </div>
        ) : step === 2 ? (
          <div className="lesson-step">
            <div className="eyebrow">STEP 03 · GRAMMAR</div>
            <h2>Keep it simple.</h2>
            <p>
              Pour se présenter, on utilise “I am”. À l’oral, on entend très souvent la contraction
              “I’m”.
            </p>
            <div className="example-panel">
              <div className="eyebrow">GIVE IT A GO</div>
              <p>
                I’m Emma. I’m from Paris. <SpeakButton text="I'm Emma. I'm from Paris." />
              </p>
              <span>Je m’appelle Emma. Je viens de Paris.</span>
            </div>
          </div>
        ) : step === 3 ? (
          <div className="lesson-step">
            <div className="eyebrow">STEP 04 · LISTENING</div>
            <h2>Listen to the rhythm.</h2>
            <p>Une salutation simple suffit pour commencer une conversation.</p>
            <AudioPlayer
              text="Hello! My name is Emma. Nice to meet you."
              src={`lessons/${currentLesson.id}.mp3`}
              label="Écouter la phrase"
            />
            <p>
              Hello! My name is Emma. <small>Bonjour ! Je m’appelle Emma.</small>
            </p>
            <p>
              Nice to meet you. <small>Ravie de faire ta connaissance.</small>
            </p>
          </div>
        ) : step === 4 ? (
          <LessonPractice />
        ) : step === 5 ? (
          <LessonPractice review />
        ) : (
          <div className="lesson-step">
            <div className="eyebrow">STEP 07 · COMPLETE</div>
            <h2>Vous avez posé les premières bases.</h2>
            <p>
              Une leçon de plus, quelques mots en tête et une conversation un peu moins lointaine.
            </p>
            <Button onClick={complete}>
              Terminer la leçon <MoveRight size={15} />
            </Button>
          </div>
        )}
      </main>
      <div className="lesson-navigation">
        <Button tone="light" disabled={step === 0} onClick={() => goToStep(Math.max(0, step - 1))}>
          ← Précédent
        </Button>
        <div className="lesson-dots">
          {Array.from({ length: last + 1 }, (_, i) => (
            <button
              aria-label={`Étape ${i + 1}`}
              key={i}
              className={i === step ? 'selected' : ''}
              onClick={() => goToStep(i)}
            />
          ))}
        </div>
        <Button
          onClick={() =>
            step === last
              ? complete()
              : step === 4 || step === 5
              ? goToStep(step + 1)
              : goToStep(step + 1)
          }
        >
          {step === last ? 'Terminer la leçon' : 'Continuer'} <MoveRight size={15} />
        </Button>
      </div>
    </div>
  )
}
function LessonIntro({ lesson }: { lesson: (typeof ALL_LESSONS)[number] }) {
  return (
    <div className="lesson-step">
      <div className="eyebrow">STEP 01 · A QUICK HELLO</div>
      <h2>{lesson.title}</h2>
      <p>{lesson.objective}</p>
      <div className="lesson-tip">
        <span>AU PROGRAMME</span>
        <strong>Des mots essentiels, une phrase simple et un petit quiz.</strong>
      </div>
    </div>
  )
}
function SpeakButton({ text }: { text: string }) {
  return (
    <button
      className="icon-button"
      aria-label={`Écouter ${text}`}
      onClick={() => speakEnglish(text)}
    >
      <Play size={13} fill="currentColor" />
    </button>
  )
}
function LessonWord({ word, index }: { word: VocabularyWord; index: number }) {
  const [known, setKnown] = useState(getProgress().knownWords.includes(word.id))
  return (
    <div className="lesson-word">
      <span className="lesson-word-index">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <strong>{word.english}</strong>
        <small>
          /{word.pronunciation}/ · {word.french}
        </small>
        <p>{word.example}</p>
        <small>{word.exampleFr}</small>
      </div>
      <SpeakButton text={word.english} />
      <button
        className={`know-button ${known ? 'known' : ''}`}
        aria-label={`Je connais ${word.english}`}
        onClick={() => {
          if (!known) {
            markWordAsKnown(word.id)
            setKnown(true)
          }
        }}
      >
        {known ? <Check size={14} /> : <Heart size={14} />}
      </button>
    </div>
  )
}
function LessonPractice({ review = false }: { review?: boolean }) {
  const [answer, setAnswer] = useState<number | null>(null)
  const options = review
    ? ['Quel âge as-tu ?', 'D’où viens-tu ?', 'Quel jour sommes-nous ?']
    : ['Nice to meet you.', 'See you yesterday.', 'Where is the station?']
  const good = review ? 1 : 0
  return (
    <div className="lesson-step">
      <div className="eyebrow">STEP {review ? '06 · A LITTLE REVIEW' : '05 · PRACTICE'}</div>
      <h2>{review ? 'Cette phrase vous dit quelque chose ?' : 'À vous de jouer.'}</h2>
      <p>
        {review
          ? 'Choose the correct translation: “Where are you from?”'
          : 'Vous rencontrez une nouvelle personne. Comment dites-vous « Ravi de faire ta connaissance » ?'}
      </p>
      <div className="practice-options">
        {options.map((x, i) => (
          <button
            key={x}
            className={`${answer === i ? 'picked' : ''} ${
              answer !== null && i === good ? 'right' : ''
            }`}
            onClick={() => setAnswer(i)}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {x}
          </button>
        ))}
      </div>
      {answer !== null && (
        <p className={answer === good ? 'correct' : 'incorrect'}>
          {answer === good ? 'Bien joué.' : 'Presque !'} La réponse est « {options[good]} ».
        </p>
      )}
    </div>
  )
}
export function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">404 · PAGE INTROUVABLE</span>
      <h1>Oups, on a perdu la page.</h1>
      <p>Le chemin continue ailleurs. Revenons à votre espace d’apprentissage.</p>
      <Button onClick={() => go('/')}>
        Retour à l’accueil <ChevronRight size={16} />
      </Button>
    </main>
  )
}
