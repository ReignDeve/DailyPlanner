interface TitleBarProps {
  onOpenSettings: () => void
}

export function TitleBar({ onOpenSettings }: TitleBarProps) {
  return (
    <div className="drag-region flex items-center justify-between px-4 py-3 shrink-0">
      <span className="font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
        LifePlanner
      </span>
      <div className="no-drag flex items-center gap-1">
        <button
          onClick={onOpenSettings}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          ⚙
        </button>
        <button
          onClick={() => window.api.window.hide()}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Hide widget"
          title="Hide widget"
        >
          –
        </button>
      </div>
    </div>
  )
}
