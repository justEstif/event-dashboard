import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { EventForm } from "@/components/events/event-form";
import { requireAuthUser } from "@/lib/auth";

export default async function NewEventPage() {
  await requireAuthUser();

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <h1 className="mt-2 font-heading text-3xl uppercase tracking-wide">
          New Event
        </h1>
      </div>

      <EventForm />
    </div>
  );
}
