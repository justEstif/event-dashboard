# MVP: Fastbreak Event Dashboard

## What

### Core Features

- **Authentication** — Email/password sign-up + login, Google OAuth SSO, protected routes, logout
- **Event Dashboard** — Paginated list of all sports events with key details (name, date, venue, sport type); search by name, filter by sport type (refetches from DB)
- **Event CRUD** — Create, edit, and delete sports events with: name, sport type, date & time, description, and multiple venues
- **Venue Management** — Each event supports multiple venues (name, address); managed inline with the event form

### What it is NOT

- No public-facing event pages (only authenticated users)
- No ticketing, RSVPs, or attendee management
- No role-based permissions (all authenticated users have full CRUD)
- No real-time updates (no WebSocket / Supabase Realtime)
- No image uploads or media attachments

---

## Why

This is a take-home technical challenge for Fastbreak. The goal is to demonstrate:

- Production-quality Next.js 15 App Router architecture
- Correct server-side data access patterns (Server Actions > API Routes, no client-side Supabase calls)
- Type-safe, consistent error handling via shared helpers
- Polished UX using shadcn/ui + Tailwind with loading states, toasts, and responsive layout

**Target user:** The Fastbreak engineering team reviewing this submission.

> Technical architecture, schema, and stack decisions live in [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Competition / Prior Art

| Tool                                          | What it does                          | Gap this fills                                                                  |
| --------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| Generic event platforms (Eventbrite)          | Full-featured public event management | Overkill; no sports-specific focus; not a code showcase                         |
| Sports management SaaS (TeamSnap, LeagueApps) | Team/league management                | Heavy feature set; this is intentionally minimal                                |
| Custom admin dashboards                       | Bespoke CRUD apps                     | This demonstrates specific Next.js 15 + Supabase patterns Fastbreak cares about |

This project isn't competing in the market — it's a technical benchmark for demonstrating the specific architecture patterns Fastbreak uses.

---

## MVP Milestones

1. **Project scaffold** — Next.js 15 app with Tailwind + shadcn/ui installed, Supabase project created, env vars wired, Vercel project linked
2. **Database + RLS** — `events` and `venues` tables created, Row Level Security policies applied
3. **Auth flows** — Sign-up, login (email + Google), logout, middleware-based route protection
4. **Type-safe helper layer** — `createServerClient`, `actionResult<T>`, `withAuth()` guard
5. **Event CRUD server actions** — `createEvent`, `updateEvent`, `deleteEvent`, `getEvents`, `getEventById` — all with proper error handling
6. **Dashboard page** — Responsive grid/list of events, search by name + filter by sport (server-side refetch), loading skeletons
7. **Create/Edit event form** — shadcn Form + react-hook-form, dynamic venue fields (add/remove), date picker, toast notifications
8. **Delete flow** — Confirmation dialog, optimistic UI update or revalidation
9. **Polish + README** — Responsive QA, empty states, error boundaries, meaningful README with architecture decisions

---

## Open Questions

- [x] Should sport types be a hardcoded enum or a free-text input? → **Hardcoded enum**
- [x] Venue fields — just name + address, or also capacity/notes? → **Name + address only**
- [x] Should users only see their own events, or all events from all users? → **Own events only (RLS on user_id)**
- [x] Pagination strategy — cursor-based or offset? How many events per page? → **Offset, 20/page, numbered pages (page in URL search params)**
- [ ] Google OAuth — need to configure redirect URIs in Supabase dashboard before testing → **In progress**
