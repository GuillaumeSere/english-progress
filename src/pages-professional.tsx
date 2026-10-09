import { useState } from 'react'
import {
  ALL_LESSONS,
  LEVELS,
  LISTENING,
  PRONUNCIATION,
  WORK_MODULES,
  WORK_WORDS,
} from '../data/index'
import {
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  Headphones,
  Heart,
  Mic2,
  MoveRight,
  Star,
  Target,
  Volume2,
  Zap,
} from './icons'
import { speakEnglish, type SpeechSpeed } from './services/audioService'
import { getLevelCompletion, getNextLesson, getProgress } from './services/progressStore'
import { Button, PageIntro, Pill, ProgressBar, SpeakButton, go } from './ui'
export function PronunciationPage() {
  const [index, setIndex] = useState(0)
  const [speed, setSpeed] = useState<SpeechSpeed>(1)
  const item = PRONUNCIATION[index]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="MAKE YOURSELF HEARD"
        title="L'anglais a son propre rythme."
        description="Quelques repaires pour apprivoiser les sons qui semblent proches, mais qui font toute la différence."
      />
      <div className="pronunciation-layout">
        <aside className="pronunciation-sidebar">
          <span className="eyebrow">CHOISIR UN SON</span>
          {PRONUNCIATION.map((x, i) => (
            <button
              key={x.sound}
              className={index === i ? 'selected' : ''}
              onClick={() => setIndex(i)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{x.sound}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </aside>
        <article className="pronunciation-card">
          <div className="pronunciation-card-head">
            <span>ECOUTE & REPETE</span>
            <span>{String(index + 1).padStart(2, '0')} / 08</span>
          </div>
          <div className="phoneme">{item.sound}</div>
          <h2>{item.title}</h2>
          <p>{item.tip}</p>
          <div className="pronunciation-words">
            <div className="eyebrow">SOUNDS LIKE THIS · BRITISH ENGLISH</div>
            {item.words.map((w, i) => (
              <div className="pron-word" key={w}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>{w}</span>
                <SpeakButton text={w.split(' ')[0]} />
              </div>
            ))}
          </div>
          <div className="speech-controls">
            <label>
              Vitesse de lecture
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value) as SpeechSpeed)}
              >
                <option value={0.75}>0.75—</option>
                <option value={1}>1—</option>
                <option value={1.25}>1.25—</option>
                <option value={1.5}>1.5—</option>
              </select>
            </label>
            <Button onClick={() => speakEnglish(item.words.join('. '), speed)}>
              <Volume2 size={15} /> Ecouter les exemples
            </Button>
          </div>
          <div className="speech-future">
            <Mic2 size={16} />
            <span>
              <strong>La reconnaissance vocale arrivera plus tard.</strong>
              <small>Pour l'instant, écoutez les sons et répétez à votre rythme.</small>
            </span>
          </div>
        </article>
      </div>
    </div>
  )
}
const sample: Record<string, [string, string[]]> = {
  'Tell me about yourself.': [
    'Tell me about yourself.',
    [
      'I have three years of experience in customer service.',
      'Me no experience job.',
      'I am working yesterday.',
    ],
  ],
  'What are your strengths?': [
    'What are your strengths?',
    [
      'I am organised and enjoy working with people.',
      'I have twenty years.',
      'Because the office is big.',
    ],
  ],
  'What are your weaknesses?': [
    'What is one area you are working to improve?',
    ['I am improving my public speaking skills.', 'My job is weakness.', 'I no like Monday.'],
  ],
  'Why do you want this job?': [
    'Why are you interested in this position?',
    ['I am excited about the team and its work.', 'I want job because.', 'I have lunch at one.'],
  ],
  'Why should we hire you?': [
    'What would you bring to the team?',
    [
      'I have experience helping customers find solutions.',
      'You must hiring me.',
      'I was yesterday here.',
    ],
  ],
  'What are your salary expectations?': [
    'Could you tell me your salary expectations?',
    [
      'I would be happy to discuss the range for this role.',
      'I am thirty salary.',
      'Salary at home.',
    ],
  ],
  'Where do you see yourself in five years?': [
    'Where do you hope to be in five years?',
    [
      'I hope to grow and take on more responsibility.',
      'I am in the bus.',
      'I see myself yesterday.',
    ],
  ],
}
export function WorkPage() {
  const [module, setModule] = useState(WORK_MODULES[0].id)
  const active = WORK_MODULES.find((x) => x.id === module)!
  const [answers, setAnswers] = useState<Record<string, number>>({})
  return (
    <div className="page-content work-page">
      <PageIntro
        eyebrow="A LITTLE MORE CONFIDENCE AT WORK"
        title="Des mots qui ouvrent des portes."
        description="Pratiquez les moments qui comptent : une première rencontre, une question au téléphone, une idée en réunion."
      />
      <div className="work-page-banner">
        <div>
          <div className="eyebrow">ENGLISH FOR WORK · 05 MODULES</div>
          <h2>
            Show up as
            <br />
            <span>yourself.</span>
          </h2>
          <p>Le bon anglais pour parler de ce que vous savez faire.</p>
        </div>
        <div className="work-banner-orbit">
          <BriefcaseBusiness size={34} />
          <span>
            CAREER
            <br />
            ENGLISH
          </span>
        </div>
        <span className="work-banner-caption">GOOD WORK . GOOD WORDS.</span>
      </div>
      <div className="work-modules-grid">
        {WORK_MODULES.map((m, i) => (
          <button
            className={`work-module ${m.id === module ? 'active' : ''}`}
            key={m.id}
            onClick={() => setModule(m.id)}
          >
            <span className="work-module-count">0{i + 1}</span>
            <span className="eyebrow">MODULE {String(i + 1).padStart(2, '0')}</span>
            <strong>{m.title}</strong>
            <small>{m.subtitle}</small>
            <span className="work-module-arrow">
              <ChevronRight size={15} />
            </span>
          </button>
        ))}
      </div>
      <div className="work-module-content">
        <div className="work-module-title">
          <div>
            <div className="eyebrow">
              ENGLISH FOR WORK · MODULE {String(WORK_MODULES.indexOf(active) + 1).padStart(2, '0')}
            </div>
            <h2>{active.title}</h2>
            <p>{active.subtitle}</p>
          </div>
          <Pill tone="green">{active.items.length} étapes</Pill>
        </div>
        {active.id === 'professional-vocabulary' ? (
          <div className="work-vocabulary-grid">
            {WORK_WORDS.map((w) => (
              <article className="work-word" key={w.id}>
                <span className="eyebrow">PROFESSIONAL ENGLISH</span>
                <div>
                  <strong>{w.english}</strong>
                  <SpeakButton text={w.english} />
                </div>
                <span>{w.french}</span>
                <small>
                  {w.example}
                  <br />
                  {w.exampleFr}
                </small>
              </article>
            ))}
          </div>
        ) : (
          <div className="work-question-list">
            {active.items.map((q, i) => {
              const r = sample[q]
              const key = `${module}-${i}`
              return r ? (
                <article className="work-interview-item" key={key}>
                  <span className="eyebrow">QUESTION {String(i + 1).padStart(2, '0')}</span>
                  <h3>{r[0]}</h3>
                  <SpeakButton text={r[0]} />
                  <div className="work-answer-options">
                    {r[1].map((x, j) => (
                      <button
                        key={x}
                        className={`${answers[key] === j ? 'picked' : ''} ${
                          answers[key] !== undefined && j === 0 ? 'right' : ''
                        }`}
                        onClick={() => setAnswers({ ...answers, [key]: j })}
                      >
                        <span>{String.fromCharCode(65 + j)}</span>
                        {x}
                      </button>
                    ))}
                  </div>
                  {answers[key] !== undefined && (
                    <small className="work-answer-note">
                      {answers[key] === 0
                        ? 'Belle réponse : claire, naturelle et positive.'
                        : 'Essaie cette réponse plus naturelle ; puis reformule Ã ta façon.'}
                    </small>
                  )}
                </article>
              ) : (
                <article className="work-question" key={key}>
                  <span className="work-question-number">0{i + 1}</span>
                  <div>
                    <h3>{q}</h3>
                    <p>Une expression naturelle et polie vous aidera Ã  guider la conversation.</p>
                  </div>
                  <SpeakButton text={q} />
                </article>
              )
            })}
          </div>
        )}
      </div>
      <div className="work-foot-note">
        <BriefcaseBusiness size={15} /> Fiches professionnelles originales, pour vous entrainer Ã 
        votre façon.
      </div>
    </div>
  )
}
export function ProgressPage() {
  const [p, setP] = useState(getProgress())
  const [reset, setReset] = useState(false)
  const level = p.currentLevel ?? 'A1'
  const percent = getLevelCompletion(level, p)
  const next = getNextLesson(p, level)
  const badges = [
    {
      icon: BookOpen,
      title: 'Premier cours',
      desc: 'Terminer une leçon',
      done: p.completedLessons.length > 0,
    },
    {
      icon: Heart,
      title: 'Dix mots appris',
      desc: 'Garder 10 mots en favoris',
      done: p.knownWords.length >= 10,
    },
    { icon: Zap, title: 'Sept jours', desc: 'Apprendre sept jours de suite', done: p.streak >= 7 },
    {
      icon: Target,
      title: 'Premier quiz',
      desc: 'Répondre Ã un quiz',
      done: p.completedQuizzes.length > 0,
    },
    {
      icon: Star,
      title: 'Cent mots',
      desc: 'Connaitre 100 mots',
      done: p.knownWords.length >= 100,
    },
  ]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="YOUR ENGLISH, SO FAR"
        title="Regardez le chemin parcouru."
        description="Chaque mot appris, chaque essai et chaque retour comptent."
      />
      <div className="dashboard-hero">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow">VOTRE PARCOURS · 2026</div>
            <h2>
              {level} <span>{LEVELS.find((x) => x.name === level)?.title}</span>
            </h2>
          </div>
          <div className="xp-display">
            <Zap size={19} />
            <strong>{p.xp}</strong>
            <span>XP cumulés</span>
          </div>
        </div>
        <div className="dashboard-progress">
          <ProgressBar value={percent} color="white" />
          <div>
            <span>{percent} % de ce niveau parcouru</span>
            <span>
              {p.completedLessons.filter((x) => x.startsWith(level.toLowerCase())).length} /{' '}
              {ALL_LESSONS.filter((x) => x.level === level).length} leçons
            </span>
          </div>
        </div>
        <div className="dashboard-foot">
          <span>
            La Série actuelle{' '}
            <strong>
              {p.streak} {p.streak === 1 ? 'jour' : 'jours'}
            </strong>
          </span>
          <span>UN PETIT PAS SUFFIT AUJOURD'HUI.</span>
        </div>
      </div>
      <div className="stats-grid">
        {[
          { n: p.completedLessons.length, t: 'Leçons terminées', i: BookOpen },
          { n: p.knownWords.length, t: 'Mots appris', i: Heart },
          { n: LISTENING.length, t: 'écoutes proposées', i: Headphones },
          { n: p.completedQuizzes.length, t: 'Quiz réalisés', i: Target },
        ].map(({ n, t, i: Icon }) => (
          <div className="stat-card" key={t}>
            <Icon size={16} />
            <strong>{n}</strong>
            <span>{t}</span>
          </div>
        ))}
      </div>
      <div className="dashboard-bottom">
        <section className="next-lesson-panel">
          <div className="eyebrow">LA SUITE VOUS ATTEND</div>
          <h2>{next?.title || 'Votre parcours continue.'}</h2>
          <p>{next?.subtitle || 'Explorez un nouveau cours pour avancer.'}</p>
          <div className="next-lesson-meta">
            <span>
              <Clock3 size={14} />
              {next?.minutes || 8} minutes
            </span>
            <span>
              <BookOpen size={14} />
              {next?.words.length || 10} mots
            </span>
          </div>
          <Button
            onClick={() =>
              next &&
              go(`/cours/${next.level.toLowerCase()}/${next.id.slice(next.level.length + 1)}`)
            }
          >
            Continuer mon apprentissage <MoveRight size={15} />
          </Button>
        </section>
        <section className="badges-panel">
          <div className="eyebrow">LES PETITES VICTOIRES</div>
          <h2>Des moments qui comptent.</h2>
          <div className="badge-list">
            {badges.map(({ icon: Icon, title, desc, done }) => (
              <div className={`badge-row ${done ? 'earned' : ''}`} key={title}>
                <span className="badge-icon">
                  <Icon size={16} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{desc}</small>
                </span>
                <span className="badge-status">{done ? <Check size={15} /> : <span />}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <button className="reset-link" onClick={() => setReset(!reset)}>
        Gérer mes données locales
      </button>
      {reset && (
        <div className="reset-confirm">
          Effacer la progression enregistrée sur cet appareil ?
          <Button
            tone="light"
            size="small"
            onClick={() => {
              localStorage.removeItem('english-progress:v1')
              setP(getProgress())
              setReset(false)
            }}
          >
            Effacer ma progression
          </Button>
        </div>
      )}
    </div>
  )
}
