export type VibeId =
  | 'happy'
  | 'sleepy'
  | 'grumpy'
  | 'hyped'
  | 'sunrise'
  | 'day'
  | 'dusk'
  | 'night'

export type Vibe = {
  id: VibeId
  /** Full-screen gradient that cross-fades on change */
  gradient: string
  /** Base text color */
  fg: string
  /** Secondary / dimmed text */
  muted: string
  /** Translucent card surface */
  card: string
  /** Card + control border */
  border: string
  /** Accent used for buttons, checks, focus ring */
  accent: string
  /** Text on top of the accent color */
  accentFg: string
  /** Tone: affects the chime pitch + subtle shadows */
  isDark: boolean
  /** Frequency (Hz) for the completion chime */
  tone: number
  /** Short mood-appropriate message shown under the header */
  message: string
}

export const MOODS = ['happy', 'sleepy', 'grumpy', 'hyped'] as const

export const MOOD_EMOJI: Record<(typeof MOODS)[number], string> = {
  happy: '😊',
  sleepy: '😴',
  grumpy: '😤',
  hyped: '🤩',
}

export const VIBES: Record<VibeId, Vibe> = {
  happy: {
    id: 'happy',
    gradient:
      'radial-gradient(120% 120% at 20% 0%, #ffe97a 0%, #ffb056 45%, #ff7e79 100%)',
    fg: '#4a2f0b',
    muted: '#7a5a24',
    card: 'rgba(255, 251, 235, 0.72)',
    border: 'rgba(74, 47, 11, 0.16)',
    accent: '#f59e0b',
    accentFg: '#40270a',
    isDark: false,
    tone: 523.25,
    message: "Good vibes only — let's knock these out with a smile!",
  },
  sleepy: {
    id: 'sleepy',
    gradient:
      'radial-gradient(120% 120% at 80% 10%, #4338ca 0%, #312e81 45%, #1e1b4b 100%)',
    fg: '#e0e7ff',
    muted: '#a5b4fc',
    card: 'rgba(30, 27, 75, 0.55)',
    border: 'rgba(165, 180, 252, 0.24)',
    accent: '#a5b4fc',
    accentFg: '#1e1b4b',
    isDark: true,
    tone: 329.63,
    message: 'Low-energy mode: one tiny task at a time, no pressure. 🌙',
  },
  grumpy: {
    id: 'grumpy',
    gradient:
      'radial-gradient(120% 120% at 30% 0%, #dc2626 0%, #7f1d1d 50%, #1c1917 100%)',
    fg: '#fee2e2',
    muted: '#fca5a5',
    card: 'rgba(28, 25, 23, 0.6)',
    border: 'rgba(248, 113, 113, 0.28)',
    accent: '#f97316',
    accentFg: '#1c1917',
    isDark: true,
    tone: 220,
    message: 'Channel that fire and rage-complete your to-dos. 🔥',
  },
  hyped: {
    id: 'hyped',
    gradient:
      'radial-gradient(120% 120% at 70% 0%, #f0abfc 0%, #a855f7 40%, #06b6d4 100%)',
    fg: '#fdf4ff',
    muted: '#f5d0fe',
    card: 'rgba(88, 28, 135, 0.42)',
    border: 'rgba(240, 171, 252, 0.4)',
    accent: '#f0abfc',
    accentFg: '#4a044e',
    isDark: true,
    tone: 659.25,
    message: "You're unstoppable — let's absolutely SEND it. ✨",
  },
  sunrise: {
    id: 'sunrise',
    gradient:
      'radial-gradient(120% 120% at 15% 0%, #ffe0b3 0%, #ffb3c8 50%, #c9b6ff 100%)',
    fg: '#5a3210',
    muted: '#8a5a3a',
    card: 'rgba(255, 250, 244, 0.74)',
    border: 'rgba(90, 50, 16, 0.16)',
    accent: '#fb7185',
    accentFg: '#4a1420',
    isDark: false,
    tone: 493.88,
    message: 'Rise and grind — the early bird gets the to-do. ☀️',
  },
  day: {
    id: 'day',
    gradient:
      'radial-gradient(120% 120% at 50% 0%, #bfefff 0%, #7dd3fc 45%, #38bdf8 100%)',
    fg: '#0c3a52',
    muted: '#2b6a86',
    card: 'rgba(240, 251, 255, 0.72)',
    border: 'rgba(12, 58, 82, 0.16)',
    accent: '#0ea5e9',
    accentFg: '#f0fbff',
    isDark: false,
    tone: 587.33,
    message: 'Peak hours — make hay while the sun shines. 🌤️',
  },
  dusk: {
    id: 'dusk',
    gradient:
      'radial-gradient(120% 120% at 60% 5%, #fb923c 0%, #b45cc9 45%, #4c1d95 100%)',
    fg: '#fdf4ff',
    muted: '#e9d5ff',
    card: 'rgba(76, 29, 149, 0.42)',
    border: 'rgba(251, 146, 60, 0.3)',
    accent: '#fb923c',
    accentFg: '#3b1063',
    isDark: true,
    tone: 440,
    message: "Golden hour — let's wrap up a few loose ends. 🌆",
  },
  night: {
    id: 'night',
    gradient:
      'radial-gradient(120% 120% at 50% 0%, #1e293b 0%, #0f172a 45%, #020617 100%)',
    fg: '#e2e8f0',
    muted: '#94a3b8',
    card: 'rgba(15, 23, 42, 0.62)',
    border: 'rgba(148, 163, 184, 0.24)',
    accent: '#818cf8',
    accentFg: '#0f172a',
    isDark: true,
    tone: 261.63,
    message: 'Burning the midnight oil? Keep it cozy. 🌌',
  },
}

/** Map the current hour to a time-of-day vibe. */
export function vibeForHour(hour: number): VibeId {
  if (hour >= 5 && hour < 11) return 'sunrise'
  if (hour >= 11 && hour < 17) return 'day'
  if (hour >= 17 && hour < 21) return 'dusk'
  return 'night'
}

export function timeLabel(id: VibeId): string {
  switch (id) {
    case 'sunrise':
      return 'Morning'
    case 'day':
      return 'Afternoon'
    case 'dusk':
      return 'Evening'
    default:
      return 'Night'
  }
}
