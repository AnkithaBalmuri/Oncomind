import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Source } from "@/types";

export function SourceViewer({ sources }: { sources: Source[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {sources.map((source) => (
        <Card key={source.title}>
          <CardContent className="p-5">
            <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              {source.evidence}
            </Badge>
            <h3 className="mt-4 font-semibold leading-6">{source.title}</h3>
            <p className="mt-2 text-sm text-primary">{source.journal}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{source.summary}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
