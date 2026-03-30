import { z } from "zod";

export const SPORT_TYPES = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Baseball",
  "Volleyball",
  "Rugby",
  "Hockey",
  "American Football",
] as const;

export type SportType = (typeof SPORT_TYPES)[number];

export const venueSchema = z.object({
  id: z.string().uuid().optional(), // present on update, absent on create
  name: z.string().min(1, "Venue name is required"),
  address: z.string().optional(),
});

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required").max(255),
  sport_type: z.enum(SPORT_TYPES, { error: "Sport type is required" }),
  starts_at: z.string().min(1, "Date & time is required"), // ISO string from datetime-local input
  description: z.string().optional(),
  venues: z.array(venueSchema).min(1, "At least one venue is required"),
});

export type EventInput = z.infer<typeof eventSchema>;
export type VenueInput = z.infer<typeof venueSchema>;

// Shape returned from DB queries (with joined venues)
export type EventWithVenues = {
  id: string;
  user_id: string;
  name: string;
  sport_type: SportType;
  starts_at: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  venues: { id: string; name: string; address: string | null }[];
};

// Lighter shape for dashboard list (no venues array needed)
export type EventSummary = {
  id: string;
  name: string;
  sport_type: SportType;
  starts_at: string;
  description: string | null;
  venue_count: number;
};

export const getEventsSchema = z.object({
  search: z.string().optional(),
  sport: z.enum(SPORT_TYPES).optional(),
  page: z.coerce.number().int().min(1).default(1),
}).partial();

export type GetEventsInput = z.infer<typeof getEventsSchema>;

export type GetEventsResult = {
  events: EventSummary[];
  total: number;
  page: number;
  totalPages: number;
};
