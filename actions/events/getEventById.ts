"use server";

import { createClient } from "@/lib/supabase/server";
import { withAuth } from "@/lib/auth";
import { ok, err } from "@/lib/result";
import { type EventWithVenues } from "@/lib/schemas/event";

export const getEventById = withAuth(async (user, id: string) => {
  if (!id) return err("Event ID is required");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*, venues(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return err("Event not found");
    return err(error.message);
  }

  return ok(data as EventWithVenues);
});
