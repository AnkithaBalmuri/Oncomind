"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { chatService } from "@/services/chat-service";
import { useTranslation } from "@/lib/translations";
import {
  Activity,
  AlertTriangle,
  Beaker,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileSearch,
  FlaskConical,
  Loader2,
  Microscope,
  Stethoscope,
  Target
} from "lucide-react";

const MOCK_ANALYSIS = {
  cancerType: "Breast Carcinoma",
  subtype: "Invasive Ductal Carcinoma (IDC)",
  stage: "Stage IIB",
  grade: "Grade 2 (Intermediate)",
  biomarkers: ["ER+", "PR low", "HER2−", "Ki-67 32%", "PIK3CA pending"],
  tumorMarkers: ["CA 15-3 elevated", "CEA normal"],
  riskLevel: "Moderate",
  keyFindings: [
    "Tumor size 3.1 cm with suspicious axillary lymph node involvement",
    "No distant metastasis detected in current imaging summary",
    "Hormone receptor positivity supports endocrine therapy consideration",
    "Ki-67 at 32% indicates intermediate proliferative activity"
  ],
  recommendedTests: ["HER2 FISH confirmation", "Oncotype DX score", "BRCA1/2 germline testing", "Full body PET-CT staging"],
  treatmentIndicators: ["Endocrine therapy eligible", "Chemotherapy consideration based on Ki-67", "CDK4/6 inhibitor evaluation recommended"],
  relatedReports: ["Imaging summary – May 2026", "Genomics panel – March 2026"],
  relatedPapers: ["NCCN Breast Cancer Guidelines 2026", "ASCO Biomarker Testing Recommendations 2025"],
  relatedTrials: ["NCT-OM-1042 – HR+ Breast Cancer Targeted Therapy", "NCT-OM-3301 – TNBC Neoadjuvant Optimization"]
};

const timelineSteps = [
  { label: "Diagnosis", icon: Stethoscope, desc: "Invasive Ductal Carcinoma, Stage IIB confirmed" },
  { label: "Testing", icon: Microscope, desc: "Pathology, imaging, and genomic profiling completed" },
  { label: "Biomarkers", icon: Beaker, desc: "ER+, PR low, HER2−, Ki-67 32% identified" },
  { label: "Treatment Recommendations", icon: Target, desc: "Endocrine therapy + CDK4/6 inhibitor evaluation" },
  { label: "Follow-Up", icon: Activity, desc: "Oncotype DX, BRCA testing, PET-CT recommended" }
];

const riskColors: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-rose-50 text-rose-700 border-rose-200"
};

export default function AnalyzerPage() {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [useAI, setUseAI] = useState(false);

  const getTimelineLabel = (label: string) => {
    if (label === "Diagnosis") return t("diagnosis") || "Diagnosis";
    if (label === "Testing") return t("labTest") || "Testing";
    if (label === "Biomarkers") return t("biomarkers") || "Biomarkers";
    if (label === "Treatment Recommendations") return t("treatmentOptions") || "Treatment";
    if (label === "Follow-Up") return t("trackerTitle") || "Follow-Up";
    return label;
  };

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await chatService.sendMessage(
          "Summarize the cancer report and list stage, biomarkers, risk level, and findings.",
          "patient"
        );
        setAnswer(response.content);
        setUseAI(true);
      } catch {
        setUseAI(false);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, []);

  const data = MOCK_ANALYSIS;

  return (
    <>
      <PageHeader
        eyebrow={t("analyzerEyebrow")}
        title={t("analyzerTitle")}
        description={t("analyzerDesc")}
      />

      {loading ? (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-semibold">{t("analyzingDocs")}</span>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Extraction + AI */}
          <div className="flex flex-col gap-5">
            {/* Core Extraction */}
            <Card className="clinical-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-black">
                  <FileSearch className="h-4 w-4 text-primary" />
                  {t("extractedData")}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label={t("cancerType")} value={data.cancerType} />
                <Field label={t("subtype")} value={data.subtype} />
                <Field label={t("stage")} value={data.stage} highlight="blue" />
                <Field label={t("grade")} value={data.grade} />
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("riskLevel")}</p>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold ${riskColors[data.riskLevel] ?? "bg-muted text-muted-foreground border-border"}`}>
                    <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                    {data.riskLevel} Risk
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("biomarkers")}</p>
                  <div className="flex flex-wrap gap-2">
                    {data.biomarkers.map((b) => (
                      <Badge key={b} className="border-blue-200 bg-blue-50 text-blue-700">{b}</Badge>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("tumorMarkers")}</p>
                  <div className="flex flex-wrap gap-2">
                    {data.tumorMarkers.map((m) => (
                      <Badge key={m} variant="outline">{m}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Findings */}
            <Card className="clinical-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-black">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  {t("keyFindings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.keyFindings.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <p className="text-sm font-medium text-foreground">{f}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Tests + Treatment Indicators */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="clinical-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-black">
                    <Microscope className="h-4 w-4 text-violet-600" />
                    {t("recommendedTests")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {data.recommendedTests.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ChevronRight className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                      {t}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="clinical-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-black">
                    <Target className="h-4 w-4 text-amber-600" />
                    {t("treatmentIndicators")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {data.treatmentIndicators.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ChevronRight className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      {t}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AI Full Analysis */}
            {useAI && answer && (
              <Card className="clinical-card border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-black">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    {t("aiAnalysis")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-foreground">{answer}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Timeline + Related */}
          <div className="flex flex-col gap-5">
            {/* Medical Timeline */}
            <Card className="clinical-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-black">
                  <Activity className="h-4 w-4 text-primary" />
                  {t("timelineLabel")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-10">
                  <div className="timeline-line" />
                  <div className="space-y-6">
                    {timelineSteps.map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <div key={i} className="relative">
                          <div className="absolute -left-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/8">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="text-sm font-black text-foreground">{getTimelineLabel(step.label)}</p>
                            <p className="mt-0.5 text-xs font-medium text-muted-foreground">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Documents */}
            <Card className="clinical-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-black">
                  <BookOpen className="h-4 w-4 text-accent" />
                  {t("relatedDocuments")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("similarReports")}</p>
                  {data.relatedReports.map((r) => (
                    <div key={r} className="mb-1.5 flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 text-sm font-medium text-foreground">
                      <FileSearch className="h-3.5 w-3.5 text-primary shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("relatedPapers")}</p>
                  {data.relatedPapers.map((p) => (
                    <div key={p} className="mb-1.5 flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 text-sm font-medium text-foreground">
                      <BookOpen className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("relevantTrials")}</p>
                  {data.relatedTrials.map((t) => (
                    <div key={t} className="mb-1.5 flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 text-sm font-medium text-foreground">
                      <Stethoscope className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold ${highlight === "blue" ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
