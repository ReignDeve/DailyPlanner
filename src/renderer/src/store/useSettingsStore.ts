import { create } from 'zustand'
import type { Settings, ThemeConfig } from '@shared/types'

interface SettingsState {
  settings: Settings | null
  loaded: boolean
  load: () => Promise<void>
  setTheme: (themeId: string) => Promise<void>
  setCustomTheme: (theme: ThemeConfig) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loaded: false,
  load: async () => {
    const settings = await window.api.settings.get()
    set({ settings, loaded: true })
  },
  setTheme: async (themeId) => {
    const settings = await window.api.settings.setTheme(themeId)
    set({ settings })
  },
  setCustomTheme: async (theme) => {
    const settings = await window.api.settings.setCustomTheme(theme)
    set({ settings })
  }
}))
