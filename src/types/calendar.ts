export interface SelectedRange {
  start: Date
  end?: Date
}

export interface StoredRange {
  start: string
  end?: string
}

export interface Note {
  id: string
  content: string
  createdAt: string
  monthKey: string
  range?: StoredRange
}

export interface CalendarState {
  currentDate: Date
  selectedRange: SelectedRange | null
  notes: Note[]
  monthMemos: Record<string, string>
  customHeroImage: string | null
  theme: 'paper' | 'night'
}
