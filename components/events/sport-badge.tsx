import { Badge } from "@/components/ui/badge";
import { type SportType } from "@/lib/schemas/event";
import { cn } from "@/lib/utils";

const SPORT_COLORS: Record<SportType, string> = {
  Soccer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Basketball: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Tennis: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Baseball: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Volleyball: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Rugby: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-400",
  Hockey: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  "American Football": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

export function SportBadge({ sport }: { sport: SportType }) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", SPORT_COLORS[sport])}
    >
      {sport}
    </Badge>
  );
}
