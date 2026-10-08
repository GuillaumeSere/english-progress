export type SpeechSpeed = 0.75 | 1 | 1.25 | 1.5
export type AudioOptions = {
  file?: string
  rate?: SpeechSpeed
  onEnded?: () => void
  onUnavailable?: () => void
}

let activeAudio: HTMLAudioElement | undefined

export function playEnglish(text: string, options: AudioOptions = {}): void {
  stopAudio()
  if (!options.file) {
    speakEnglish(text, options.rate)
    return
  }

  const audio = new Audio(audioPath(options.file))
  activeAudio = audio
  audio.playbackRate = options.rate ?? 1
  audio.addEventListener('ended', () => {
    options.onEnded?.()
    if (activeAudio === audio) activeAudio = undefined
  }, { once: true })
  audio.addEventListener('error', () => {
    if (activeAudio === audio) activeAudio = undefined
    options.onUnavailable?.()
    speakEnglish(text, options.rate)
  }, { once: true })
  void audio.play().catch(() => {
    if (activeAudio !== audio) return
    activeAudio = undefined
    options.onUnavailable?.()
    speakEnglish(text, options.rate)
  })
}

export function stopAudio(): void {
  activeAudio?.pause()
  activeAudio = undefined
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
export function speakEnglish(text: string, rate: SpeechSpeed = 1): boolean {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-GB'
  u.rate = rate
  window.speechSynthesis.speak(u)
  return true
}
export function audioPath(path: string): string {
  return `/audio/${path.replace(/^\/+/, '')}`
}
