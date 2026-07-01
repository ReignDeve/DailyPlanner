import { useState, type KeyboardEvent } from 'react'

interface AddTodoInputProps {
  onAdd: (text: string) => void
}

export function AddTodoInput({ onAdd }: AddTodoInputProps) {
  const [value, setValue] = useState('')

  const submit = (): void => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className="no-drag px-4 pb-4 pt-1 shrink-0">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a todo…"
        className="todo-input w-full rounded-lg px-3 py-2 text-sm bg-white/10 placeholder-white/40 outline-none transition-shadow"
        style={{ color: 'var(--color-text)' }}
      />
    </div>
  )
}
