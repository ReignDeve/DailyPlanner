import { BrowserWindow, app, screen } from 'electron'
import { join } from 'path'
import type { WindowBounds } from '../shared/types'
import { readSettings, writeWindowBounds } from './store'
import { isQuitting } from './appState'

const DEFAULT_WIDTH = 320
const DEFAULT_HEIGHT = 480

function clampToVisibleArea(bounds: WindowBounds): WindowBounds {
  const display = screen.getDisplayMatching(bounds)
  const area = display.workArea
  const width = Math.min(bounds.width, area.width)
  const height = Math.min(bounds.height, area.height)
  const x = Math.min(Math.max(bounds.x, area.x), area.x + area.width - width)
  const y = Math.min(Math.max(bounds.y, area.y), area.y + area.height - height)
  return { x, y, width, height }
}

function initialBounds(): WindowBounds {
  const settings = readSettings()
  const primary = screen.getPrimaryDisplay().workArea
  const fallback: WindowBounds = {
    x: primary.x + primary.width - DEFAULT_WIDTH - 24,
    y: primary.y + 24,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  }
  return clampToVisibleArea(settings.windowBounds ?? fallback)
}

export function createWidgetWindow(): BrowserWindow {
  const bounds = initialBounds()

  const win = new BrowserWindow({
    ...bounds,
    minWidth: 260,
    minHeight: 320,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: true,
    skipTaskbar: true,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.setAlwaysOnTop(true, 'floating')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  const persistBounds = (): void => writeWindowBounds(win.getBounds())
  win.on('moved', persistBounds)
  win.on('resized', persistBounds)
  win.on('close', (e) => {
    // Tray-managed lifecycle: closing hides instead of quitting unless we're actually quitting.
    if (!isQuitting()) {
      e.preventDefault()
      win.hide()
    }
  })

  win.once('ready-to-show', () => win.show())

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}
