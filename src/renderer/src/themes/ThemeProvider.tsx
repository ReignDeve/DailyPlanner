import { useEffect, type ReactNode } from 'react'
import { resolveTheme } from '@shared/themePresets'
import { useSettingsStore } from '../store/useSettingsStore'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps): ReactNode {
  const settings = useSettingsStore((s) => s.settings)

  useEffect(() => {
    if (!settings) return
    const theme = resolveTheme(settings.themeId, settings.customTheme)
    const root = document.documentElement.style
    root.setProperty('--color-bg', theme.background)
    root.setProperty('--blur', `${theme.blur}px`)
    root.setProperty('--color-accent', theme.accent)
    root.setProperty('--color-text', theme.text)
    root.setProperty('--color-text-muted', theme.textMuted)
    root.setProperty('--radius', `${theme.radius}px`)
    root.setProperty('--font-size', `${theme.fontSize}px`)
    root.setProperty('--font-family', theme.fontFamily)
  }, [settings])

  return <>{children}</>
}
