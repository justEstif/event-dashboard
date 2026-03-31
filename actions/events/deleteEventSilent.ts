"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuthUser } from "@/lib/auth";
import { err, ok } from "@/lib/result";
import { withAction } from "@/lib/withAction";

export const deleteEventSilent = withAction("deleteEventSilent", async (addContext, id: string) => {
  if (!id) return err("Event ID is required");

  const user = await requireAuthUser();
  addContext({ user_id: user.id, event_id: id });

  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", id).eq("user_id", user.id);

  if (error) return err(error.message);

  return ok(null);
});
