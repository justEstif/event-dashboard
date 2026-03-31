import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarXIcon } from "lucide-react";

export default function EventNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="flex flex-col items-center gap-3">
        <CalendarXIcon className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Event not found</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          This event doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
