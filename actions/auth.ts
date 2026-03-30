"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ok, err, toErrorMessage, type ActionResult } from "@/lib/result";

export async function signIn(
  email: string,
  password: string,
): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return err(error.message);
  redirect("/dashboard");
}

export async function signUp(
  email: string,
  password: string,
): Promise<ActionResult<void>> {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
      },
    });
    if (error) return err(error.message);
    return ok(undefined);
  } catch (e) {
    return err(toErrorMessage(e));
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
