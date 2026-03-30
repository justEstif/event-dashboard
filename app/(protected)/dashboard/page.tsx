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

function EmptyState({ input }: { input: GetEventsInput }) {
  const isFiltered = !!(input.search || input.sport);

  if (isFiltered) {
    return (
      <div className="relative flex flex-col items-center justify-center gap-5 py-28 text-center overflow-hidden">
        {/* Faint decorative background numeral */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-[18rem] font-black leading-none text-foreground/[0.03]"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          0
        </span>

        <div className="relative z-10 flex flex-col items-center gap-5">
          <div>
            <h2
              className="text-5xl font-black uppercase tracking-tight text-foreground"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              No results found
            </h2>
            <p className="mt-2 text-muted-foreground text-base">
              Nothing matched{' '}
              {input.search && (
                <span>
                  &ldquo;<span className="font-medium text-foreground">{input.search}</span>&rdquo;
                </span>
              )}
              {input.search && input.sport && ' in '}
              {input.sport && (
                <span className="font-medium text-foreground capitalize">{input.sport}</span>
              )}
              . Try a different search or filter.
            </p>
          </div>

          <Button variant="outline" asChild className="cursor-pointer">
            <Link href="/dashboard">Clear filters</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 py-28 text-center overflow-hidden">
      {/* Faint decorative stadium emoji */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-[14rem] leading-none opacity-[0.05]"
      >
        🏟️
      </span>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Accent stripe */}
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Fastbreak
          </span>
          <div className="h-px w-12 bg-primary" />
        </div>

        <div>
          <h2
            className="text-6xl font-black uppercase tracking-tight text-foreground leading-none"
            style={{ fontFamily: 'var(--font-barlow-condensed)' }}
          >
            The pitch
            <br />
            <span className="text-primary">is empty</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-xs mx-auto">
            No events on the schedule yet. Create your first one and get the season started.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="cursor-pointer px-8 font-semibold uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          <Link href="/events/new">
            <CalendarPlusIcon className="h-5 w-5 mr-2" />
            Schedule first event
          </Link>
        </Button>
      </div>
    </div>
  );
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
    return <EmptyState input={input} />;
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
        <h1
          className="text-3xl font-black uppercase tracking-tight leading-none"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          Events
        </h1>
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
