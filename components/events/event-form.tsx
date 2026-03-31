"use client";

import { useRouter } from "next/navigation";
import { unstable_rethrow } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusIcon, TrashIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { eventSchema, SPORT_TYPES, type EventInput, type EventWithVenues } from "@/lib/schemas/event";
import { createEvent } from "@/actions/events/createEvent";
import { updateEvent } from "@/actions/events/updateEvent";

interface EventFormProps {
  /** Present when editing an existing event */
  event?: EventWithVenues;
}

/** Convert a JS Date / ISO string to the value expected by <input type="datetime-local"> */
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  // Format: YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const isEditing = Boolean(event);

  const form = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          name: event.name,
          sport_type: event.sport_type,
          starts_at: toDatetimeLocal(event.starts_at),
          description: event.description ?? "",
          venues: event.venues.map((v) => ({
            id: v.id,
            name: v.name,
            address: v.address ?? "",
          })),
        }
      : {
          name: "",
          sport_type: undefined,
          starts_at: "",
          description: "",
          venues: [{ name: "", address: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "venues",
  });

  async function onSubmit(data: EventInput) {
    try {
      const result = isEditing
        ? await updateEvent(event!.id, data)
        : await createEvent(data);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Event updated!" : "Event created!");
      router.push(isEditing ? "/dashboard" : `/events/${result.data.id}`);
      router.refresh();
    } catch (e) {
      unstable_rethrow(e);
      toast.error("Something went wrong. Please try again.");
      console.error(e);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* Event Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl uppercase tracking-wide">
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. City Championship Final" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sport_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPORT_TYPES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="starts_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add context about the event — format, teams, entry requirements…"
                      className="resize-none min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Venues Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-xl uppercase tracking-wide">
                Venues
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", address: "" })}
              >
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add venue
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Venue {index + 1}
                    </p>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove venue {index + 1}</span>
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`venues.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. City Stadium" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`venues.${index}.address`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address <span className="text-muted-foreground">(optional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 123 Main St, Springfield" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? "Save changes" : "Create event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
