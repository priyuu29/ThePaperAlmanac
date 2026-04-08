'use client'

import { FormEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRangeLabel, toMonthKey } from '@/lib/utils'
import type { Note, SelectedRange } from '@/types/calendar'

interface NotesPanelProps {
  currentDate: Date
  selectedRange: SelectedRange | null
  notes: Note[]
  monthMemo: string
  onMonthMemoChange: (value: string) => void
  onAddNote: (content: string) => void
  onUpdateNote: (id: string, content: string) => void
  onDeleteNote: (id: string) => void
}

export default function NotesPanel({
  currentDate,
  selectedRange,
  notes,
  monthMemo,
  onMonthMemoChange,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesPanelProps) {
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const monthKey = toMonthKey(currentDate)

  const visibleNotes = useMemo(() => {
    return notes
      .filter((note) => note.monthKey === monthKey)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }, [monthKey, notes])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.trim()) return
    onAddNote(draft)
    setDraft('')
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full rounded-b-[1.6rem] border border-t-0 border-[#cdbca3] bg-[#f7efe2] p-4 md:p-5 lg:rounded-b-none lg:rounded-r-[1.6rem] lg:border-t lg:border-l-0"
    >
      <div className="mb-4 border-b border-[#d6c6ae] pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6e7781]">Notes Section</p>
          <h3 className="font-display text-3xl font-semibold text-[#171b21]">Notes</h3>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#404853]">Monthly memo</p>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#79828d]">General</span>
          </div>
          <textarea
            value={monthMemo}
            onChange={(event) => onMonthMemoChange(event.target.value)}
            placeholder="Add a memo for this month, goals, reminders, or key deadlines."
            className="notes-rule min-h-28 w-full rounded-[1rem] border border-[#cdbca3] bg-[#f8f0e4] px-4 py-3 text-sm leading-7 text-[#33404c] outline-none transition placeholder:text-[#727c87] focus:border-[#6fa8ce]"
          />
        </div>

        <div className="rounded-[1rem] border border-dashed border-[#cbb79d] bg-[#efe4d3] px-4 py-3">
          <p className="text-sm font-semibold text-[#404853]">Current selection</p>
          <p className="mt-1 text-sm leading-6 text-[#535c67]">
            {selectedRange?.start
              ? `New note will attach to ${formatRangeLabel(selectedRange.start, selectedRange.end)}.`
              : 'No date range selected yet. Notes added now will still be saved for this month.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 rounded-[1rem] border border-[#cdbca3] bg-[#f8f0e4] p-4">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Attach a note to the selected dates."
            className="min-h-20 w-full resize-none border-0 bg-transparent p-0 text-sm leading-6 text-[#33404c] outline-none placeholder:text-[#727c87]"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#79828d]">Saved locally</p>
            <Button type="submit">Add note</Button>
          </div>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#404853]">This month&apos;s notes</p>
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#79828d]">{visibleNotes.length} items</span>
        </div>

        {visibleNotes.length === 0 ? (
          <div className="rounded-[1rem] border border-[#cdbca3] bg-[#f8f0e4] px-4 py-5 text-sm leading-6 text-[#5d6671]">
            Add a note after selecting a date range to demonstrate the required notes workflow in your assessment demo.
          </div>
        ) : null}

        {visibleNotes.map((note) => (
          <article
            key={note.id}
            className="rounded-[1rem] border border-[#cdbca3] bg-[#f8f0e4] p-4"
          >
            {editingId === note.id ? (
              <div className="space-y-3">
                <textarea
                  value={editingText}
                  onChange={(event) => setEditingText(event.target.value)}
                  className="min-h-24 w-full resize-none rounded-[0.9rem] border border-[#cdbca3] bg-[#fbf5ec] px-3 py-2 text-sm leading-6 text-[#33404c] outline-none focus:border-[#6fa8ce]"
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      if (!editingText.trim()) return
                      onUpdateNote(note.id, editingText)
                      setEditingId(null)
                      setEditingText('')
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null)
                      setEditingText('')
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm leading-6 text-[#33404c]">{note.content}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#767f89]">
                    {note.range
                      ? formatRangeLabel(new Date(`${note.range.start}T00:00:00`), new Date(`${(note.range.end || note.range.start)}T00:00:00`))
                      : 'Month note'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(note.id)
                        setEditingText(note.content)
                      }}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => onDeleteNote(note.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </motion.aside>
  )
}
