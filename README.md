# LifePlanner

A modern, theme-able desktop To-Do widget for Windows and macOS. It floats above your other windows, lives in the tray, and shows your todos for the day.

![platform](https://img.shields.io/badge/platform-windows%20%7C%20macos-blue)
![license](https://img.shields.io/badge/license-MIT-green)

## Features

- Add, edit, delete, and complete todos
- Today view with a date switcher to peek at other days
- Frameless, draggable, always-on-top widget — controlled from a tray icon (no taskbar/dock clutter)
- Four built-in themes (Light Glass, Dark Glass, Minimal Light, Minimal Dark) plus a fully custom theme editor (accent color, background color/opacity, blur, corner radius, font size)
- Fully local — todos and settings are stored on your machine, no account or sync required

## Development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

This launches the widget in dev mode with hot reload. Use the tray icon to show/hide the widget or quit.

## Building installers

```bash
npm run build:win     # Windows NSIS installer
npm run build:mac     # macOS dmg + zip (must be run on macOS)
npm run build:linux   # Linux AppImage
```

> Building the macOS package requires running on an actual Mac — Apple's tooling (codesign, hdiutil) isn't available when cross-building from Windows/Linux. The `.github/workflows/build.yml` CI workflow builds both Windows and macOS automatically; pushing a `v*` tag publishes a GitHub Release with both installers attached.

## How it works

- **Electron + electron-vite** for the app shell, with separate Vite builds for the main, preload, and renderer processes.
- **React + TypeScript** for the UI, **Tailwind CSS v4** for styling driven by CSS custom properties so themes can be swapped at runtime.
- **Zustand** for renderer state, talking to the main process over IPC.
- Todos and settings are persisted as plain JSON files in Electron's `userData` directory — no database, no external dependency.

## License

MIT — see [LICENSE](LICENSE).
