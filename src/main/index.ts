import { BrowserWindow, app } from 'electron'
import { createWidgetWindow } from './window'
import { createTray } from './tray'
import { registerIpcHandlers } from './ipc'
import { markQuitting } from './appState'

let mainWindow: BrowserWindow | null = null
let tray: ReturnType<typeof createTray> | null = null

function getWindow(): BrowserWindow | null {
  return mainWindow
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.lifeplanner.app')

  registerIpcHandlers(getWindow)

  mainWindow = createWidgetWindow()
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  tray = createTray(getWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWidgetWindow()
    } else {
      mainWindow?.show()
    }
  })
})

// The widget has no dock/taskbar presence (skipTaskbar) and is controlled
// entirely via the tray icon: closing the window hides it instead of quitting
// (see window.ts), so 'window-all-closed' is intentionally left unhandled.
app.on('before-quit', () => {
  markQuitting()
})
