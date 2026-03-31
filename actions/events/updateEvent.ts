"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuthUser } from "@/lib/auth";
import { ok, err, toErrorMessage } from "@/lib/result";
import { eventSchema, type EventInput } from "@/lib/schemas/event";
import { withAction } from "@/lib/withAction";

export const updateEvent = withAction(
  "updateEvent",
  async (addContext, id: string, input: EventInput) => {
    if (!id) return err("Event ID is required");

    const user = await requireAuthUser();
    addContext({ user_id: user.id, event_id: id });

    const parsed = eventSchema.safeParse(input);
    if (!parsed.success) {
      addContext({ validation_error: parsed.error.issues[0].message });
      return err(parsed.error.issues[0].message);
    }

    const { venues, ...eventData } = parsed.data;
    addContext({ sport_type: eventData.sport_type, venue_count: venues.length });

    const supabase = await createClient();

    try {
      const { error: eventError } = await supabase
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

      const { error: deleteError } = await supabase.from("venues").delete().eq("event_id", id);
      if (deleteError) return err(deleteError.message);

      const { error: venueError } = await supabase
        .from("venues")
        .insert(venues.map((v) => ({ name: v.name, address: v.address, event_id: id })));
      if (venueError) return err(venueError.message);

      revalidatePath("/dashboard");
      revalidatePath(`/events/${id}`);
      return ok({ id });
    } catch (e) {
      return err(toErrorMessage(e));
    }
  },
);
