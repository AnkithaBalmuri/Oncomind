"use client";
import { useState } from "react";
import { BookOpen, ChevronRight, Loader2, Scale, Search, Star } from "lucide-react";
import { SourceViewer } from "@/components/shared/source-viewer";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { chatService } from "@/services/chat-service";

type Paper = {
  title: string;
  journal: string;
  year: number;
  evidenceLevel: "Strong" | "Moderate" | "Emerging";
  keyFindings: string;
  clinicalRelevance: string;
  citations: number;
};

const MOCK_PAPERS: Paper[] = [
  {
    title: "CDK4/6 inhibitors in HR-positive metastatic breast cancer: a meta-analysis",
    journal: "The Lancet Oncology",
    year: 2025,
    evidenceLevel: "Strong",
    keyFindings: "Palbociclib + letrozole significantly extends PFS vs. letrozole alone (median 24.8 vs 14.5 months).",
    clinicalRelevance: "First-line standard of care for HR+/HER2− metastatic breast cancer.",
    citations: 847
  },
  {
    title: "PD-L1 expression and immunotherapy response in lung cancer",
    journal: "New England Journal of Medicine",
    year: 2024,
    evidenceLevel: "Strong",
    keyFindings: "Pembrolizumab monotherapy superior to chemotherapy in PD-L1 ≥50% NSCLC (ORR 45% vs 28%).",
    clinicalRelevance: "Supports PD-L1 testing as standard before first-line lung cancer therapy.",
    citations: 1203
  },
  {
    title: "BRCA mutation prevalence in triple-negative breast cancer under 50",
    journal: "Journal of Clinical Oncology",
    year: 2024,
    evidenceLevel: "Moderate",
    keyFindings: "Germline BRCA1/2 mutations found in ~15% of TNBC patients under 50 years.",
    clinicalRelevance: "Supports routine germline testing for TNBC and informs PARP inhibitor eligibility.",
    citations: 312
  },
  {
    title: "CAR-T cell therapy outcomes in relapsed diffuse large B-cell lymphoma",
    journal: "Nature Medicine",
    year: 2025,
    evidenceLevel: "Moderate",
    keyFindings: "Axicabtagene ciloleucel achieves 58% complete response in 3rd-line DLBCL.",
    clinicalRelevance: "Viable curative option post 2 prior lines; eligibility requires ECOG ≤1.",
    citations: 421
  },
  {
    title: "AI-guided molecular matching in oncology clinical trials",
    journal: "Nature Medicine",
    year: 2025,
    evidenceLevel: "Emerging",
    keyFindings: "NLP-based biomarker matching increases trial enrollment efficiency by 34%.",
    clinicalRelevance: "Supports AI tools in precision oncology workflows; requires validation.",
    citations: 89
  }
];

const evidenceColors: Record<string, string> = {
  Strong: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Moderate: "bg-blue-50 text-blue-700 border-blue-200",
  Emerging: "bg-amber-50 text-amber-700 border-amber-200"
};

