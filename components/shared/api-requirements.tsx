import { KeyRound, Mic, Search, ShieldCheck, UploadCloud, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const requirements: Array<[string, string, LucideIcon]> = [
  ["Authentication", "Clerk keys: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY.", ShieldCheck],
  ["RAG chat", "LLM API key plus vector database for uploaded report retrieval.", Search],
  ["Documents", "File storage, OCR/parser service for PDF/DOCX/TXT, and upload API.", UploadCloud],
  ["Voice", "Speech-to-text and text-to-speech API, or browser Web Speech fallback.", Mic],
  ["Trials/research", "ClinicalTrials.gov, PubMed/Semantic Scholar, or your own curated oncology index.", KeyRound]
];

export function ApiRequirements() {
  return (
    <Card className="clinical-card">
      <CardContent className="p-5">
        <h2 className="text-2xl font-black text-black">What APIs are required to make every nav item real?</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {requirements.map(([title, text, Icon]) => (
            <div key={title} className="rounded-md border bg-white/68 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-black text-black">{title}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-black">{text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
