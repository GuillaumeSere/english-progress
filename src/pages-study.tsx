import { useState } from 'react'
import {
  ALL_GRAMMAR_NAMES,
  CONVERSATIONS,
  GRAMMAR,
  LEVELS,
  LEVEL_TEST_QUESTIONS,
  LISTENING,
  QUIZ_QUESTIONS,
  type Question,
} from '../data/index'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  MoveRight,
  Play,
  RotateCcw,
  Target,
  Zap,
} from './icons'
import { availableLevel, completeQuiz, levelFromScore } from './services/progressStore'
import { AudioPlayer, Button, PageIntro, Pill, ProgressBar, SpeakButton, go } from './ui'
export function GrammarPage() {
  const [topic, setTopic] = useState(GRAMMAR[0])
  const [answer, setAnswer] = useState<number | null>(null)
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="GRAMMAR, MADE SIMPLE"
        title="La grammaire, en clair."
        description="Des explications courtes et des exemples utiles. On comprend la règle, puis on l'essaie."
      />
      <div className="grammar-layout">
        <aside className="grammar-sidebar">
          <span className="eyebrow">EXPLORER LES REGLES</span>
          {ALL_GRAMMAR_NAMES.map((n) => {
            const g = GRAMMAR.find((x) => x.name === n)
            return (
              <button
                key={n}
                disabled={!g}
                className={topic.name === n ? 'selected' : ''}
                onClick={() => {
                  if (g) {
                    setTopic(g)
                    setAnswer(null)
                  }
                }}
              >
                <span>{n}</span>
                {g ? <ChevronRight size={15} /> : <small>Bientôt</small>}
              </button>
            )
          })}
        </aside>
        <article className="grammar-article">
          <div className="grammar-top">
            <Pill tone="green">{topic.level}</Pill>
            <span className="eyebrow">LE POINT GRAMMAIRE · 04 MIN</span>
          </div>
          <h2>{topic.name}</h2>
          <p className="grammar-explanation">{topic.explanation}</p>
          <div className="example-panel">
            <div className="eyebrow">IN CONTEXT</div>
            <p>
              {topic.examples[0]} <SpeakButton text={topic.examples[0]} />
            </p>
            <span>{topic.examples[1]}</span>
          </div>
          <div className="form-grid">
            {[
              { label: 'AFFIRMATIVE', text: topic.positive },
              { label: 'NEGATIVE', text: topic.negative },
              { label: 'QUESTION', text: topic.question },
            ].map((x) => (
              <div className="form-card" key={x.label}>
                <span>{x.label}</span>
                <strong>{x.text}</strong>
              </div>
            ))}
          </div>
          <div className="grammar-exercise">
            <div className="eyebrow">Ã VOUS D'ESSAYER · MINI QUIZ</div>
            <h3>{topic.exercise.prompt}</h3>
            {topic.exercise.options.map((o, i) => (
              <button
                key={o}
                className={`answer-option ${answer === i ? 'picked' : ''} ${
                  answer !== null && i === topic.exercise.correct ? 'right' : ''
                }`}
                onClick={() => setAnswer(i)}
              >
                <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
                {o}
                {answer !== null && i === topic.exercise.correct && <Check size={15} />}
              </button>
            ))}
            {answer !== null && (
              <div
                className={`answer-feedback ${
                  answer === topic.exercise.correct ? 'correct' : 'incorrect'
                }`}
              >
                {answer === topic.exercise.correct ? 'Bien joué.' : 'Pas tout Ã  fait.'}{' '}
                {topic.exercise.explanation}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
export function ConversationsPage() {
  const [filter, setFilter] = useState('Tous')
  const [expanded, setExpanded] = useState([CONVERSATIONS[0].id])
  const categories = ['Tous', ...Array.from(new Set(CONVERSATIONS.map((x) => x.category)))]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="REAL-LIFE ENGLISH"
        title="Des phrases qui ouvrent la conversation."
        description="Des dialogues courts, ancrés dans des situations familiaires. écoutez, lisez, reprenez une phrase."
      />
      <div className="category-strip">
        {categories.map((x) => (
          <button key={x} className={filter === x ? 'selected' : ''} onClick={() => setFilter(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="conversation-list">
        {CONVERSATIONS.filter((x) => filter === 'Tous' || x.category === filter).map((d, i) => (
          <article className="conversation-card" key={d.id}>
            <button
              className="conversation-heading"
              onClick={() =>
                setExpanded((e) => (e.includes(d.id) ? e.filter((k) => k !== d.id) : [...e, d.id]))
              }
              aria-expanded={expanded.includes(d.id)}
            >
              <span
                className={`conversation-number tint-${['mint', 'peach', 'sky', 'lilac'][i % 4]}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="conversation-info">
                <span className="eyebrow">
                  {d.level} Â· {d.category.toUpperCase()}
                </span>
                <strong>{d.title}</strong>
                <small>{d.lines.length} échanges · 2 min</small>
              </span>
              <ChevronDown size={18} />
            </button>
            {expanded.includes(d.id) && (
              <div className="dialogue-body">
                {d.lines.map((line, j) => (
                  <div className="dialogue-line" key={j}>
                    <span>{line.speaker} · ENGLISH</span>
                    <div>
                      <p>{line.english}</p>
                      <SpeakButton text={line.english} audioFile={`conversations/${d.id}-${j + 1}.mp3`} />
                    </div>
                    <small>{line.french}</small>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
export function QuizEngine({
  questions,
  id,
  title,
  description,
  levelMode = false,
}: {
  questions: Question[]
  id: string
  title: string
  description: string
  levelMode?: boolean
}) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [chosen, setChosen] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const q = questions[step]
  function next() {
    if (chosen === null) return
    const list = [...answers, chosen]
    setAnswers(list)
    if (step === questions.length - 1) {
      const score = list.filter((x, i) => x === questions[i].correct).length
      setFinished(true)
      completeQuiz(id, score, levelMode ? availableLevel(levelFromScore(score, questions.length)) : undefined)
      return
    }
    setStep(step + 1)
    setChosen(null)
  }
  function reset() {
    setStep(0)
    setAnswers([])
    setChosen(null)
    setFinished(false)
  }
  if (finished) {
    const score = answers.filter((x, i) => x === questions[i].correct).length
    const level = levelFromScore(score, questions.length)
    return (
      <div className="quiz-finished">
        <span className="result-medal">
          <Zap size={22} />
        </span>
        <div className="eyebrow">{levelMode ? 'VOTRE NIVEAU ESTIME' : 'QUIZ TERMINE'}</div>
        <h2>
          {score}
          <span> / {questions.length}</span>
        </h2>
        <p>
          {levelMode
            ? `${level} · ${level === 'B2' || level === 'C1' ? level : LEVELS.find((x) => x.name === level)?.title || level}`
            : score === questions.length
            ? 'Un sans-faute, bravo.'
            : 'Chaque essai compte : continuez Ã  votre rythme.'}
        </p>
        {levelMode && (
          <div className="result-tip">
            Ce test donne une indication. Vous pourrez changer de parcours Ã  tout moment.
          </div>
        )}
        <div className="quiz-finished-buttons">
          <Button tone="light" onClick={reset}>
            Recommencer <RotateCcw size={14} />
          </Button>
          {levelMode ? (
            <Button onClick={() => go(`/cours/${availableLevel(level).toLowerCase()}`)}>
              Commencer mon parcours <ChevronRight size={14} />
            </Button>
          ) : (
            <Button onClick={() => go('/progression')}>
              Voir ma progression <ChevronRight size={14} />
            </Button>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="quiz-engine">
      <div className="quiz-heading">
        <Pill tone="green">{levelMode ? 'TEST DE NIVEAU' : 'QUIZ · A1'}</Pill>
        <span>
          <b>{String(step + 1).padStart(2, '0')}</b> / {String(questions.length).padStart(2, '0')}
        </span>
      </div>
      <ProgressBar value={Math.round((step / questions.length) * 100)} />
      <div className="quiz-question">
        <div className="eyebrow">QUESTION {String(step + 1).padStart(2, '0')}</div>
        <h2>{q.prompt}</h2>
      </div>
      <div className="quiz-answers">
        {q.options.map((x, i) => (
          <button
            key={x}
            className={`quiz-answer ${chosen === i ? 'picked' : ''}`}
            onClick={() => setChosen(i)}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {x}
            <i>{chosen === i && <b />}</i>
          </button>
        ))}
      </div>
      <div className="quiz-bottom">
        <span>
          {title} · {description}
        </span>
        <Button disabled={chosen === null} onClick={next}>
          {step === questions.length - 1 ? 'Voir mon résultat' : 'Valider ma réponse'}{' '}
          <MoveRight size={14} />
        </Button>
      </div>
    </div>
  )
}
export function QuizPage() {
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="A MOMENT TO RECAP"
        title="Quelques questions. De beaux repaires."
        description="Un petit quiz pour retrouver ce que vous venez d'apprendre. Vous pouvez le refaire autant de fois que vous le voulez."
      />
      <div className="quiz-layout">
        <div className="quiz-intro-card">
          <div className="eyebrow">THIS WEEKENDS PICK · 05 MIN</div>
          <h2>
            A little
            <br />
            review.
          </h2>
          <p>
            Quelques mots, des phrases courantes et une pointe de grammaire pour faire le point.
          </p>
          <div className="quiz-card-meta">
            <span>
              <Target size={14} /> 5 questions
            </span>
            <span>
              <Zap size={14} /> +20 XP
            </span>
          </div>
        </div>
        <QuizEngine
          key="a1-review"
          questions={QUIZ_QUESTIONS}
          id="a1-review"
          title="Quiz de révision"
          description="5 questions"
        />
      </div>
      <div className="level-test-promo">
        <Target size={18} />
        <span>
          <strong>Vous ne connaissez pas votre niveau ?</strong>
          <small>En 20 questions, découvrez par ou commencer.</small>
        </span>
        <Button tone="light" size="small" onClick={() => go('/test-niveau')}>
          Faire le test <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}
export function LevelTestPage() {
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="YOUR STARTING POINT"
        title="Ou en est votre anglais ?"
        description="Vingt questions de vocabulaire, de grammaire et de compréhension. Ce test donne une première indication, en toute simplicité."
      />
      <div className="test-note">
        <Clock3 size={17} />
        <p>
          <strong>Environ 5 minutes.</strong> Répondez Ã  votre rythme, une réponse Ã  la fois.
        </p>
      </div>
      <QuizEngine
        questions={LEVEL_TEST_QUESTIONS}
        id="placement-test"
        title="Test de niveau"
        description="20 questions"
        levelMode
      />
    </div>
  )
}
export function ListeningPage() {
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="SLOW DOWN AND LISTEN"
        title="Ecoutez. Puis, voyez ce qui reste."
        description="De petites histoires originales pour entrainer votre oreille, Ã  votre rythme."
      />
      <div className="listening-list">
        {LISTENING.map((x, i) => (
          <ListeningCard key={x.id} item={x} number={i + 1} />
        ))}
      </div>
    </div>
  )
}
function ListeningCard({ item, number }: { item: (typeof LISTENING)[number]; number: number }) {
  const [open, setOpen] = useState(false)
  const [a, setA] = useState<number | null>(null)
  return (
    <article className="listening-card">
      <div className="listening-number">{String(number).padStart(2, '0')}</div>
      <div className="listening-main">
        <div className="eyebrow">{item.level} · LISTENING</div>
        <h3>{item.title}</h3>
        <AudioPlayer text={item.script} src={`/audio/listening/${item.id}.mp3`} label={`Écouter ${item.title}`} />
        <button className="reveal-script" onClick={() => setOpen(!open)}>
          {open ? 'Masquer' : 'Lire la transcription'} <ChevronDown size={14} />
        </button>
        {open && <blockquote>{item.script}</blockquote>}
        <div className="listening-question">
          <span className="eyebrow">CHECK YOUR UNDERSTANDING</span>
          <strong>{item.prompt}</strong>
          <div className="listening-answers">
            {item.options.map((x, i) => (
              <button
                key={x}
                className={`${a === i ? 'picked' : ''} ${
                  a !== null && i === item.correct ? 'right' : ''
                } ${a === i && i !== item.correct ? 'wrong' : ''}`}
                onClick={() => setA(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {x}
              </button>
            ))}
          </div>
          {a !== null && (
            <p className={`listening-feedback ${a === item.correct ? 'correct' : 'incorrect'}`}>
              {a === item.correct ? 'Bien Ecouté.' : "'Ce n'est pas la bonne réponse.'"}{' '}
              {item.explanation}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
