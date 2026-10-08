import { ALL_LESSONS, type Progress } from '../../data/core'
const KEY = 'english-progress:v1'
const empty = (): Progress => ({
  currentLevel: 'A1',
  currentLessonId: null,
  lessonSteps: {},
  completedLessons: [],
  completedQuizzes: [],
  knownWords: [],
  scores: {},
  xp: 0,
  lastActivity: null,
  streak: 0,
  streakDay: null,
})
export function getProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty(), ...(JSON.parse(raw) as Partial<Progress>) } : empty()
  } catch {
    return empty()
  }
}
function save(f: (value: Progress) => Progress) {
  const value = f(getProgress())
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {}
  return value
}
function touch(p: Progress): Progress {
  const today = new Date().toISOString().slice(0, 10)
  if (p.streakDay === today) return { ...p, lastActivity: today }
  const prior = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  return {
    ...p,
    lastActivity: today,
    streak: p.streakDay === prior ? p.streak + 1 : 1,
    streakDay: today,
  }
}
export function updateStreak() {
  return save((p) => touch(p))
}
export function saveLessonStep(id: string, step: number) {
  return save((p) => ({ ...p, currentLessonId: id, lessonSteps: { ...p.lessonSteps, [id]: step } }))
}
export function completeLesson(id: string) {
  return save((p) => {
    if (p.completedLessons.includes(id)) return p
    const t = touch(p)
    return { ...t, completedLessons: [...t.completedLessons, id], currentLessonId: null, lessonSteps: { ...t.lessonSteps, [id]: 0 }, xp: t.xp + 50 }
  })
}
export function setCurrentLevel(level: ProgressLevel) {
  return save((p) => ({ ...touch(p), currentLevel: level }))
}
export function completeQuiz(id: string, score: number, currentLevel?: ProgressLevel) {
  return save((p) => {
    const fresh = !p.completedQuizzes.includes(id)
    return {
      ...touch(p),
      completedQuizzes: Array.from(new Set([...p.completedQuizzes, id])),
      scores: { ...p.scores, [id]: score },
      xp: p.xp + (fresh ? 20 : 0),
      currentLevel: currentLevel ?? p.currentLevel,
    }
  })
}
export function markWordAsKnown(id: string) {
  return save((p) => {
    if (p.knownWords.includes(id)) return p
    const t = touch(p)
    return { ...t, knownWords: [...t.knownWords, id], xp: t.xp + 5 }
  })
}
export function getNextLesson(p = getProgress(), level?: ProgressLevel) {
  const matches = (lesson: (typeof ALL_LESSONS)[number]) =>
    (!level || lesson.level === level) && !p.completedLessons.includes(lesson.id)
  const current = p.currentLessonId && ALL_LESSONS.find((lesson) => lesson.id === p.currentLessonId)
  if (current && matches(current)) return current
  return ALL_LESSONS.find(matches)
}
export function clearProgress() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}
export type ProgressLevel = 'A1' | 'A2' | 'B1'
export type EstimatedLevel = ProgressLevel | 'B2' | 'C1'
export function levelFromScore(score: number, total = 20): EstimatedLevel {
  const scaledScore = Math.round((score / total) * 20)
  if (scaledScore <= 5) return 'A1'
  if (scaledScore <= 9) return 'A2'
  if (scaledScore <= 13) return 'B1'
  if (scaledScore <= 17) return 'B2'
  return 'C1'
}
export function availableLevel(level: EstimatedLevel): ProgressLevel {
  return level === 'B2' || level === 'C1' ? 'B1' : level
}
export function getLevelProgress(p = getProgress()) {
  return getLevelCompletion('A1', p)
}

export function getLevelCompletion(level: ProgressLevel, p = getProgress()) {
  const lessons = ALL_LESSONS.filter((lesson) => lesson.level === level)
  return lessons.length
    ? Math.round((p.completedLessons.filter((id) => lessons.some((lesson) => lesson.id === id)).length / lessons.length) * 100)
    : 0
}
