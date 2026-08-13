# KaziCare Hospitality — Web (Demo Build)

A workforce-management web app scoped for restaurants, cafés and hotel restaurants:
Dashboard, Employees, Shifts, Attendance, Leave, Analytics — built with Next.js 16
(App Router), TypeScript, and Tailwind CSS.

This is a real, running application, verified end to end (`npm run build` passes,
every route returns HTTP 200 on `npm run start`). It runs on **in-memory demo data**
(`src/lib/data.ts`) — there is no database, authentication, or API behind it yet.
See `FINAL-BUILD-REPORT.md` for exactly what's implemented vs. what's required to
make this a real multi-tenant SaaS product (backend, DB, Android app, CI/CD, marketing
site, AI layer).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Structure

```
src/
  app/
    page.tsx            Dashboard
    employees/page.tsx
    shifts/page.tsx
    attendance/page.tsx
    leave/page.tsx
    analytics/page.tsx
  components/
    Sidebar.tsx
    PageHeader.tsx
  lib/
    data.ts              Demo dataset (5 departments, 12 employees, shifts,
                          attendance, leave, attention items, health score)
```

## What works right now

- Dashboard with live-computed KPIs, shift coverage bars, an "Attention Required"
  panel (understaffing, missed clock-ins, expiring certificates, pending leave),
  and an explainable Workforce Health Score with contributing factors.
- Employees directory with department, role, employment type and status.
- Shift board with per-shift staffing status (Fully Staffed / Understaffed / Open).
- Attendance view (scheduled vs. clock-in vs. status).
- Leave requests with approval status and shift-conflict flagging.
- Analytics page computing real aggregates from the demo dataset.

All numbers on every page are computed from `src/lib/data.ts`, not hardcoded twice —
change the data file and every page updates consistently.

## What this is not (yet)

No database, no auth/RBAC, no multi-tenancy, no Android app, no backend/API, no
CI/CD, no marketing site, no AI layer. These are exactly the pieces the original
brief scoped — see `FINAL-BUILD-REPORT.md` for a clear-eyed list of what's next.
