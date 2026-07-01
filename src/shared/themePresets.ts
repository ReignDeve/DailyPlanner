import type { ThemeConfig } from './types'

const FONT_STACK = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'light-glass',
    name: 'Light Glass',
    background: 'rgba(255, 255, 255, 0.55)',
    blur: 24,
    accent: '#2563eb',
    text: '#0f172a',
    textMuted: '#475569',
    radius: 18,
    fontSize: 14,
    fontFamily: FONT_STACK
  },
  {
    id: 'dark-glass',
    name: 'Dark Glass',
    background: 'rgba(17, 24, 39, 0.55)',
    blur: 24,
    accent: '#60a5fa',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    radius: 18,
    fontSize: 14,
    fontFamily: FONT_STACK
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    background: 'rgba(250, 250, 249, 0.97)',
    blur: 0,
    accent: '#111827',
    text: '#111827',
    textMuted: '#6b7280',
    radius: 10,
    fontSize: 14,
    fontFamily: FONT_STACK
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    background: 'rgba(24, 24, 27, 0.97)',
    blur: 0,
    accent: '#a78bfa',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    radius: 10,
    fontSize: 14,
    fontFamily: FONT_STACK
  }
]

export const DEFAULT_THEME_ID = 'dark-glass'

export function resolveTheme(themeId: string, customTheme: ThemeConfig): ThemeConfig {
  if (themeId === 'custom') return customTheme
  return THEME_PRESETS.find((t) => t.id === themeId) ?? THEME_PRESETS[0]
}
