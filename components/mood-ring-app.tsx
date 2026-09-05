'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  VIBES,
  vibeForHour,
  timeLabel,
  MOOD_EMOJI,
  type VibeId,
} from '@/lib/vibes'
import { useChime } from '@/hooks/use-chime'
import { MoodPicker, type Mode } from '@/components/mood-picker'
import { TodoList, type Todo } from '@/components/todo-list'

const CHEERS = [
  'Done and dusted!',
  'One less thing to mood over.',
  'Crushed it. Certified good vibes.',
  'Task complete — you love to see it.',
  'Boom. Off the list it goes.',
]

let idCounter = 0
const makeId = () => `todo-${Date.now()}-${idCounter++}`

export function MoodRingApp() {
  const [mode, setMode] = useState<Mode>('auto')
  const [hour, setHour] = useState<number>(() => new Date().getHours())
  const [todos, setTodos] = useState<Todo[]>([
    { id: makeId(), text: 'Give this list a vibe', done: false },
    { id: makeId(), text: 'Add your own to-dos', done: false },
    { id: makeId(), text: 'Check something off (turn the sound on!)', done: false },
  ])
  const [draft, setDraft] = useState('')
  const [soundOn, setSoundOn] = useState(false)
  const [cheer, setCheer] = useState<string | null>(null)

  const chime = useChime()

  // Keep the auto (time-of-day) vibe fresh without any data fetching.
  useEffect(() => {
    if (mode !== 'auto') return
    const tick = () => setHour(new Date().getHours())
    tick()
    const interval = setInterval(tick, 60_000)
    return () => clearInterval(interval)
  }, [mode])

  const activeVibeId: VibeId = mode === 'auto' ? vibeForHour(hour) : mode
  const vibe = VIBES[activeVibeId]

  const headerEmoji =
    mode === 'auto'
      ? { sunrise: '🌅', day: '🌤️', dusk: '🌆', night: '🌙' }[
          activeVibeId as 'sunrise' | 'day' | 'dusk' | 'night'
        ] ?? '🕘'
      : MOOD_EMOJI[mode]

  const modeLabel =
    mode === 'auto' ? `Auto · ${timeLabel(activeVibeId)}` : 'Your pick'

  const remaining = todos.filter((t) => !t.done).length

  const addTodo = () => {
    const text = draft.trim()
    if (!text) return
    setTodos((prev) => [...prev, { id: makeId(), text, done: false }])
    setDraft('')
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => {
      let justCompleted = false
      const next = prev.map((t) => {
        if (t.id !== id) return t
        justCompleted = !t.done
        return { ...t, done: !t.done }
      })
      if (justCompleted) {
        chime(vibe.tone, soundOn)
        const msg = CHEERS[Math.floor(Math.random() * CHEERS.length)]
        setCheer(msg)
        window.setTimeout(() => setCheer((c) => (c === msg ? null : c)), 2200)
      }
      return next
    })
  }

  const removeTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id))

  const statusLine = useMemo(() => {
    if (todos.length === 0) return 'A blank slate. To-do or not to-do?'
    if (remaining === 0) return 'All clear — you absolute legend. 🎉'
    return `${remaining} to-do${remaining === 1 ? '' : 's'} left · ${modeLabel}`
  }, [todos.length, remaining, modeLabel])

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6"
      style={{ color: vibe.fg }}
    >
      {/* Cross-fading gradient layers — this is what makes vibe changes smooth */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        {(Object.keys(VIBES) as VibeId[]).map((id) => (
          <div
            key={id}
            className="absolute inset-0"
            style={{
              backgroundImage: VIBES[id].gradient,
              opacity: id === activeVibeId ? 1 : 0,
              transition: 'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        ))}
      </div>

      <section
        className="vibe-transition relative z-10 w-full max-w-md rounded-[2rem] border p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        style={{
          backgroundColor: vibe.card,
          borderColor: vibe.border,
          boxShadow: vibe.isDark
            ? '0 30px 80px -30px rgba(0,0,0,0.7)'
            : '0 30px 80px -30px rgba(0,0,0,0.35)',
        }}
      >
        {/* The mood ring: a haloed, floating orb showing the active vibe */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 grid size-20 place-items-center">
            <span
              aria-hidden
              className="animate-vibe-halo absolute inset-0 rounded-full blur-md"
              style={{ backgroundColor: vibe.accent }}
            />
            <span
              key={activeVibeId}
              aria-hidden
              className="animate-vibe-float relative text-4xl"
            >
              {headerEmoji}
            </span>
          </div>

          <h1
            className="font-display text-3xl font-bold tracking-tight"
            style={{ color: vibe.fg }}
          >
            Mood Ring
          </h1>
          <p
            className="mt-1 text-sm font-medium"
            style={{ color: vibe.muted }}
          >
            To-do or not to-do — that is the question.
          </p>

          <p
            key={`${activeVibeId}-msg`}
            className="animate-vibe-pop mt-4 min-h-10 text-sm text-balance"
            style={{ color: vibe.fg }}
          >
            {cheer ?? vibe.message}
          </p>
        </div>

        <div className="mt-5">
          <MoodPicker mode={mode} vibe={vibe} onSelect={setMode} />
        </div>

        {/* Add a to-do */}
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            addTodo()
          }}
        >
          <label htmlFor="new-todo" className="sr-only">
            Add a to-do
          </label>
          <input
            id="new-todo"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What's on your mind?"
            className="vibe-transition min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm outline-none placeholder:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: vibe.card,
              borderColor: vibe.border,
              color: vibe.fg,
              // @ts-expect-error CSS custom prop for focus ring color
              '--tw-ring-color': vibe.accent,
              '--tw-ring-offset-color': 'transparent',
            }}
          />
          <button
            type="submit"
            className="vibe-transition shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: vibe.accent,
              color: vibe.accentFg,
              boxShadow: `0 10px 24px -10px ${vibe.accent}`,
              // @ts-expect-error CSS custom prop for focus ring color
              '--tw-ring-color': vibe.accent,
              '--tw-ring-offset-color': 'transparent',
            }}
          >
            Add
          </button>
        </form>

        <div className="mt-4">
          <TodoList
            todos={todos}
            vibe={vibe}
            onToggle={toggleTodo}
            onRemove={removeTodo}
          />
        </div>

        {/* Footer: status + sound toggle */}
        <div
          className="vibe-transition mt-6 flex items-center justify-between gap-3 border-t pt-4 text-xs"
          style={{ borderColor: vibe.border, color: vibe.muted }}
        >
          <span className="text-pretty">{statusLine}</span>
          <button
            type="button"
            aria-pressed={soundOn}
            onClick={() => setSoundOn((s) => !s)}
            className="vibe-transition flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: vibe.border,
              color: vibe.fg,
              backgroundColor: soundOn ? vibe.accent : 'transparent',
              // @ts-expect-error CSS custom prop for focus ring color
              '--tw-ring-color': vibe.accent,
              '--tw-ring-offset-color': 'transparent',
            }}
          >
            <span aria-hidden>{soundOn ? '🔊' : '🔇'}</span>
            <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
        </div>
      </section>
    </main>
  )
}
