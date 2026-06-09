import { Badge } from "@/components/ui/badge";
import { cn, formatPercent } from "@/lib/utils";

export function ConfidenceBadge({ score }: { score: number }) {
  const tone =
    score >= 90
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
      : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300";

  return <Badge className={cn(tone)}>Confidence {formatPercent(score)}</Badge>;
}
