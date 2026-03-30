"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/actions/events/deleteEvent";

interface DeleteEventButtonProps {
  eventId: string;
  eventName: string;
}

export function DeleteEventButton({ eventId, eventName }: DeleteEventButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEvent(eventId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Event deleted");
      setOpen(false);
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0 mt-7">
          <Trash2Icon className="h-4 w-4" />
          <span className="sr-only">Delete event</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete event?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">&ldquo;{eventName}&rdquo;</strong> and all its venues will be permanently deleted. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); handleDelete(); }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2Icon className="h-3.5 w-3.5 mr-2 animate-spin" />}
            Delete event
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
