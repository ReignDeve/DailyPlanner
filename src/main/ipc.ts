import { BrowserWindow, app, ipcMain } from 'electron'
import type { ThemeConfig, TodoPatch } from '../shared/types'
import * as store from './store'
import { markQuitting } from './appState'

export function registerIpcHandlers(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle('todos:getAll', () => store.readTodos())
  ipcMain.handle('todos:add', (_e, text: string, date: string) => store.addTodo(text, date))
  ipcMain.handle('todos:update', (_e, id: string, patch: TodoPatch) => store.updateTodo(id, patch))
  ipcMain.handle('todos:toggleDone', (_e, id: string) => store.toggleTodoDone(id))
  ipcMain.handle('todos:delete', (_e, id: string) => store.deleteTodo(id))

  ipcMain.handle('settings:get', () => store.readSettings())
  ipcMain.handle('settings:setTheme', (_e, themeId: string) => store.setTheme(themeId))
  ipcMain.handle('settings:setCustomTheme', (_e, theme: ThemeConfig) => store.setCustomTheme(theme))

  ipcMain.on('window:hide', () => getWindow()?.hide())
  ipcMain.on('window:quit', () => {
    markQuitting()
    app.quit()
  })
}
