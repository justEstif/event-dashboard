"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuthUser } from "@/lib/auth";
import { err, toErrorMessage } from "@/lib/result";
import { eventSchema, type EventInput } from "@/lib/schemas/event";
import { withAction } from "@/lib/withAction";

export const createEvent = withAction("createEvent", async (addContext, input: EventInput) => {
  const user = await requireAuthUser();
  addContext({ user_id: user.id });

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    addContext({ validation_error: parsed.error.issues[0].message });
    return err(parsed.error.issues[0].message);
  }

  const { venues, ...eventData } = parsed.data;
  addContext({ sport_type: eventData.sport_type, venue_count: venues.length });

  const supabase = await createClient();

  try {
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({ ...eventData, user_id: user.id })
      .select()
      .single();

    if (eventError) return err(eventError.message);

    addContext({ event_id: event.id });

    const { error: venueError } = await supabase
      .from("venues")
      .insert(venues.map((v) => ({ ...v, event_id: event.id })))
      .select();

    if (venueError) return err(venueError.message);

    redirect(`/events/${event.id}`);
  } catch (e) {
    return err(toErrorMessage(e));
  }
});
