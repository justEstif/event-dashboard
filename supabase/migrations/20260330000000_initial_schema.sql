-- Make operator classes from the extensions schema available
set search_path to public, extensions;

-- ============================================================
-- Migration: Initial schema
-- Tables: events, venues
-- ============================================================

-- ------------------------------------------------------------
-- Enum: sport types (hardcoded, consistent filtering)
-- ------------------------------------------------------------
create type sport_type_enum as enum (
  'Soccer',
  'Basketball',
  'Tennis',
  'Baseball',
  'Volleyball',
  'Rugby',
  'Hockey',
  'American Football'
);

-- ------------------------------------------------------------
-- Table: events
-- ------------------------------------------------------------
create table events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  sport_type  sport_type_enum not null,
  starts_at   timestamptz not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index: RLS + queries filter by user_id constantly
create index events_user_id_idx on events (user_id);

-- Index: dashboard default sort + date filtering
create index events_user_id_starts_at_idx on events (user_id, starts_at desc);

-- Index: sport_type filter on dashboard
create index events_user_id_sport_type_idx on events (user_id, sport_type);

-- Index: name search (case-insensitive prefix / ILIKE queries)
create index events_name_trgm_idx on events using gin (name gin_trgm_ops);

-- Trigger: keep updated_at current on every row update
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_set_updated_at
  before update on events
  for each row
  execute function set_updated_at();

-- ------------------------------------------------------------
-- Table: venues
-- ------------------------------------------------------------
create table venues (
  id        uuid primary key default gen_random_uuid(),
  event_id  uuid not null references events(id) on delete cascade,
  name      text not null,
  address   text
);

-- Index: FK column — fast joins + cascade deletes
create index venues_event_id_idx on venues (event_id);

-- ------------------------------------------------------------
-- Row Level Security: events
-- RLS policy wraps auth.uid() in a subquery so it is evaluated
-- once per statement, not once per row (performance best practice)
-- ------------------------------------------------------------
alter table events enable row level security;
alter table events force row level security;

create policy events_select on events
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy events_insert on events
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy events_update on events
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy events_delete on events
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ------------------------------------------------------------
-- Row Level Security: venues
-- Venues are owned transitively through their event.
-- Use a subquery join so auth.uid() is evaluated once.
-- ------------------------------------------------------------
alter table venues enable row level security;
alter table venues force row level security;

create policy venues_select on venues
  for select
  to authenticated
  using (
    exists (
      select 1 from events
      where events.id = venues.event_id
        and events.user_id = (select auth.uid())
    )
  );

create policy venues_insert on venues
  for insert
  to authenticated
  with check (
    exists (
      select 1 from events
      where events.id = venues.event_id
        and events.user_id = (select auth.uid())
    )
  );

create policy venues_update on venues
  for update
  to authenticated
  using (
    exists (
      select 1 from events
      where events.id = venues.event_id
        and events.user_id = (select auth.uid())
    )
  );

create policy venues_delete on venues
  for delete
  to authenticated
  using (
    exists (
      select 1 from events
      where events.id = venues.event_id
        and events.user_id = (select auth.uid())
    )
  );
