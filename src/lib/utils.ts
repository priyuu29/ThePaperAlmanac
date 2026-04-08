import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function storage<T>(key: string): T | null
export function storage<T>(key: string, value: T): void
export function storage(key: string, value?: unknown, remove?: boolean) {
  if (typeof window === 'undefined') {
    if (value !== undefined) return
    return null
  }

  if (arguments.length === 1) {
    // Get
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  } else if (arguments.length === 3 && remove) {
    window.localStorage.removeItem(key)
  } else {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }
}

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const weekdayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`
}

export function sameDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b)
}

export function clampToStartOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

export function isDateInRange(date: Date, start: Date, end: Date) {
  const current = clampToStartOfDay(date).getTime()
  const startTime = clampToStartOfDay(start).getTime()
  const endTime = clampToStartOfDay(end).getTime()
  return current >= startTime && current <= endTime
}

export function formatRangeLabel(start: Date, end?: Date) {
  const startLabel = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  if (!end || sameDay(start, end)) {
    return startLabel
  }

  const endLabel = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return `${startLabel} - ${endLabel}`
}

export function getMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1)
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - mondayOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return {
      date,
      isCurrentMonth: date.getMonth() === month,
    }
  })
}
