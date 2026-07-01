import { contextBridge, ipcRenderer } from 'electron'
import type { Api, ThemeConfig, TodoPatch } from '../shared/types'

const api: Api = {
  todos: {
    getAll: () => ipcRenderer.invoke('todos:getAll'),
    add: (text: string, date: string) => ipcRenderer.invoke('todos:add', text, date),
    update: (id: string, patch: TodoPatch) => ipcRenderer.invoke('todos:update', id, patch),
    toggleDone: (id: string) => ipcRenderer.invoke('todos:toggleDone', id),
    remove: (id: string) => ipcRenderer.invoke('todos:delete', id)
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    setTheme: (themeId: string) => ipcRenderer.invoke('settings:setTheme', themeId),
    setCustomTheme: (theme: ThemeConfig) => ipcRenderer.invoke('settings:setCustomTheme', theme)
  },
  window: {
    hide: () => ipcRenderer.send('window:hide'),
    quit: () => ipcRenderer.send('window:quit')
  }
}

contextBridge.exposeInMainWorld('api', api)
