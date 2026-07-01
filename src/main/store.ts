import { app } from 'electron'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import type { Settings, Todo, ThemeConfig, TodoPatch, WindowBounds } from '../shared/types'
import { THEME_PRESETS, DEFAULT_THEME_ID } from '../shared/themePresets'

const dataDir = (): string => app.getPath('userData')
const todosPath = (): string => join(dataDir(), 'todos.json')
const settingsPath = (): string => join(dataDir(), 'settings.json')

function ensureDataDir(): void {
  const dir = dataDir()
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function readJson<T>(path: string, fallback: T): T {
  try {
    if (!existsSync(path)) return fallback
    return JSON.parse(readFileSync(path, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJson(path: string, data: unknown): void {
  ensureDataDir()
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
}

// -- Todos --

export function readTodos(): Todo[] {
  return readJson<Todo[]>(todosPath(), [])
}

function writeTodos(todos: Todo[]): void {
  writeJson(todosPath(), todos)
}

export function addTodo(text: string, date: string): Todo[] {
  const trimmed = text.trim()
  if (!trimmed) return readTodos()
  const todos = readTodos()
  const order = todos.filter((t) => t.date === date).length
  todos.push({ id: randomUUID(), text: trimmed, done: false, date, createdAt: Date.now(), order })
  writeTodos(todos)
  return todos
}

export function updateTodo(id: string, patch: TodoPatch): Todo[] {
  const todos = readTodos().map((t) => (t.id === id ? { ...t, ...patch } : t))
  writeTodos(todos)
  return todos
}

export function toggleTodoDone(id: string): Todo[] {
  const todos = readTodos().map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  writeTodos(todos)
  return todos
}

export function deleteTodo(id: string): Todo[] {
  const todos = readTodos().filter((t) => t.id !== id)
  writeTodos(todos)
  return todos
}

// -- Settings --

function defaultSettings(): Settings {
  const base = THEME_PRESETS[0]
  return {
    themeId: DEFAULT_THEME_ID,
    customTheme: { ...base, id: 'custom', name: 'Custom' },
    windowBounds: null
  }
}

export function readSettings(): Settings {
  return readJson<Settings>(settingsPath(), defaultSettings())
}

function writeSettings(settings: Settings): void {
  writeJson(settingsPath(), settings)
}

export function setTheme(themeId: string): Settings {
  const settings = readSettings()
  settings.themeId = themeId
  writeSettings(settings)
  return settings
}

export function setCustomTheme(theme: ThemeConfig): Settings {
  const settings = readSettings()
  settings.customTheme = theme
  settings.themeId = 'custom'
  writeSettings(settings)
  return settings
}

let boundsWriteTimer: ReturnType<typeof setTimeout> | null = null
export function writeWindowBounds(bounds: WindowBounds): void {
  if (boundsWriteTimer) clearTimeout(boundsWriteTimer)
  boundsWriteTimer = setTimeout(() => {
    const settings = readSettings()
    settings.windowBounds = bounds
    writeSettings(settings)
  }, 400)
}
