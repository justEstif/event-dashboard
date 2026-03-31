"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuthUser } from "@/lib/auth";
import { err, toErrorMessage } from "@/lib/result";
import { eventSchema, type EventInput } from "@/lib/schemas/event";

export async function updateEvent(id: string, input: EventInput) {
  if (!id) return err("Event ID is required");

  const user = await requireAuthUser();

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { venues, ...eventData } = parsed.data;
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
    redirect(`/events/${id}`);
  } catch (e) {
    return err(toErrorMessage(e));
  }
}
