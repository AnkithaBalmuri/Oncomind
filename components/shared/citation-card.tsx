import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import type { Citation } from "@/types";

export function CitationCard({ citation }: { citation: Citation }) {
  return (
    <Card className="border-primary/15 bg-primary/5">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="font-semibold">{citation.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {citation.source} - {citation.year}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ConfidenceBadge score={citation.relevance} />
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
