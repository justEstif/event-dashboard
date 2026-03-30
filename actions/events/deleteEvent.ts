"use server";

import { createClient } from "@/lib/supabase/server";
import { withAuth } from "@/lib/auth";
import { ok, err } from "@/lib/result";

export const deleteEvent = withAuth(async (user, id: string) => {
  if (!id) return err("Event ID is required");

  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return err(error.message);

  return ok(undefined);
});
