import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { EventForm } from "@/components/events/event-form";
import { DeleteEventButton } from "@/components/events/delete-event-button";
import { getEventById } from "@/actions/events/getEventById";
import { requireAuthUser } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  await requireAuthUser();
  const { id } = await params;

  const result = await getEventById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const event = result.data;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <h1 className="mt-2 font-heading text-3xl uppercase tracking-wide line-clamp-1">
            {event.name}
          </h1>
        </div>
        <DeleteEventButton eventId={id} eventName={event.name} />
      </div>

      <EventForm event={event} />
    </div>
  );
}
