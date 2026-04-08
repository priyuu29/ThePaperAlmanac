'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { BrushCleaning, MoonStar, RefreshCcw, SunMedium } from 'lucide-react'
import HeroSection from './HeroSection'
import CalendarGrid from './CalendarGrid'
import NotesPanel from './NotesPanel'
import { Button } from '@/components/ui/button'
import { clampToStartOfDay, formatRangeLabel, storage, toDateKey, toMonthKey } from '@/lib/utils'
import type { CalendarState, Note } from '@/types/calendar'

const STORAGE_KEY = 'wall-calendar-assessment'

interface StoredCalendarState {
  currentDate: string
  selectedRange: { start: string; end?: string } | null
  notes: Note[]
  monthMemos: Record<string, string>
  customHeroImage: string | null
  theme: 'paper' | 'night'
}

function serializeState(state: CalendarState): StoredCalendarState {
  return {
    currentDate: state.currentDate.toISOString(),
    selectedRange: state.selectedRange
      ? {
          start: state.selectedRange.start.toISOString(),
          end: state.selectedRange.end?.toISOString(),
        }
      : null,
    notes: state.notes,
    monthMemos: state.monthMemos,
    customHeroImage: state.customHeroImage,
    theme: state.theme,
  }
}

function hydrateState(saved: StoredCalendarState): CalendarState {
  return {
    currentDate: new Date(saved.currentDate),
    selectedRange: saved.selectedRange
      ? {
          start: new Date(saved.selectedRange.start),
          end: saved.selectedRange.end ? new Date(saved.selectedRange.end) : undefined,
        }
      : null,
    notes: saved.notes || [],
    monthMemos: saved.monthMemos || {},
    customHeroImage: saved.customHeroImage,
    theme: saved.theme || 'paper',
  }
}

