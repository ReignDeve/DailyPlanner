import { BrowserWindow, Menu, Tray, app, nativeImage } from 'electron'
import { join } from 'path'
import { markQuitting } from './appState'

export function createTray(getWindow: () => BrowserWindow | null): Tray {
  const iconPath = app.isPackaged
    ? join(process.resourcesPath, 'build', 'icon.png')
    : join(__dirname, '../../build/icon.png')

  const baseIcon = nativeImage.createFromPath(iconPath)
  const trayIcon = baseIcon.isEmpty() ? baseIcon : baseIcon.resize({ width: 22, height: 22 })
  const tray = new Tray(trayIcon)
  tray.setToolTip('LifePlanner')

  const rebuildMenu = (): void => {
    const win = getWindow()
    const visible = win?.isVisible() ?? false
    tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: visible ? 'Hide Widget' : 'Show Widget',
          click: () => {
            if (!win) return
            if (visible) win.hide()
            else win.show()
            rebuildMenu()
          }
        },
        { type: 'separator' },
        {
          label: 'Quit LifePlanner',
          click: () => {
            markQuitting()
            app.quit()
          }
        }
      ])
    )
  }

  rebuildMenu()
  tray.on('click', () => {
    const win = getWindow()
    if (!win) return
    if (win.isVisible()) win.hide()
    else win.show()
    rebuildMenu()
  })

  return tray
}
