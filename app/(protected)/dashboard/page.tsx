import Link from "next/link";
import { Suspense } from "react";
import { CalendarPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard, EventCardSkeleton } from "@/components/events/event-card";
import { DashboardFilters } from "@/components/events/dashboard-filters";
import { Pagination } from "@/components/events/pagination";
import { getEvents } from "@/actions/events/getEvents";
import { requireAuthUser } from "@/lib/auth";
import { type GetEventsInput, type SportType } from "@/lib/schemas/event";

interface PageProps {
  searchParams: Promise<{ search?: string; sport?: string; page?: string }>;
}

async function EventGrid({ input }: { input: GetEventsInput }) {
  const result = await getEvents(input);

  if (!result.success) {
    return (
      <p className="text-sm text-destructive">
        Failed to load events: {result.error}
      </p>
    );
  }

  const { events, page, totalPages } = result.data;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="rounded-full bg-muted p-4">
          <CalendarPlusIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">No events yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first event to get started.
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new">Create event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

export default async function DashboardPage({ searchParams }: PageProps) {
  await requireAuthUser();
  const params = await searchParams;

  const input: GetEventsInput = {
    search: params.search,
    sport: params.sport as SportType | undefined,
    page: params.page ? Number(params.page) : 1,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/events/new">
            <CalendarPlusIcon className="h-4 w-4 mr-2" />
            New event
          </Link>
        </Button>
      </div>

      {/* Filters — client component, needs Suspense for useSearchParams */}
      <Suspense>
        <DashboardFilters />
      </Suspense>

      {/* Event grid — Suspense gives us loading.tsx skeleton */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <EventGrid input={input} />
      </Suspense>
    </div>
  );
}
