# Fastbreak

A sports event dashboard built with Next.js 16, Supabase, and Google OAuth.

Create and manage your sporting events — search, filter by sport, and keep track of venues across Soccer, Basketball, Tennis, Baseball, Volleyball, Rugby, Hockey, and American Football.

---

## Try it out

A demo account is pre-seeded with 15 events across all sport types (past, present, and future):

| | |
|---|---|
| **Email** | `demo@fastbreak.app` |
| **Password** | `fastbreak2026!` |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router (React Server Components) |
| Database | Supabase (Postgres + Row Level Security) |
| Auth | Supabase Auth — email/password + Google OAuth |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Forms | react-hook-form + Zod |
| Tests | Vitest |

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/justEstif/event-dashboard
cd event-dashboard
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy your project URL and anon key from **Settings → API**.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Required only for the seed script
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

> The service role key is in **Supabase dashboard → Settings → API → service_role**.

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Seed demo data (optional)

```bash
npm run seed
```

This creates `demo@fastbreak.app` (email-confirmed) and inserts 15 sample events. Safe to re-run.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Google OAuth (optional)

To enable **Continue with Google**:

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/).
2. Add your Supabase callback URL as an authorized redirect URI:
   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```
3. In the Supabase dashboard → **Authentication → Providers → Google**, paste the client ID and secret.

See [docs/SETUP.md](docs/SETUP.md) for the full step-by-step guide.

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
app/
  (protected)/        # Route group — shared nav layout
    error.tsx         # Error boundary for all protected routes
    dashboard/        # Event list with search + filter
    events/
      new/            # Create event form
      [id]/           # Event detail page
        not-found.tsx # 404 for missing/unauthorised events
        edit/         # Edit + delete event form
  auth/               # Login, sign-up, callback
  global-error.tsx    # Root-level error boundary
actions/
  auth.ts             # signIn, signUp, signOut
  events/             # getEvents, getEventById, createEvent, updateEvent, deleteEvent
components/
  events/             # EventCard, EventForm, SportBadge, DashboardFilters, Pagination, DeleteEventButton
  ui/                 # shadcn/ui components
lib/
  result.ts           # ActionResult<T> discriminated union
  auth.ts             # withAuth() guard, requireAuthUser()
  schemas/event.ts    # Zod schemas + shared types
supabase/
  migrations/         # DB schema + RLS policies
scripts/
  seed.ts             # Demo user + event seed script
```
