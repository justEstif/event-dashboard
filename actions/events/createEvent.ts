"use server";

import { createClient } from "@/lib/supabase/server";
import { withAuth } from "@/lib/auth";
import { ok, err, toErrorMessage } from "@/lib/result";
import { eventSchema, type EventInput, type EventWithVenues } from "@/lib/schemas/event";

export const createEvent = withAuth(async (user, input: EventInput) => {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { venues, ...eventData } = parsed.data;
  const supabase = await createClient();

  try {
    // Insert event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({ ...eventData, user_id: user.id })
      .select()
      .single();

    if (eventError) return err(eventError.message);

    // Insert venues
    const { data: insertedVenues, error: venueError } = await supabase
      .from("venues")
      .insert(venues.map((v) => ({ ...v, event_id: event.id })))
      .select();

    if (venueError) return err(venueError.message);

    return ok({ ...event, venues: insertedVenues } as EventWithVenues);
  } catch (e) {
    return err(toErrorMessage(e));
  }
});
