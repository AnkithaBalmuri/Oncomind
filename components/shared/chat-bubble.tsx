"use client";

import ReactMarkdown from "react-markdown";
import { CitationCard } from "@/components/shared/citation-card";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const assistant = message.role === "assistant";

  return (
    <div className={cn("flex", assistant ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-3xl rounded-lg border px-4 py-3 shadow-sm",
          assistant ? "bg-card" : "bg-primary text-primary-foreground"
        )}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {message.confidence ? (
          <div className="mt-3">
            <ConfidenceBadge score={message.confidence} />
          </div>
        ) : null}
        {message.citations?.length ? (
          <div className="mt-3 grid gap-2">
            {message.citations.map((citation) => (
              <CitationCard key={citation.title} citation={citation} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