export default function WallCalendar() {
  const [state, setState] = useState<CalendarState>(() => {
    const saved =
      typeof window === 'undefined' ? null : storage<StoredCalendarState>(STORAGE_KEY)

    return saved
      ? hydrateState(saved)
      : {
          currentDate: clampToStartOfDay(new Date()),
          selectedRange: null,
          notes: [],
          monthMemos: {},
          customHeroImage: null,
          theme: 'paper',
        }
  })
  const hasPersisted = useRef(false)
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    if (!isHydrated) return
    if (!hasPersisted.current) {
      hasPersisted.current = true
      return
    }
    storage(STORAGE_KEY, serializeState(state))
  }, [isHydrated, state])

  const monthKey = useMemo(() => toMonthKey(state.currentDate), [state.currentDate])
  const monthMemo = state.monthMemos[monthKey] || ''

  const handleDateClick = (date: Date) => {
    const safeDate = clampToStartOfDay(date)

    setState((prev) => {
      const currentRange = prev.selectedRange

      if (!currentRange?.start || currentRange.end) {
        return { ...prev, selectedRange: { start: safeDate } }
      }

      if (safeDate.getTime() < currentRange.start.getTime()) {
        return {
          ...prev,
          selectedRange: {
            start: safeDate,
            end: currentRange.start,
          },
        }
      }

      return {
        ...prev,
        selectedRange: {
          start: currentRange.start,
          end: safeDate,
        },
      }
    })
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setState((prev) => {
      const nextDate = new Date(prev.currentDate)
      nextDate.setMonth(nextDate.getMonth() + (direction === 'next' ? 1 : -1))
      nextDate.setDate(1)

      return {
        ...prev,
        currentDate: clampToStartOfDay(nextDate),
        selectedRange: null,
      }
    })
  }

  const handleJumpToToday = () => {
    const today = clampToStartOfDay(new Date())

    setState((prev) => ({
      ...prev,
      currentDate: today,
      selectedRange: {
        start: today,
      },
    }))
  }

  const handleAddNote = (content: string) => {
    setState((prev) => {
      const range = prev.selectedRange
        ? {
            start: toDateKey(prev.selectedRange.start),
            end: toDateKey(prev.selectedRange.end || prev.selectedRange.start),
          }
        : undefined

      const note: Note = {
        id: crypto.randomUUID(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        monthKey: toMonthKey(prev.currentDate),
        range,
      }

      return {
        ...prev,
        notes: [note, ...prev.notes],
      }
    })
  }

  const handleUpdateNote = (id: string, content: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) =>
        note.id === id ? { ...note, content: content.trim() } : note
      ),
    }))
  }

  const handleDeleteNote = (id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== id),
    }))
  }

  const clearSelection = () => {
    setState((prev) => ({ ...prev, selectedRange: null }))
  }

  const resetProject = () => {
    const freshState: CalendarState = {
      currentDate: clampToStartOfDay(new Date()),
      selectedRange: null,
      notes: [],
      monthMemos: {},
      customHeroImage: null,
      theme: 'paper',
    }
    setState(freshState)
  }

  const selectionLabel = state.selectedRange?.start
    ? formatRangeLabel(state.selectedRange.start, state.selectedRange.end)
    : 'No dates selected yet'
  const paperMode = state.theme === 'paper'

  if (!isHydrated) {
    return (
      <main className="min-h-screen px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-5xl pt-8 md:pt-12">
          <div className="paper-card calendar-stack-shadow paper-grain overflow-hidden rounded-[2.5rem] px-4 py-4 md:px-6 md:py-6">
            <div className="h-[720px] animate-pulse rounded-[2rem] bg-white/70" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={paperMode ? 'min-h-screen px-4 py-10 md:px-6 md:py-14' : 'min-h-screen bg-[#1a1d22] px-4 py-10 md:px-6 md:py-14'}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={paperMode ? 'text-xs font-semibold uppercase tracking-[0.34em] text-[#65707d]' : 'text-xs font-semibold uppercase tracking-[0.34em] text-[#8b929d]'}>
              SWE Intern Assessment
            </p>
            <h1 className={paperMode ? 'font-display text-5xl font-semibold text-[#13171d] md:text-7xl' : 'font-display text-5xl font-semibold text-[#f2ede5] md:text-7xl'}>
              The Paper Almanac
            </h1>
            <p className={paperMode ? 'mt-1 text-sm uppercase tracking-[0.24em] text-[#747f8b]' : 'mt-1 text-sm uppercase tracking-[0.24em] text-[#747c87]'}>
              Quiet dates for the month ahead
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  theme: prev.theme === 'paper' ? 'night' : 'paper',
                }))
              }
            >
              {paperMode ? <MoonStar className="mr-2 h-4 w-4" /> : <SunMedium className="mr-2 h-4 w-4" />}
              {paperMode ? 'Ink mode' : 'Paper mode'}
            </Button>
            <Button variant="outline" onClick={clearSelection}>
              <BrushCleaning className="mr-2 h-4 w-4" />
              Clear range
            </Button>
            <Button variant="outline" onClick={resetProject}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset demo
            </Button>
          </div>
        </div>

        <section className="calendar-shell mx-auto max-w-[72rem] pt-6 md:pt-10">
          <div className={paperMode ? 'paper-card calendar-stack-shadow hanging-lift overflow-hidden rounded-[2.5rem] px-4 py-4 paper-grain md:px-6 md:py-6' : 'hanging-lift overflow-hidden rounded-[2.5rem] border border-[#333943] bg-[#24282f] px-4 py-4 shadow-[0_2rem_3.8rem_rgba(0,0,0,0.35)] md:px-6 md:py-6'}>
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.28fr)_320px] lg:items-stretch">
              <div className="flex flex-col">
                <HeroSection
                  currentDate={state.currentDate}
                  customImage={state.customHeroImage}
                  onImageChange={(customHeroImage) =>
                    setState((prev) => ({ ...prev, customHeroImage }))
                  }
                />

                <CalendarGrid
                  currentDate={state.currentDate}
                  selectedRange={state.selectedRange}
                  notes={state.notes.filter((note) => note.monthKey === monthKey)}
                  onDateClick={handleDateClick}
                  onMonthChange={handleMonthChange}
                  onJumpToToday={handleJumpToToday}
                />
              </div>

              <NotesPanel
                currentDate={state.currentDate}
                selectedRange={state.selectedRange}
                notes={state.notes}
                monthMemo={monthMemo}
                onMonthMemoChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    monthMemos: {
                      ...prev.monthMemos,
                      [monthKey]: value,
                    },
                  }))
                }
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>

            <div className="calendar-rule mt-6 flex flex-col gap-3 rounded-[1.1rem] border bg-[#f7efe2] px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6f7883]">Selected dates</p>
                <p className="mt-1 text-sm text-[#39434d]">{selectionLabel}</p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  )
}
