"use client";

import { EventCard } from "./event-card";
import { type EventSummary } from "@/lib/schemas/event";

interface EventListProps {
  events: EventSummary[];
}

export function EventList({ events }: EventListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
