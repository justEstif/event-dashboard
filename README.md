# Fastbreak Event Dashboard

**Live:** https://event-dashboard-xi.vercel.app

Sports event dashboard — create and manage events, search and filter by sport, sign in with email or Google OAuth.

---

## Try it

|              |                      |
| ------------ | -------------------- |
| **Email**    | `demo@fastbreak.app` |
| **Password** | `fastbreak2026!`     |

---

## How I built this

1. Extracted the core requirements into [docs/MVP.md](docs/MVP.md), separating what's in scope from what isn't
2. Derived the schema, data flow, and key decisions into ([docs/ARCHITECTURE.md](docs/ARCHITECTURE.md))
3. Broke architecture into concrete steps, including design as an explicit task (not an afterthought)
4. Scaffolded from a [template](https://vercel.com/templates/next.js/supabase). It saved setup time.

- The template shipped with Tailwind v3, so I ran the CLI migration script to get to v4 without manual rewrites

5. **Identified AI tooling** — decided on some agents skills before writing code:

- [Supabase](https://skills.sh/supabase/agent-skills/supabase-postgres-best-practices),
- [Next.js](https://skills.sh/vercel-labs/next-skills/next-best-practices)
- [Agent Browser for testing](https://agent-browser.dev/)
- [Impeccable](http://impeccable.style/) for the design system.
- I reviewed everything myself. The output was clean and used the right libraries, so not much correction needed

6. Supabase Auth already handles users, so the schema is just `events` and `venues` built on top of that.

- One decision the challenge didn't specify: can users see each other's events? I assumed no - each user only sees their own, enforced via Row Level Security on `user_id`. Could mean some duplicate data at scale, but at this scope it doesn't matter

7. Focused on guardrails: pre-commit hooks (lint-staged + prettier + Vitest) catch issues before they push. In CI: wide-event logging on all server actions, Playwright E2E, every push to `staging` runs against a Vercel preview before merging to `main`.

- One non-obvious CI issue: Vercel protects preview deployments by default, so Playwright needs a bypass secret to reach them

The one real debugging session was Playwright in CI. Tests kept failing because SSR navigation timing was slightly off; Playwright would assert before the redirect completed. The fix was moving the redirect to the client side, which gave Playwright a reliable signal to wait on. The CI cleanup script also runs on pass and fail so stale test data never piles up in the demo account.

The stack was largely prescribed by the challenge. Full breakdown: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Design decisions: [docs/DESIGN.md](docs/DESIGN.md).

---

## What I'd do differently

For larger projects I prefer a **core domain → server → client** layered structure - keeps things portable and testable in isolation. Overkill here, but worth noting.

The exact word for this is hexagonal architecture. _Usually, I use this [skill](https://github.com/justEstif/skills/blob/main/hexagonal-architecture/SKILL.md) to enforce it._

---

## On Next.js version

The challenge specified Next.js 15. I used 16. The differences between the two are mostly performance-related and don't affect correctness, not a concern for a non-production application.

---

## Google OAuth setup

A few non-obvious steps across Google Cloud Console, Supabase, and Vercel. Full guide in [docs/SETUP.md](docs/SETUP.md).

---

## Stack

| Layer           | Choice                      |
| --------------- | --------------------------- |
| Framework       | Next.js 16 App Router       |
| Database + Auth | Supabase (Postgres + RLS)   |
| Styling         | Tailwind CSS v4 + shadcn/ui |
| Forms           | react-hook-form + Zod       |
| Tests           | Vitest + Playwright         |
| Deployment      | Vercel                      |

---

## Available scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run test       # Run unit tests (Vitest)
npm run seed       # Seed demo user + 15 events
npm run db:push    # Push Supabase migrations
npm run db:reset   # Reset local Supabase DB
```

---

## Project structure

```
.
├── app/
│   ├── (protected)/          # Route group — shared nav layout
│   │   ├── error.tsx         # Error boundary for all protected routes
│   │   ├── dashboard/        # Event list with search + filter
│   │   └── events/
│   │       ├── new/          # Create event form
│   │       └── [id]/         # Event detail page
│   │           ├── not-found.tsx  # 404 for missing/unauthorised events
│   │           └── edit/     # Edit + delete event form
│   ├── auth/                 # Login, sign-up, callback
│   └── global-error.tsx      # Root-level error boundary
├── actions/
│   ├── auth.ts               # signIn, signUp, signOut
│   └── events/               # getEvents, getEventById, createEvent, updateEvent, deleteEvent
├── components/
│   ├── events/               # EventCard, EventForm, SportBadge, DashboardFilters, Pagination, DeleteEventButton
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── result.ts             # ActionResult<T> discriminated union
│   ├── auth.ts               # withAuth() guard, requireAuthUser()
│   └── schemas/event.ts      # Zod schemas + shared types
├── supabase/
│   └── migrations/           # DB schema + RLS policies
└── scripts/
    └── seed.ts               # Demo user + event seed script
```
