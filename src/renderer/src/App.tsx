import { useEffect, useState } from 'react'
import { TitleBar } from './components/TitleBar'
import { DateNav } from './components/DateNav'
import { AddTodoInput } from './components/AddTodoInput'
import { TodoList } from './components/TodoList'
import { SettingsPanel } from './components/SettingsPanel'
import { ThemeProvider } from './themes/ThemeProvider'
import { useTodoStore } from './store/useTodoStore'
import { useSettingsStore } from './store/useSettingsStore'
import { todayKey } from './lib/date'

export default function App() {
  const todos = useTodoStore((s) => s.todos)
  const loadTodos = useTodoStore((s) => s.load)
  const addTodo = useTodoStore((s) => s.add)
  const updateTodo = useTodoStore((s) => s.update)
  const toggleDone = useTodoStore((s) => s.toggleDone)
  const removeTodo = useTodoStore((s) => s.remove)

  const loadSettings = useSettingsStore((s) => s.load)
  const settingsLoaded = useSettingsStore((s) => s.loaded)

  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    loadTodos()
    loadSettings()
  }, [loadTodos, loadSettings])

  if (!settingsLoaded) return null

  const visibleTodos = todos.filter((t) => t.date === selectedDate)

  return (
    <ThemeProvider>
      <div className="app-shell relative">
        <TitleBar onOpenSettings={() => setSettingsOpen(true)} />
        <DateNav selectedDate={selectedDate} onChange={setSelectedDate} />
        <TodoList
          todos={visibleTodos}
          onToggle={toggleDone}
          onEdit={(id, text) => updateTodo(id, { text })}
          onDelete={removeTodo}
        />
        <AddTodoInput onAdd={(text) => addTodo(text, selectedDate)} />
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </div>
    </ThemeProvider>
  )
}
