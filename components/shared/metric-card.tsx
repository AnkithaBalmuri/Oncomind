import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metric } from "@/types";
import { cn } from "@/lib/utils";

const tones = {
  blue: "bg-blue-200 text-blue-900",
  emerald: "bg-emerald-200 text-emerald-900",
  indigo: "bg-indigo-200 text-indigo-900",
  rose: "bg-rose-200 text-rose-900",
  amber: "bg-amber-200 text-amber-900"
};

const cardTones = {
  blue: "border-blue-200 bg-blue-50/90",
  emerald: "border-emerald-200 bg-emerald-50/90",
  indigo: "border-indigo-200 bg-indigo-50/90",
  rose: "border-rose-200 bg-rose-50/90",
  amber: "border-amber-200 bg-amber-50/90"
};

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card className={cn("overflow-hidden shadow-sm", cardTones[metric.tone])}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-extrabold text-slate-700">{metric.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <p className="text-3xl font-extrabold tracking-normal text-slate-950">{metric.value}</p>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold", tones[metric.tone])}>
            <ArrowUpRight className="h-3.5 w-3.5" />
            {metric.change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
