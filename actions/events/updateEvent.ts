"use server";

import { createClient } from "@/lib/supabase/server";
import { withAuth } from "@/lib/auth";
import { ok, err, toErrorMessage } from "@/lib/result";
import { eventSchema, type EventInput, type EventWithVenues } from "@/lib/schemas/event";

export const updateEvent = withAuth(
  async (user, id: string, input: EventInput) => {
    if (!id) return err("Event ID is required");

    const parsed = eventSchema.safeParse(input);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const { venues, ...eventData } = parsed.data;
    const supabase = await createClient();

    try {
      // Verify ownership + update event fields
      const { data: event, error: eventError } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (eventError) {
        if (eventError.code === "PGRST116") return err("Event not found");
        return err(eventError.message);
      }

      // Replace venues: delete all existing, insert new set
      const { error: deleteError } = await supabase
        .from("venues")
        .delete()
        .eq("event_id", id);

      if (deleteError) return err(deleteError.message);

      const { data: insertedVenues, error: venueError } = await supabase
        .from("venues")
        .insert(venues.map((v) => ({ name: v.name, address: v.address, event_id: id })))
        .select();

      if (venueError) return err(venueError.message);

      return ok({ ...event, venues: insertedVenues } as EventWithVenues);
    } catch (e) {
      return err(toErrorMessage(e));
    }
  },
);
