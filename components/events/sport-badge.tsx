import { Badge } from "@/components/ui/badge";
import { type SportType } from "@/lib/schemas/event";
import { cn } from "@/lib/utils";

export const SPORT_COLORS: Record<SportType, string> = {
  Soccer: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  Basketball: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  Tennis: "bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300",
  Baseball: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Volleyball: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  Rugby: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  Hockey: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
  "American Football": "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
};

export function SportBadge({ sport }: { sport: SportType }) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium shrink-0", SPORT_COLORS[sport])}
    >
      {sport}
    </Badge>
  );
}
