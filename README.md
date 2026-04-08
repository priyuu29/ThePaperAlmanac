# The Paper Almanac

A frontend engineering assessment project built with Next.js and React.

This project reimagines a traditional hanging wall calendar as an interactive web experience. The goal was to stay close to the physical reference image while adding practical digital interactions like date-range selection, notes, responsive behavior, local persistence, and a small paper/ink theme toggle.

## Preview

Recommended additions before submission:

- GitHub repository link
- Short Loom or screen-recorded walkthrough
- Optional Vercel deployment link

## Features

- Physical wall-calendar inspired layout with a hanging paper feel
- Month hero artwork with seasonal/month-aware visual changes
- Start and end date range selection
- Clear visual states for:
  - start date
  - end date
  - dates in between
- Integrated notes section for:
  - monthly memo
  - selected date/range notes
- Local persistence using `localStorage`
- Responsive layout for desktop and mobile
- Custom image upload for the hero section
- Paper mode / Ink mode toggle

## Design Direction

The UI is intentionally styled to feel less like a dashboard and more like a real printed calendar page:

- warm paper background
- subtle lift/shadow to simulate a sheet hanging off the wall
- connected layout so the image, calendar grid, and notes feel like one physical object
- serif-forward typography for the calendar presentation
- restrained motion and interactions so the design stays elegant

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    calendar/
      WallCalendar.tsx
      HeroSection.tsx
      CalendarGrid.tsx
      NotesPanel.tsx
    ui/
      button.tsx
  lib/
    utils.ts
  types/
    calendar.ts
public/
```

## How It Works

### Date Selection

Users can click one date to set the start of a range and click another date to set the end. The component highlights the range clearly across the calendar grid.

### Notes

The notes section supports:

- a monthly memo for the active month
- notes tied to the currently selected date range
- editing and deleting saved notes

### Persistence

All interactions are stored in `localStorage`, so refreshing the page keeps the current state without needing a backend.

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

To create a production build:

```bash
npm run build
npm start
```

## Assessment Notes

This submission is intentionally frontend-only.

- No backend
- No database
- No external API dependency for the core experience
- All state handled on the client

## What To Show In The Demo Video

If you are recording a walkthrough, demonstrate these flows:

1. Navigate between months.
2. Select a start and end date.
3. Show the highlighted range.
4. Add a note for the selected range.
5. Edit and delete a note.
6. Add content to the monthly memo area.
7. Refresh the page to show persistence.
8. Resize the app to show mobile responsiveness.
9. Toggle between Paper mode and Ink mode.

## Why I Built It This Way

The challenge asked for more than a working calendar. It asked for a polished component inspired by a physical reference image. Because of that, I focused on two things equally:

- functional interaction quality
- visual translation of a real hanging wall calendar into a responsive frontend component

## Future Improvements

If I had more time, I would explore:

- holiday/event markers
- drag-to-select date ranges
- downloadable note summary for a selected month
- smoother page-flip style month transitions
- accessibility refinements for keyboard-only range selection

## Author

Built as part of a Software Engineering internship assessment.
