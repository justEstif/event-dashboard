import Link from "next/link";
import { ViewTransition } from "react";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SportBadge } from "./sport-badge";
import { type EventSummary } from "@/lib/schemas/event";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventCard({ event }: { event: EventSummary }) {
  return (
    <Link href={`/events/${event.id}`} className="group block">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <ViewTransition name={`event-title-${event.id}`}>
              <h3 className="font-bold leading-snug group-hover:underline line-clamp-2" style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
                {event.name}
              </h3>
            </ViewTransition>
            <SportBadge sport={event.sport_type} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDate(event.starts_at)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
            <span>
              {event.venue_count === 0
                ? "No venues"
                : event.venue_count === 1
                  ? "1 venue"
                  : `${event.venue_count} venues`}
            </span>
          </div>
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {event.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
      </CardContent>
    </Card>
  );
}
