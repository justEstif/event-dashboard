"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuthUser } from "@/lib/auth";
import { ok, err } from "@/lib/result";
import { type EventWithVenues } from "@/lib/schemas/event";
import { withAction } from "@/lib/withAction";

export const getEventById = withAction("getEventById", async (addContext, id: string) => {
  if (!id) return err("Event ID is required");

  const user = await requireAuthUser();
  addContext({ user_id: user.id, event_id: id });

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

  addContext({ venue_count: (data as EventWithVenues).venues?.length ?? 0 });

  return ok(data as EventWithVenues);
});
