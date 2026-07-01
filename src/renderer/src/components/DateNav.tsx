import { addDays, formatDisplayDate, todayKey } from '../lib/date'

interface DateNavProps {
  selectedDate: string
  onChange: (date: string) => void
}

export function DateNav({ selectedDate, onChange }: DateNavProps) {
  return (
    <div className="no-drag flex items-center justify-between px-4 pb-2 shrink-0">
      <button
        onClick={() => onChange(addDays(selectedDate, -1))}
        className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10"
        aria-label="Previous day"
      >
        ‹
      </button>
      <button
        onClick={() => onChange(todayKey())}
        className="text-sm font-medium px-2 py-0.5 rounded-md hover:bg-white/10"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {formatDisplayDate(selectedDate)}
      </button>
      <button
        onClick={() => onChange(addDays(selectedDate, 1))}
        className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10"
        aria-label="Next day"
      >
        ›
      </button>
    </div>
  )
}
