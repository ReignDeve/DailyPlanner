import { create } from 'zustand'
import type { Todo, TodoPatch } from '@shared/types'

interface TodoState {
  todos: Todo[]
  loaded: boolean
  load: () => Promise<void>
  add: (text: string, date: string) => Promise<void>
  update: (id: string, patch: TodoPatch) => Promise<void>
  toggleDone: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  loaded: false,
  load: async () => {
    const todos = await window.api.todos.getAll()
    set({ todos, loaded: true })
  },
  add: async (text, date) => {
    const todos = await window.api.todos.add(text, date)
    set({ todos })
  },
  update: async (id, patch) => {
    const todos = await window.api.todos.update(id, patch)
    set({ todos })
  },
  toggleDone: async (id) => {
    const todos = await window.api.todos.toggleDone(id)
    set({ todos })
  },
  remove: async (id) => {
    const todos = await window.api.todos.remove(id)
    set({ todos })
  }
}))
