import { useRef, useState, type ReactNode } from 'react'
import type { LearningLevel, Lesson } from '../data/core'
import { Check, ChevronRight, Clock3, Play, RotateCcw, Volume2 } from './icons'
import { audioPath, playEnglish, speakEnglish, type SpeechSpeed } from './services/audioService'
import { getProgress } from './services/progressStore'
export function go(to: string) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
export function Button({
  children,
  onClick,
  tone = 'dark',
  size = 'normal',
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  tone?: 'dark' | 'light' | 'green' | 'quiet'
  size?: 'normal' | 'small'
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${tone} ${size === 'small' ? 'btn-small' : ''}`}
    >
      {children}
    </button>
  )
}
export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}
export function ProgressBar({ value, color = 'green' }: { value: number; color?: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${Math.round(value)} % terminé`}
    >
      <div
        className="progress-fill"
        style={{
          width: `${Math.min(100, value)}%`,
          background: color === 'white' ? 'white' : undefined,
        }}
      />
    </div>
  )
}
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="page-intro">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  )
}
export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="section-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}
export function SpeakButton({ text, label, audioFile }: { text: string; label?: string; audioFile?: string }) {
  return (
    <button
      className="icon-button"
      aria-label={label || `Écouter : ${text}`}
      title="Écouter"
      onClick={() => playEnglish(text, { file: audioFile })}
    >
      <Play size={14} fill="currentColor" />
    </button>
  )
}
export function AudioPlayer({
  text,
  src,
  label = 'Écouter',
}: {
  text: string
  src?: string
  label?: string
}) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [rate, setRate] = useState<SpeechSpeed>(1)
  const [missing, setMissing] = useState(false)
  const speechFallback = () => speakEnglish(text, rate)

  function togglePlayback() {
    const audio = ref.current
    if (!audio || missing || !src || !duration) {
      speechFallback()
      return
    }
    if (audio.paused) {
      audio.playbackRate = rate
      audio.volume = volume
      void audio.play().then(() => setPlaying(true)).catch(() => setMissing(true))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  function seek(value: number) {
    if (ref.current) {
      ref.current.currentTime = value
      setTime(value)
    }
  }

  const formatTime = (value: number) => {
    if (!Number.isFinite(value)) return '0:00'
    const minutes = Math.floor(value / 60)
    return `${minutes}:${String(Math.floor(value % 60)).padStart(2, '0')}`
  }

  return (
    <div className={`audio-player ${!src || missing || !duration ? 'audio-unavailable' : ''}`}>
      {src && !missing && (
        <audio
          ref={ref}
          src={audioPath(src)}
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
          onError={() => { setMissing(true); setPlaying(false) }}
        />
      )}
      <div className="audio-player-controls">
        <button className="audio-play-button" aria-label={playing ? 'Mettre en pause' : label} onClick={togglePlayback}>
          {playing ? 'Ⅱ' : <Play size={14} fill="currentColor" />}
        </button>
        {src && !missing && duration > 0 ? (
          <>
            <span className="audio-time">{formatTime(time)}</span>
            <input aria-label="Position de lecture" type="range" min={0} max={duration || 0} step={0.1} value={time} onChange={(event) => seek(Number(event.target.value))} />
            <span className="audio-time">{formatTime(duration)}</span>
            <button className="icon-button" aria-label="Recommencer" onClick={() => seek(0)}><RotateCcw size={14} /></button>
            <Volume2 size={15} aria-hidden="true" />
            <input className="audio-volume" aria-label="Volume" type="range" min={0} max={1} step={0.05} value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); if (ref.current) ref.current.volume = value }} />
            <select aria-label="Vitesse de lecture" value={rate} onChange={(event) => { const value = Number(event.target.value) as SpeechSpeed; setRate(value); if (ref.current) ref.current.playbackRate = value }}>
              <option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option><option value={1.5}>1.5×</option>
            </select>
          </>
        ) : (
          <span className="audio-placeholder">Audio bientôt disponible · lecture vocale</span>
        )}
      </div>
    </div>
  )
}
export function LevelCard({
  level,
  progress,
  onClick,
}: {
  level: LearningLevel
  progress: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`level-card level-card-button tint-${level.tint}`}
      disabled={!level.available}
      onClick={onClick}
      aria-label={`Explorer le niveau ${level.name}, ${level.lessons} leçons et ${level.words} mots`}
    >
      <span className="level-top">
        <span className="level-token">{level.name}</span>
        <Pill tone={level.available ? 'white' : 'muted'}>
          {level.available ? (level.id === 'a1' ? 'Disponible' : 'À découvrir') : 'Bientôt'}
        </Pill>
      </span>
      <span className="level-card-title">{level.title}</span>
      <span className="level-card-description">
        {level.available ? `${level.lessons} leçons · ${level.words} mots` : 'Le niveau arrive bientôt'}
      </span>
      <span className="level-bottom">
        <span className="level-meter">
          <ProgressBar value={progress} />
          <span>{progress}% parcouru</span>
        </span>
        <span className="arrow-button" aria-hidden="true">
          <ChevronRight size={18} />
        </span>
      </span>
    </button>
  )
}export function CourseCard({
  lesson,
  index,
  onClick,
}: {
  lesson: Lesson
  index: number
  onClick: () => void
}) {
  const done = getProgress().completedLessons.includes(lesson.id)
  return (
    <article className="course-row">
      <div className={`course-cover tint-${['mint', 'peach', 'sky', 'lilac'][index % 4]}`}>
        <span>{String(lesson.number).padStart(2, '0')}</span>
        <BookIcon />
        <span className="course-cover-word">{lesson.words[0]?.english}</span>
      </div>
      <div className="course-details">
        <div className="course-label">
          {lesson.level} <span>·</span> LEÇON {String(lesson.number).padStart(2, '0')}
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.subtitle}</p>
        <span className="course-meta">
          <Clock3 size={13} />
          {lesson.minutes} minutes <i /> {lesson.words.length} mots
        </span>
      </div>
      <div className="course-action">
        {done ? (
          <Pill tone="green">
            <Check size={12} /> Terminée
          </Pill>
        ) : (
          <span className="course-unseen">À découvrir</span>
        )}
        <button className="arrow-button" aria-label={`Commencer ${lesson.title}`} onClick={onClick}>
          <ChevronRight size={18} />
        </button>
      </div>
    </article>
  )
}
function BookIcon() {
  return <span className="book-decoration">◎</span>
}
