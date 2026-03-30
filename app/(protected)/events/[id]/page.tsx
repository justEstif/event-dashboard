import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon, CalendarIcon, MapPinIcon, PencilIcon, ExternalLinkIcon } from "lucide-react";
import { ViewTransition } from "react";

import { getEventById } from "@/actions/events/getEventById";
import { requireAuthUser } from "@/lib/auth";
import { SportBadge } from "@/components/events/sport-badge";
import { DeleteEventButton } from "@/components/events/delete-event-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getCountdown(iso: string): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  const now = new Date();
  const event = new Date(iso);
  const diffMs = event.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: "Today", variant: "default" };
  if (diffDays === 1) return { label: "Tomorrow", variant: "default" };
  if (diffDays === -1) return { label: "Yesterday", variant: "secondary" };
  if (diffDays > 0) return { label: `In ${diffDays} days`, variant: "outline" };
  return { label: `${Math.abs(diffDays)} days ago`, variant: "secondary" };
}

function googleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default async function EventDetailPage({ params }: PageProps) {
  await requireAuthUser();
  const { id } = await params;

  const result = await getEventById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const event = result.data;
  const countdown = getCountdown(event.starts_at);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <ViewTransition name={`event-title-${event.id}`}>
            <h1 className="mt-2 font-heading text-3xl uppercase tracking-wide leading-tight">
              {event.name}
            </h1>
          </ViewTransition>
        </div>

        {/* Owner actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Link href={`/events/${event.id}/edit`}>
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Edit event</span>
            </Link>
          </Button>
          <DeleteEventButton eventId={event.id} eventName={event.name} />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3">
        <SportBadge sport={event.sport_type} />
        <Badge variant={countdown.variant}>{countdown.label}</Badge>
      </div>

      <Separator />

      {/* Date & Time */}
      <section className="flex flex-col gap-1">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Date & Time
        </h2>
        <div className="flex items-center gap-2 text-base">
          <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{formatFullDate(event.starts_at)}</span>
          <span className="text-muted-foreground">at {formatTime(event.starts_at)}</span>
        </div>
      </section>

      {/* Description */}
      {event.description && (
        <section className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Description
          </h2>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </section>
      )}

      {/* Venues */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Venues
        </h2>
        {event.venues.length === 0 ? (
          <p className="text-sm text-muted-foreground">No venues added.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {event.venues.map((venue) => (
              <li
                key={venue.id}
                className="flex items-start gap-3 rounded-lg border p-4 bg-muted/30"
              >
                <MapPinIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-sm">{venue.name}</span>
                  {venue.address ? (
                    <a
                      href={googleMapsUrl(venue.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                    >
                      {venue.address}
                      <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">No address</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
