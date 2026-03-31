"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuthUser } from "@/lib/auth";
import { ok, err } from "@/lib/result";
import {
  getEventsSchema,
  type GetEventsInput,
  type GetEventsResult,
  type EventSummary,
  type SportType,
} from "@/lib/schemas/event";
import { withAction } from "@/lib/withAction";

const PAGE_SIZE = 20;

export const getEvents = withAction("getEvents", async (addContext, input: GetEventsInput = {}) => {
  const user = await requireAuthUser();
  addContext({ user_id: user.id });

  const parsed = getEventsSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { search, sport, page = 1 } = parsed.data;
  addContext({ search: search ?? null, sport: sport ?? null, page });

  const offset = (page - 1) * PAGE_SIZE;
  const supabase = await createClient();

  let countQuery = supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (search) countQuery = countQuery.ilike("name", `%${search}%`);
  if (sport) countQuery = countQuery.eq("sport_type", sport);

  const { count, error: countError } = await countQuery;
  if (countError) return err(countError.message);

  let dataQuery = supabase
    .from("events")
    .select("id, name, sport_type, starts_at, description")
    .eq("user_id", user.id)
    .order("starts_at", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);
  if (search) dataQuery = dataQuery.ilike("name", `%${search}%`);
  if (sport) dataQuery = dataQuery.eq("sport_type", sport);

  const { data: events, error: eventsError } = await dataQuery;
  if (eventsError) return err(eventsError.message);

  const eventIds = (events ?? []).map((e) => e.id);
  let venueCounts: Record<string, number> = {};

  if (eventIds.length > 0) {
    const { data: venues, error: venueError } = await supabase
      .from("venues")
      .select("event_id")
      .in("event_id", eventIds);

    if (venueError) return err(venueError.message);

    venueCounts = (venues ?? []).reduce<Record<string, number>>((acc, v) => {
      acc[v.event_id] = (acc[v.event_id] ?? 0) + 1;
      return acc;
    }, {});
  }

  const total = count ?? 0;
  const summaries: EventSummary[] = (events ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    sport_type: e.sport_type as SportType,
    starts_at: e.starts_at,
    description: e.description,
    venue_count: venueCounts[e.id] ?? 0,
  }));

  addContext({ result_count: summaries.length, total_count: total });

  return ok<GetEventsResult>({
    events: summaries,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  });
});
