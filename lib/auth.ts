import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/result";

/**
 * withAuth
 *
 * Wraps a server action to verify the session before any DB work.
 * If unauthenticated, redirects to /auth/login (safe in Server Components /
 * Server Actions — redirect() throws internally).
 *
 * Usage:
 *   export const createEvent = withAuth(async (user, input: CreateEventInput) => {
 *     // user is the verified Supabase User — guaranteed non-null here
 *     ...
 *     return ok(event)
 *   })
 */
export function withAuth<TArgs extends unknown[], TReturn>(
  fn: (user: User, ...args: TArgs) => Promise<ActionResult<TReturn>>,
) {
  return async (...args: TArgs): Promise<ActionResult<TReturn>> => {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // In a Server Action context redirect() is safe.
      // In a test context this will throw — catch it in tests if needed.
      redirect("/auth/login");
    }

    return fn(user, ...args);
  };
}

/**
 * getAuthUser
 *
 * Lightweight helper for Server Components that just need the current user
 * without wrapping a full action. Returns null if unauthenticated.
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * requireAuthUser
 *
 * Like getAuthUser but redirects to /auth/login if no session.
 * Use at the top of protected Server Component pages.
 */
export async function requireAuthUser(): Promise<User> {
  const user = await getAuthUser();
  if (!user) redirect("/auth/login");
  return user;
}
