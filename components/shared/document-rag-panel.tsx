"use client";

import { useState } from "react";
import { BookOpen, BrainCircuit, FileSearch, HeartPulse, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Citation = {
  documentId?: string;
  citation: string;
  documentName: string;
  score: number;
  preview: string;
};

type Scope = "patient" | "knowledge";

const lifestyleSuggestions = [
  "Track fatigue, appetite, sleep, pain, and mood before each doctor visit.",
  "Ask your oncologist before changing diet, supplements, exercise, or medicines.",
  "Prepare a caregiver note with symptoms, questions, and medication changes.",
  "Prioritize hydration, gentle movement, infection precautions, and rest when approved by the care team."
];

export function DocumentRagPanel() {
  return (
    <div className="grid gap-5">
      <AgentPanel
        scope="patient"
        icon="document"
        title="Document Analyzer Agent"
        description="Analyzes uploaded patient reports and discharge summaries after text extraction/OCR."
        defaultQuestion="Analyze my uploaded discharge summary in simple language."
        prompts={["Analyze my uploaded report", "Summarize diagnosis and treatment", "What follow-up is mentioned?"]}
      />
      <AgentPanel
        scope="knowledge"
        icon="knowledge"
        title="Cancer Knowledge Chatbot"
        description="Answers general cancer questions using the knowledge-base files stored in the data folder."
        defaultQuestion="What is cancer?"
        prompts={["What is cancer?", "Explain cancer risk factors", "What are screening methods?"]}
      />
      <LifestylePanel />
    </div>
  );
}

function AgentPanel({
  scope,
  icon,
  title,
  description,
  defaultQuestion,
  prompts
}: {
  scope: Scope;
  icon: "document" | "knowledge";
  title: string;
  description: string;
  defaultQuestion: string;
  prompts: string[];
}) {
  const [question, setQuestion] = useState(defaultQuestion);
  const [answer, setAnswer] = useState("Ask a question and this agent will retrieve from the correct document source.");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState("");
  const Icon = icon === "document" ? FileSearch : BookOpen;

  async function askAgent() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(scope === "patient" ? "Analyzing uploaded patient documents..." : "Searching cancer knowledge base...");
    setCitations([]);
    setStats("");

    try {
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, scope })
      });

      if (!response.ok) throw new Error("RAG request failed");

      const data = (await response.json()) as {
        answer: string;
        citations: Citation[];
        searchedDocuments: number;
        searchableDocuments: number;
        queuedDocuments: number;
      };

      setAnswer(data.answer);
      setCitations(data.citations);
      setStats(`${data.searchableDocuments} searchable, ${data.queuedDocuments} waiting for OCR, ${data.searchedDocuments} total in this agent.`);
    } catch {
      setAnswer("I could not retrieve an answer right now. Please check uploaded/extracted documents and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={scope === "patient" ? "border-emerald-200 bg-emerald-50/90 shadow-sm" : "border-sky-200 bg-sky-50/90 shadow-sm"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-slate-950">
          <Icon className={scope === "patient" ? "h-5 w-5 text-emerald-700" : "h-5 w-5 text-primary"} />
          {title}
        </CardTitle>
        <p className="text-sm font-semibold leading-6 text-slate-700">{description}</p>
      </CardHeader>
      <CardContent>
        <Textarea
          className={
            scope === "patient"
              ? "border-emerald-200 bg-emerald-100/70 font-semibold text-slate-950 placeholder:text-slate-500"
              : "border-sky-200 bg-sky-100/70 font-semibold text-slate-950 placeholder:text-slate-500"
          }
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <Button
              key={prompt}
              className={
                scope === "patient"
                  ? "border-emerald-200 bg-emerald-100/80 font-bold text-emerald-950 hover:bg-emerald-200"
                  : "border-sky-200 bg-sky-100/80 font-bold text-sky-950 hover:bg-sky-200"
              }
              variant="outline"
              size="sm"
              onClick={() => setQuestion(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
        <Button className="mt-3 font-extrabold shadow-sm" onClick={askAgent} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {loading ? "Retrieving..." : scope === "patient" ? "Analyze document" : "Ask knowledge base"}
        </Button>
        <div
          className={
            scope === "patient"
              ? "mt-4 rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-white p-4 shadow-sm"
              : "mt-4 rounded-lg border border-sky-200 bg-gradient-to-br from-sky-100 via-indigo-50 to-white p-4 shadow-sm"
          }
        >
          <p className="flex items-center gap-2 text-base font-extrabold text-slate-950">
            <BrainCircuit className="h-4 w-4" />
            Grounded response
          </p>
          {stats ? <p className="mt-2 text-xs font-extrabold text-emerald-800">{stats}</p> : null}
          <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-slate-800">{answer}</p>
        </div>
        {citations.length ? (
          <div className="mt-4 grid gap-2">
            <p className="text-sm font-extrabold text-slate-950">Retrieved citations</p>
            {citations.map((citation, index) => (
              <div
                key={`${citation.documentId || citation.documentName}-${citation.citation}-${index}`}
                className={
                  scope === "patient"
                    ? "rounded-lg border border-emerald-200 bg-emerald-100/80 p-3 shadow-sm"
                    : "rounded-lg border border-sky-200 bg-sky-100/80 p-3 shadow-sm"
                }
              >
                <p className="text-sm font-extrabold text-slate-950">{citation.citation}</p>
                <p className="mt-1 text-xs font-bold text-emerald-800">Score: {citation.score}</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">{citation.preview}...</p>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function LifestylePanel() {
  return (
    <Card className="border-rose-200 bg-rose-50/80 shadow-sm">
      <CardContent className="p-4">
        <p className="flex items-center gap-2 text-base font-extrabold text-slate-950">
          <HeartPulse className="h-4 w-4 text-rose-500" />
          Lifestyle suggestions
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {lifestyleSuggestions.map((item) => (
            <p key={item} className="rounded-lg border border-rose-100 bg-rose-100/70 p-3 text-sm font-semibold leading-6 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
