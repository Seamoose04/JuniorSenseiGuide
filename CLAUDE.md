# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Junior Sensei Guide is a student progress tracking app for educators — managing students, awarding points via transactions, and running a points-based reward shop. It also tracks student Scratch project progress.

## Commands

```bash
npm run dev:all        # Start both PocketBase backend and Next.js frontend concurrently
npm run dev            # Next.js only (port 3000)
npm run dev:backend    # PocketBase only (port 8090)
npm run dev:web        # Next.js with Turbopack (port 3001)
npm run build          # Production build
npm run lint           # ESLint
npm run typegen        # Regenerate lib/pocketbase-types.ts from live PocketBase schema
npm test               # Vitest watch mode
npm run test:run       # Run tests once (CI)
npm run test:coverage  # Tests with coverage report
```

To run a single test file:
```bash
npx vitest run tests/data/students.test.ts
```

## Architecture

**Stack:** Next.js 16 App Router + TypeScript + Tailwind CSS v4 + shadcn/ui + PocketBase

### Data Flow Pattern

Pages follow a server-first pattern:
1. `app/*/page.tsx` — Server component; fetches data via `lib/data/` functions or server actions
2. `app/*/[Page]Client.tsx` — Client component (`"use client"`); handles interactivity
3. `app/actions/` and `app/*/actions.ts` — Server actions (`"use server"`); handle mutations

### Backend: PocketBase

PocketBase runs as a local binary at `services/pocketbase/pocketbase` with SQLite storage in `services/pocketbase/pb_data/`.

**Collections:**
- `students` — student records (first_name, last_name, nickname, cohort, contact, enrollment_date)
- `point_transactions` — ledger of point awards (student relation, amount, reason)
- `shop_items` — reward shop items (name, cost in points, description HTML)
- `scratch_progress` — per-student Scratch project stars (student relation, project number, stars)
- `users` — auth collection for staff accounts

**Types** in `lib/pocketbase-types.ts` are auto-generated — never edit manually. Run `npm run typegen` after schema changes.

**PocketBase client** is initialized in `lib/pocketbase.ts`. Auth is cookie-based (`pb_auth`, 7-day expiry); server actions restore auth state from cookies.

### Point Balance Calculation

`lib/data/students.ts → getStudentsWithBalances()` fetches all students and all transactions in parallel, then aggregates balances client-side. This works for small class sizes.

### Key Directories

- `app/actions/` — global server actions (auth, student CRUD)
- `app/shop/` — shop pages and actions; `app/shop/student/[id]/` for student redemption flow
- `components/ui/` — shadcn/ui component library (do not modify generated files)
- `components/students/` — domain components for student views
- `lib/data/` — server-side data fetching functions
- `tests/` — Vitest tests; mirrors `app/` and `lib/` structure

### Testing

Tests use Vitest + React Testing Library with jsdom. `tests/setup.ts` mocks Next.js APIs (`next/headers`, `next/cache`, `next/navigation`). Test mocks for PocketBase live in `tests/mocks/`.

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
PB_ADMIN_EMAIL=...
PB_ADMIN_PASSWORD=...
```
`PB_TYPEGEN_*` vars are used only by `npm run typegen`.
