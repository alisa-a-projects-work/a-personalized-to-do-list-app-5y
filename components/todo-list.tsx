'use client'

import type { Vibe } from '@/lib/vibes'

export type Todo = {
  id: string
  text: string
  done: boolean
}

type TodoListProps = {
  todos: Todo[]
  vibe: Vibe
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TodoList({ todos, vibe, onToggle, onRemove }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p
        className="vibe-transition py-10 text-center text-sm text-balance"
        style={{ color: vibe.muted }}
      >
        Nothing here yet. Feeling zen, or just in de-nile? Add your first to-do
        above.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="vibe-transition animate-vibe-pop flex items-center gap-3 rounded-2xl border px-3 py-2.5"
          style={{
            borderColor: vibe.border,
            backgroundColor: vibe.card,
          }}
        >
          <button
            type="button"
            role="checkbox"
            aria-checked={todo.done}
            aria-label={todo.done ? `Mark "${todo.text}" as not done` : `Mark "${todo.text}" as done`}
            onClick={() => onToggle(todo.id)}
            className="vibe-transition grid size-6 shrink-0 place-items-center rounded-full border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: todo.done ? vibe.accent : vibe.border,
              backgroundColor: todo.done ? vibe.accent : 'transparent',
              color: vibe.accentFg,
              // @ts-expect-error CSS custom prop for focus ring color
              '--tw-ring-color': vibe.accent,
              '--tw-ring-offset-color': 'transparent',
            }}
          >
            {todo.done && (
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5 animate-vibe-pop"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </button>

          <span
            className="vibe-transition flex-1 text-sm text-pretty"
            style={{
              color: todo.done ? vibe.muted : vibe.fg,
              textDecoration: todo.done ? 'line-through' : 'none',
              opacity: todo.done ? 0.7 : 1,
            }}
          >
            {todo.text}
          </span>

          <button
            type="button"
            aria-label={`Delete "${todo.text}"`}
            onClick={() => onRemove(todo.id)}
            className="vibe-transition grid size-7 shrink-0 place-items-center rounded-full text-lg opacity-50 outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              color: vibe.fg,
              // @ts-expect-error CSS custom prop for focus ring color
              '--tw-ring-color': vibe.accent,
              '--tw-ring-offset-color': 'transparent',
            }}
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
}
