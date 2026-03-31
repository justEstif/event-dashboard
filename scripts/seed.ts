/**
 * Seed script — creates the demo user and 15 sample events.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   ← Supabase dashboard → Settings → API → service_role secret
 *
 * Idempotent: safe to re-run. Existing demo user is reused; events are
 * deleted and re-inserted on each run so the data stays fresh.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌  Missing env vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local",
  );
  process.exit(1);
}

const DEMO_EMAIL = "demo@fastbreak.app";
const DEMO_PASSWORD = "fastbreak2026!";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const now = new Date();
const d = (offsetDays: number, hour = 14, minute = 0) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, minute, 0, 0);
  return dt.toISOString();
};

type Event = {
  name: string;
  sport_type: string;
  starts_at: string;
  description?: string;
  venues: { name: string; address: string }[];
};

const EVENTS: Event[] = [
  // ── Past ──────────────────────────────────────────────────────────────────
  {
    name: "River City Derby",
    sport_type: "Soccer",
    starts_at: d(-30, 15),
    description:
      "Annual crosstown rivalry between North FC and South United. Sold-out crowd expected.",
    venues: [
      { name: "Riverside Stadium", address: "1 River Rd, Springfield" },
      { name: "South Fan Zone", address: "42 South Ave, Springfield" },
    ],
  },
  {
    name: "Winter Slam Classic",
    sport_type: "Basketball",
    starts_at: d(-14, 19, 30),
    description: "Four-team invitational with the region's top college squads.",
    venues: [{ name: "Metro Arena", address: "200 Downtown Blvd, Capital City" }],
  },
  {
    name: "Open Grass Court",
    sport_type: "Tennis",
    starts_at: d(-7, 10),
    description: "Amateur open, singles and doubles brackets. Grass surface.",
    venues: [
      { name: "Greenfields Club", address: "88 Park Lane, Westside" },
      { name: "Club Annex Courts", address: "90 Park Lane, Westside" },
    ],
  },

  // ── This week ─────────────────────────────────────────────────────────────
  {
    name: "Spring League Opener",
    sport_type: "Baseball",
    starts_at: d(-1, 13),
    description: "First game of the spring season. Free entry for juniors.",
    venues: [{ name: "Diamond Park", address: "7 Diamond Way, Northtown" }],
  },
  {
    name: "Beach Rally Cup",
    sport_type: "Volleyball",
    starts_at: d(0, 9),
    description: "Two-day beach volleyball tournament. 24 teams competing across 6 courts.",
    venues: [
      { name: "Central Beach Court A", address: "Beachfront Promenade, Seaview" },
      { name: "Central Beach Court B", address: "Beachfront Promenade, Seaview" },
      { name: "North Pier Courts", address: "North Pier, Seaview" },
    ],
  },
  {
    name: "Eastside Rugby Sevens",
    sport_type: "Rugby",
    starts_at: d(1, 11),
    description: "Fast-format rugby sevens with 8 club sides. Finals at 16:00.",
    venues: [{ name: "Eastside Athletic Ground", address: "34 Eastside Rd, Eastville" }],
  },

  // ── Next 2 weeks ──────────────────────────────────────────────────────────
  {
    name: "Metro Ice Clash",
    sport_type: "Hockey",
    starts_at: d(3, 18, 30),
    description:
      "Cross-divisional ice hockey double-header. Doors open 60 minutes before puck drop.",
    venues: [{ name: "Ice House Arena", address: "500 Cold St, Capital City" }],
  },
  {
    name: "Pigskin Preseason Showdown",
    sport_type: "American Football",
    starts_at: d(5, 15),
    description: "Preseason warm-up between the Stallions and the Rockets. Full broadcast.",
    venues: [
      { name: "Municipal Stadium", address: "1 Stadium Way, Midtown" },
      { name: "Practice Facility North", address: "3 Stadium Way, Midtown" },
    ],
  },
  {
    name: "Junior Soccer Invitational",
    sport_type: "Soccer",
    starts_at: d(7, 9, 30),
    description: "U12 and U14 age-group tournament. Six pitches running simultaneously.",
    venues: [
      { name: "Pitch 1 — Recreation Park", address: "Recreation Park, Greenfield" },
      { name: "Pitch 2 — Recreation Park", address: "Recreation Park, Greenfield" },
      { name: "Pitch 3 — Recreation Park", address: "Recreation Park, Greenfield" },
    ],
  },
  {
    name: "Three-Point Shootout",
    sport_type: "Basketball",
    starts_at: d(9, 20),
    description:
      "Skills competition — three-point contest, dunk contest, and half-court challenge.",
    venues: [{ name: "Sports Centre Hall A", address: "22 Centre Ave, Riverside" }],
  },
  {
    name: "Grand Slam Qualifier",
    sport_type: "Tennis",
    starts_at: d(11, 10),
    description:
      "Regional qualifier for national championship. Hard courts. Wildcard entries open.",
    venues: [
      { name: "National Tennis Centre — Court 1", address: "1 Tennis Plaza, Capital City" },
      { name: "National Tennis Centre — Court 2", address: "1 Tennis Plaza, Capital City" },
    ],
  },

  // ── Further out ───────────────────────────────────────────────────────────
  {
    name: "Midsummer Baseball Classic",
    sport_type: "Baseball",
    starts_at: d(21, 14),
    description: "All-star format. Fan-voted rosters. Homerun derby the evening before.",
    venues: [{ name: "Heritage Ballpark", address: "9 Heritage Dr, Oldtown" }],
  },
  {
    name: "National Volleyball League Finals",
    sport_type: "Volleyball",
    starts_at: d(28, 17, 30),
    description: "Championship finals. Top two teams from the regular season. Live streamed.",
    venues: [{ name: "Arena Central", address: "100 Main St, Capital City" }],
  },
  {
    name: "Summer Rugby Tens",
    sport_type: "Rugby",
    starts_at: d(35, 10),
    description:
      "Ten-a-side summer format. 16 clubs, group stage and knockout. Barbecue and live music.",
    venues: [
      { name: "County Grounds", address: "55 County Rd, Westshire" },
      { name: "County Grounds — Annex Pitch", address: "57 County Rd, Westshire" },
    ],
  },
  {
    name: "Season Opener — Ice League",
    sport_type: "Hockey",
    starts_at: d(42, 19),
    description:
      "Curtain-raiser for the new ice hockey season. Reigning champions vs last year's runners-up.",
    venues: [{ name: "Glacier Arena", address: "8 Frost Way, Northgate" }],
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱  Fastbreak seed script\n");

  // 1. Get or create demo user
  let userId: string;

  console.log(`👤  Looking up demo user (${DEMO_EMAIL})…`);
  const { data: listData, error: listError } = await admin.auth.admin.listUsers();
  if (listError) throw listError;

  const existing = listData.users.find((u) => u.email === DEMO_EMAIL);

  if (existing) {
    userId = existing.id;
    console.log(`    ✓ Found existing user — ${userId}`);
  } else {
    console.log("    Creating new user…");
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true, // skip email confirmation
    });
    if (createError) throw createError;
    userId = created.user.id;
    console.log(`    ✓ Created — ${userId}`);
  }

  // 2. Clear existing demo data
  console.log("\n🗑   Clearing existing demo events…");
  const { error: deleteError } = await admin.from("events").delete().eq("user_id", userId);
  if (deleteError) throw deleteError;
  console.log("    ✓ Done");

  // 3. Insert events + venues
  console.log(`\n📅  Inserting ${EVENTS.length} events…`);

  for (const ev of EVENTS) {
    const { venues, ...eventData } = ev;

    const { data: inserted, error: evErr } = await admin
      .from("events")
      .insert({ ...eventData, user_id: userId })
      .select("id")
      .single();

    if (evErr) throw evErr;

    const { error: venErr } = await admin
      .from("venues")
      .insert(venues.map((v) => ({ ...v, event_id: inserted.id })));

    if (venErr) throw venErr;

    const venueLabel = venues.length === 1 ? "1 venue" : `${venues.length} venues`;
    console.log(`    ✓ ${ev.name} (${ev.sport_type}, ${venueLabel})`);
  }

  console.log(`
✅  Seed complete!

Demo credentials
  Email:    ${DEMO_EMAIL}
  Password: ${DEMO_PASSWORD}
  URL:      ${SUPABASE_URL.replace("https://", "").split(".")[0]} (Supabase project)
`);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err.message ?? err);
  process.exit(1);
});
