import type { Todo } from '@shared/types'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div
        className="flex-1 flex items-center justify-center px-6 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Nothing here yet. Add your first todo below.
      </div>
    )
  }

  const sorted = [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return a.order - b.order
  })

  return (
    <ul className="todo-scroll no-drag flex-1 overflow-y-auto px-2 py-1">
      {sorted.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}
