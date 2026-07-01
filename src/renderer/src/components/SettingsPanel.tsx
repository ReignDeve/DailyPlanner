import { THEME_PRESETS, resolveTheme } from '@shared/themePresets'
import type { ThemeConfig } from '@shared/types'
import { useSettingsStore } from '../store/useSettingsStore'
import { hexToRgb, parseRgba, rgbToHex, toRgba } from '../lib/color'

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const settings = useSettingsStore((s) => s.settings)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setCustomTheme = useSettingsStore((s) => s.setCustomTheme)

  if (!settings) return null

  const active = resolveTheme(settings.themeId, settings.customTheme)
  const isCustom = settings.themeId === 'custom'
  const bg = parseRgba(active.background)

  const updateCustom = (patch: Partial<ThemeConfig>): void => {
    setCustomTheme({ ...settings.customTheme, ...patch })
  }

  const selectCustom = (): void => {
    if (!isCustom) setCustomTheme({ ...active, id: 'custom', name: 'Custom' })
  }

  return (
    <div
      className="no-drag absolute inset-0 flex flex-col"
      style={{ background: 'var(--color-panel-bg)' }}
    >
      <div className="drag-region flex items-center justify-between px-4 py-3 shrink-0">
        <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
          Settings
        </span>
        <button
          onClick={onClose}
          className="no-drag w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 leading-none"
          aria-label="Close settings"
        >
          ×
        </button>
      </div>

      <div className="todo-scroll flex-1 overflow-y-auto px-4 pb-4 space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Theme
          </p>
          <div className="grid grid-cols-2 gap-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setTheme(preset.id)}
                className="rounded-lg px-3 py-2 text-left text-xs transition-colors"
                style={{
                  background: preset.background,
                  border: `${settings.themeId === preset.id ? 2 : 1}px solid ${
                    settings.themeId === preset.id ? preset.accent : 'rgba(255,255,255,0.12)'
                  }`,
                  color: preset.text
                }}
              >
                {preset.name}
              </button>
            ))}
            <button
              onClick={selectCustom}
              className="rounded-lg px-3 py-2 text-left text-xs"
              style={{
                background: settings.customTheme.background,
                border: `${isCustom ? 2 : 1}px solid ${isCustom ? settings.customTheme.accent : 'rgba(255,255,255,0.12)'}`,
                color: settings.customTheme.text
              }}
            >
              Custom
            </button>
          </div>
        </div>

        {isCustom && (
          <div className="space-y-4">
            <label className="block text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Accent color
              <input
                type="color"
                value={active.accent}
                onChange={(e) => updateCustom({ accent: e.target.value })}
                className="block w-full h-8 mt-1 rounded-md bg-transparent cursor-pointer"
              />
            </label>

            <label className="block text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Background color
              <input
                type="color"
                value={rgbToHex(bg.r, bg.g, bg.b)}
                onChange={(e) => {
                  const { r, g, b } = hexToRgb(e.target.value)
                  updateCustom({ background: toRgba(r, g, b, bg.a) })
                }}
                className="block w-full h-8 mt-1 rounded-md bg-transparent cursor-pointer"
              />
            </label>

            <label className="block text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Background opacity ({Math.round(bg.a * 100)}%)
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={bg.a}
                onChange={(e) => updateCustom({ background: toRgba(bg.r, bg.g, bg.b, parseFloat(e.target.value)) })}
                className="w-full mt-1"
              />
            </label>

            <label className="block text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Blur ({active.blur}px)
              <input
                type="range"
                min={0}
                max={40}
                step={2}
                value={active.blur}
                onChange={(e) => updateCustom({ blur: Number(e.target.value) })}
                className="w-full mt-1"
              />
            </label>

            <label className="block text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Corner radius ({active.radius}px)
              <input
                type="range"
                min={0}
                max={28}
                step={1}
                value={active.radius}
                onChange={(e) => updateCustom({ radius: Number(e.target.value) })}
                className="w-full mt-1"
              />
            </label>

            <label className="block text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Font size ({active.fontSize}px)
              <input
                type="range"
                min={12}
                max={18}
                step={1}
                value={active.fontSize}
                onChange={(e) => updateCustom({ fontSize: Number(e.target.value) })}
                className="w-full mt-1"
              />
            </label>
          </div>
        )}

        <button
          onClick={() => window.api.window.quit()}
          className="w-full text-xs text-left px-3 py-2 rounded-lg hover:bg-white/10"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Quit LifePlanner
        </button>
      </div>
    </div>
  )
}
