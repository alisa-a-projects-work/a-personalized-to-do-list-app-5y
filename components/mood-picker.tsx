'use client'

import { MOODS, MOOD_EMOJI, type Vibe, type VibeId } from '@/lib/vibes'

type Mode = 'auto' | (typeof MOODS)[number]

type MoodPickerProps = {
  mode: Mode
  vibe: Vibe
  onSelect: (mode: Mode) => void
}

const MOOD_LABEL: Record<(typeof MOODS)[number], string> = {
  happy: 'Happy',
  sleepy: 'Sleepy',
  grumpy: 'Grumpy',
  hyped: 'Hyped',
}

export function MoodPicker({ mode, vibe, onSelect }: MoodPickerProps) {
  const options: { key: Mode; emoji: string; label: string }[] = [
    { key: 'auto', emoji: '🕘', label: 'Auto' },
    ...MOODS.map((m) => ({ key: m as Mode, emoji: MOOD_EMOJI[m], label: MOOD_LABEL[m] })),
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Pick your mood"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {options.map((opt) => {
        const active = mode === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => onSelect(opt.key)}
            className="vibe-transition group flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: vibe.border,
              backgroundColor: active ? vibe.accent : vibe.card,
              color: active ? vibe.accentFg : vibe.fg,
              boxShadow: active
                ? `0 8px 24px -8px ${vibe.accent}`
                : 'none',
              // @ts-expect-error CSS custom prop for focus ring color
              '--tw-ring-color': vibe.accent,
              '--tw-ring-offset-color': 'transparent',
            }}
          >
            <span
              aria-hidden
              className="text-lg leading-none transition-transform duration-300 group-hover:scale-125 group-active:scale-90"
            >
              {opt.emoji}
            </span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export type { Mode }
export type { VibeId }
