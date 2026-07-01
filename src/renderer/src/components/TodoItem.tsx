import { useState, type KeyboardEvent } from 'react'
import type { Todo } from '@shared/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  const commit = (): void => {
    const trimmed = draft.trim()
    setEditing(false)
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed)
    else setDraft(todo.text)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') {
      setDraft(todo.text)
      setEditing(false)
    }
  }

  return (
    <li className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        className="checkbox w-4 h-4 shrink-0 cursor-pointer"
        aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
      />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-sm min-w-0"
          style={{ color: 'var(--color-text)' }}
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          className="flex-1 text-sm cursor-text truncate min-w-0"
          style={{
            color: todo.done ? 'var(--color-text-muted)' : 'var(--color-text)',
            textDecoration: todo.done ? 'line-through' : 'none'
          }}
        >
          {todo.text}
        </span>
      )}
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 shrink-0"
        aria-label="Delete todo"
      >
        ×
      </button>
    </li>
  )
}