export default function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string>("");
  const [citations, setCitations] = useState<Array<{ documentName: string; citation: string; preview: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [compareA, setCompareA] = useState<number | null>(null);
  const [compareB, setCompareB] = useState<number | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  async function handleSearch() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await chatService.sendMessage(question, "knowledge");
      // @ts-ignore
      setAnswer(response.content);
      // @ts-ignore
      if (response.citations) {
        // @ts-ignore
        setCitations(response.citations.map((c: any) => ({ documentName: c.title || c.documentName, citation: c.citation, preview: c.preview })));
      } else {
        setCitations([]);
      }
    } catch {
      setAnswer("Error fetching research results.");
      setCitations([]);
    } finally {
      setLoading(false);
    }
  }

  const paperA = compareA !== null ? MOCK_PAPERS[compareA] : null;
  const paperB = compareB !== null ? MOCK_PAPERS[compareB] : null;

  return (
    <>
      <PageHeader
        eyebrow="Cancer Research RAG"
        title="Research Assistant"
        description="Ask cancer research questions, retrieve medical evidence, compare papers by evidence strength, and turn complex studies into plain-language answers."
      />

      {/* Search */}
      <Card className="clinical-card mb-6">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <Input
            placeholder="Ask a research question about cancer therapies, biomarkers, or clinical guidelines..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={loading}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading} className="gap-2 font-bold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Searching..." : "Search"}
          </Button>
        </CardContent>
      </Card>

      {/* AI Answer */}
      {answer && (
        <Card className="clinical-card mb-6 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-black">
              <BookOpen className="h-4 w-4 text-primary" />
              AI Research Answer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-foreground">{answer}</p>
            {citations.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Sources</p>
                {citations.map((c, i) => (
                  <div key={i} className="rounded-lg border bg-muted/30 px-3 py-2">
                    <p className="text-sm font-bold text-foreground">{c.documentName}</p>
                    <p className="text-xs text-muted-foreground">{c.preview}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Related Papers */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground">Related Evidence</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 font-semibold"
            onClick={() => setShowCompare(!showCompare)}
          >
            <Scale className="h-4 w-4" />
            {showCompare ? "Hide Comparison" : "Compare Papers"}
          </Button>
        </div>

        {/* Evidence Comparison */}
        {showCompare && (
          <Card className="clinical-card mb-4 border-violet-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Scale className="h-4 w-4 text-violet-600" />
                Evidence Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Paper A</p>
                  <select
                    className="w-full rounded-lg border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                    value={compareA ?? ""}
                    onChange={(e) => setCompareA(e.target.value === "" ? null : Number(e.target.value))}
                  >
                    <option value="">Select a paper...</option>
                    {MOCK_PAPERS.map((p, i) => <option key={i} value={i}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Paper B</p>
                  <select
                    className="w-full rounded-lg border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                    value={compareB ?? ""}
                    onChange={(e) => setCompareB(e.target.value === "" ? null : Number(e.target.value))}
                  >
                    <option value="">Select a paper...</option>
                    {MOCK_PAPERS.map((p, i) => <option key={i} value={i}>{p.title}</option>)}
                  </select>
                </div>
              </div>
              {paperA && paperB && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[paperA, paperB].map((paper, idx) => (
                    <div key={idx} className={`rounded-xl border p-4 ${idx === 0 ? "border-blue-200 bg-blue-50/40" : "border-violet-200 bg-violet-50/40"}`}>
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Paper {idx === 0 ? "A" : "B"}</p>
                      <p className="text-sm font-black text-foreground leading-5">{paper.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{paper.journal} · {paper.year}</p>
                      <Badge className={`mt-2 text-xs ${evidenceColors[paper.evidenceLevel]}`}>{paper.evidenceLevel}</Badge>
                      <p className="mt-2 text-xs font-medium text-foreground leading-5">{paper.keyFindings}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Paper Cards */}
        <div className="grid gap-4">
          {MOCK_PAPERS.map((paper, i) => (
            <Card key={i} className="clinical-card group hover:-translate-y-0.5 transition-transform duration-150">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className={`text-xs border ${evidenceColors[paper.evidenceLevel]}`}>
                        {paper.evidenceLevel} Evidence
                      </Badge>
                      <span className="text-xs font-semibold text-muted-foreground">{paper.journal}</span>
                      <span className="text-xs text-muted-foreground">· {paper.year}</span>
                    </div>
                    <h3 className="text-base font-black text-foreground leading-5">{paper.title}</h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <p className="text-sm font-medium text-foreground">{paper.keyFindings}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        <p className="text-sm font-medium text-muted-foreground">{paper.clinicalRelevance}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span className="text-xs font-bold text-muted-foreground">{paper.citations} citations</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => { setCompareA(i); setShowCompare(true); }}
                  >
                    Compare as A
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => { setCompareB(i); setShowCompare(true); }}
                  >
                    Compare as B
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <SourceViewer sources={[]} />
    </>
  );
}
