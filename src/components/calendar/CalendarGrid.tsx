'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  cn,
  formatRangeLabel,
  getMonthGrid,
  isDateInRange,
  months,
  sameDay,
  toDateKey,
  weekdayLabels,
} from '@/lib/utils'
import type { CalendarState } from '@/types/calendar'

interface CalendarGridProps {
  currentDate: Date
  selectedRange: CalendarState['selectedRange']
  notes: CalendarState['notes']
  onDateClick: (date: Date) => void
  onMonthChange: (direction: 'prev' | 'next') => void
  onJumpToToday: () => void
}

export default function CalendarGrid({
  currentDate,
  selectedRange,
  notes,
  onDateClick,
  onMonthChange,
  onJumpToToday,
}: CalendarGridProps) {
  const year = currentDate.getFullYear()
  const monthIndex = currentDate.getMonth()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const days = getMonthGrid(year, monthIndex)

  const hasNoteOnDate = (date: Date) => {
    const dateKey = toDateKey(date)
    return notes.some(
      (note) =>
        note.range &&
        dateKey >= note.range.start &&
        dateKey <= (note.range.end || note.range.start)
    )
  }

  const getNotesForDate = (date: Date) => {
    const dateKey = toDateKey(date)
    return notes.filter(
      (note) =>
        note.range &&
        dateKey >= note.range.start &&
        dateKey <= (note.range.end || note.range.start)
    )
  }

  const isSelectionStart = (date: Date) => {
    return selectedRange?.start ? sameDay(date, selectedRange.start) : false
  }

  const isSelectionEnd = (date: Date) => {
    return selectedRange?.end ? sameDay(date, selectedRange.end) : false
  }

  const isSelected = (date: Date) => {
    if (!selectedRange?.start) return false
    if (!selectedRange.end) return sameDay(date, selectedRange.start)
    return isDateInRange(date, selectedRange.start, selectedRange.end)
  }

  const isPreview = (date: Date) => {
    if (!selectedRange?.start || selectedRange.end || !hoveredDate) return false

    const previewStart = hoveredDate < selectedRange.start ? hoveredDate : selectedRange.start
    const previewEnd = hoveredDate < selectedRange.start ? selectedRange.start : hoveredDate
    return isDateInRange(date, previewStart, previewEnd)
  }

  const selectionLabel = selectedRange?.start
    ? formatRangeLabel(selectedRange.start, selectedRange.end)
    : 'Choose a start day, then an end day'

  return (
    <section className="rounded-b-[1.6rem] border border-[#cdbca3] bg-[#f7efe2] px-4 py-4 md:px-5 md:py-5">
      <div className="mb-4 flex flex-col gap-3 border-b border-[#d6c6ae] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6e7781]">
            Calendar Page
          </p>
          <h2 className="font-display text-[2.35rem] font-semibold text-[#161b22] md:text-[3rem]">
            {months[monthIndex]} {year}
          </h2>
          <p className="mt-1 text-sm text-[#4c5560]">{selectionLabel}</p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            onClick={onJumpToToday}
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange('prev')}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange('next')}
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-0 grid grid-cols-7 border-y border-[#d6c6ae] text-center">
        {weekdayLabels.map((day, idx) => (
          <div
            key={day}
            className={cn(
              'border-r border-[#dbcdb8] py-2.5 text-[11px] font-semibold tracking-[0.2em] text-[#616872] last:border-r-0 md:text-xs',
              idx >= 5 && 'text-[#4e97c5]'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${monthIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-7 border-b border-l border-[#d6c6ae]"
        >
          {days.map(({ date, isCurrentMonth }) => {
            const dateKey = toDateKey(date)
            const isToday = sameDay(date, today)
            const start = isSelectionStart(date)
            const end = isSelectionEnd(date)
            const selected = isSelected(date)
            const preview = isPreview(date)
            const dayNotes = getNotesForDate(date)
            const noteCount = dayNotes.length
            const isHovered = hoveredDate ? sameDay(date, hoveredDate) : false

            return (
              <motion.button
                key={dateKey}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative min-h-[60px] border-r border-t border-[#d6c6ae] px-2 py-2.5 text-left transition-colors md:min-h-[72px] md:px-2.5 md:py-3',
                  isCurrentMonth ? 'bg-[#f7efe2] text-[#1e232b]' : 'bg-[#efe4d3] text-[#988f81]',
                  isToday && 'bg-[#dde9f3]',
                  selected && 'range-bar',
                  (start || end) && 'bg-[#4da0d1] text-white',
                  preview && !selected && 'bg-[#edf6fb]'
                )}
                onClick={() => onDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <span className={cn(
                  'font-display text-[1.2rem] leading-none md:text-[1.45rem]',
                  !isCurrentMonth && 'opacity-65'
                )}>
                  {date.getDate()}
                </span>
                <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] md:text-[11px]">
                  <span className={cn(!isCurrentMonth && 'opacity-0')}>{isToday ? 'today' : ''}</span>
                  {hasNoteOnDate(date) ? (
                    <span
                      className={cn(
                        'inline-flex h-2 w-2 rounded-full',
                      start || end ? 'bg-white' : 'bg-[#3d89ba]'
                      )}
                    />
                  ) : (
                    <span />
                  )}
                </div>
                {noteCount > 1 ? (
                  <span
                    className={cn(
                      'absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      start || end ? 'bg-white/20 text-white' : 'bg-[#ded1bf] text-[#505861]'
                    )}
                  >
                    {noteCount}
                  </span>
                ) : null}
                {isHovered && dayNotes.length > 0 ? (
                  <div className="pointer-events-none absolute bottom-[calc(100%-0.35rem)] left-1/2 z-20 w-48 -translate-x-1/2 rounded-[0.9rem] border border-[#cbb79d] bg-[#f6ecde] p-3 text-left shadow-[0_0.75rem_1.8rem_rgba(80,62,39,0.22)]">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f7782]">
                      Notes
                    </p>
                    <div className="space-y-1.5">
                      {dayNotes.slice(0, 2).map((note) => (
                        <p
                          key={note.id}
                          className="line-clamp-3 text-xs leading-5 text-[#38424d]"
                        >
                          {note.content}
                        </p>
                      ))}
                      {dayNotes.length > 2 ? (
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6f7782]">
                          +{dayNotes.length - 2} more
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-[#5f6974]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#4da0d1]" />
          Start and end
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#dceef9]" />
          In between
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7aaed0]" />
          Saved note
        </div>
      </div>
    </section>
  )
}
