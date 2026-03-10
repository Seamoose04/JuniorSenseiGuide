# Student Progress Tracker — Project Outline

## Stack
- **Frontend:** Next.js, Tailwind CSS, shadcn/ui
- **Backend:** PocketBase
- **Timeline:** 1–4 weeks (solo developer)

---

## Feature Map

### Phase 1 — Foundation (Days 1–3)
**Goal: Get the app shell running with data.**

- Next.js + Tailwind + shadcn/ui project setup
- PocketBase setup (local or hosted) + collections schema:
  - `students` — name, cohort/group, contact info, enrollment date
  - `projects` — project name, description, subject/category
  - `student_projects` — student, project, completion date, status (in progress / done / skipped)
  - `subject_ratings` — student, subject, comfort level (1–5), date recorded
  - `notes` — student, content, created_by, timestamp
- PocketBase auth setup (admin-only or multi-user)

---

### Phase 2 — Core Views (Days 4–10)
**Goal: The main screens you'll use daily.**

- **Student roster** — searchable/filterable table of all students (shadcn `DataTable`)
- **Student detail page** — per-student view showing:
  - Project completion history (with dates)
  - Comfort ratings per subject (simple visual scale)
  - Personal notes log (add/edit/delete)
- **Add/edit student form** — shadcn `Form` + validation
- **Log project completion** — form to mark a project done for a student (or batch)
- **Log comfort rating** — quick form to record subject comfort level

---

### Phase 3 — Search & Filtering (Days 11–16)
**Goal: Make the data actually findable.**

- Global student search by name / cohort
- Filter roster by: cohort, project status, subject comfort range
- Filter project history by date range or subject
- Sort columns in data tables

---

### Phase 4 — Polish & QoL (Days 17–21)
**Goal: Make it pleasant to use daily.**

- Dashboard home — summary cards (total students, projects completed this week, avg comfort ratings)
- Empty states, loading skeletons, error handling
- Mobile-friendly layout check
- PocketBase rules/permissions locked down
- Deploy (Vercel for Next.js + PocketBase on a small VPS or Railway)

---

## PocketBase Schema

| Collection | Key Fields |
|---|---|
| `students` | name, cohort, contact, enrollment_date |
| `projects` | name, description, category |
| `student_projects` | student (rel), project (rel), completion_date, status |
| `subject_ratings` | student (rel), subject, comfort_level (1–5), date |
| `notes` | student (rel), content, created_by, created_at |

---

## Risks to Watch

- **PocketBase relations** can get tricky — map out your collection schema on paper before building
- **shadcn DataTable** requires some boilerplate; do this early so filtering/sorting is easy to extend
- Notes + ratings will accumulate fast — make sure the student detail page is paginated from the start
