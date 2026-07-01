export interface Todo {
  id: string
  text: string
  done: boolean
  date: string // 'YYYY-MM-DD'
  createdAt: number
  order: number
}

export interface ThemeConfig {
  id: string
  name: string
  background: string // rgba(...)
  blur: number // px
  accent: string
  text: string
  textMuted: string
  radius: number // px
  fontSize: number // px
  fontFamily: string
}

export interface WindowBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface Settings {
  themeId: string
  customTheme: ThemeConfig
  windowBounds: WindowBounds | null
}

export type TodoPatch = Partial<Pick<Todo, 'text' | 'date' | 'order'>>

export interface TodoApi {
  getAll: () => Promise<Todo[]>
  add: (text: string, date: string) => Promise<Todo[]>
  update: (id: string, patch: TodoPatch) => Promise<Todo[]>
  toggleDone: (id: string) => Promise<Todo[]>
  remove: (id: string) => Promise<Todo[]>
}

export interface SettingsApi {
  get: () => Promise<Settings>
  setTheme: (themeId: string) => Promise<Settings>
  setCustomTheme: (theme: ThemeConfig) => Promise<Settings>
}

export interface WindowApi {
  hide: () => void
  quit: () => void
}

export interface Api {
  todos: TodoApi
  settings: SettingsApi
  window: WindowApi
}
