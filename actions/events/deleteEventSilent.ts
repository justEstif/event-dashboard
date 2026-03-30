"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuthUser } from "@/lib/auth";
import { err, ok } from "@/lib/result";

export async function deleteEventSilent(id: string) {
  if (!id) return err("Event ID is required");

  const user = await requireAuthUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return err(error.message);

  return ok(null);
}
