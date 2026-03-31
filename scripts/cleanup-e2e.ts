/**
 * E2E cleanup script — deletes any leftover [E2E] events from the demo user.
 *
 * Run automatically at the end of the CI pipeline (pass or fail) to keep
 * the demo account clean. Safe to run locally too.
 *
 * Usage:
 *   npm run e2e:cleanup
 *
 * Requires in .env.local (or CI environment):
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌  Missing env vars. Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const DEMO_EMAIL = "demo@fastbreak.app";
const E2E_PREFIX = "[E2E]";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // Find the demo user
  const { data: listData, error: listError } = await admin.auth.admin.listUsers();
  if (listError) throw listError;

  const demoUser = listData.users.find((u) => u.email === DEMO_EMAIL);
  if (!demoUser) {
    console.log("⚠️   Demo user not found — nothing to clean up.");
    return;
  }

  // Delete all [E2E] events for the demo user
  const { data: deleted, error } = await admin
    .from("events")
    .delete()
    .eq("user_id", demoUser.id)
    .ilike("name", `${E2E_PREFIX}%`)
    .select("id, name");

  if (error) throw error;

  if (!deleted || deleted.length === 0) {
    console.log("✅  No E2E test events found — nothing to clean up.");
  } else {
    console.log(`🧹  Deleted ${deleted.length} E2E test event(s):`);
    deleted.forEach((e) => console.log(`    - ${e.name}`));
  }
}

main().catch((err) => {
  console.error("❌  Cleanup failed:", err.message ?? err);
  process.exit(1);
});
