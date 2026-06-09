"use client";

import { useState } from "react";
import { CheckSquare, ChevronDown, ChevronUp, Printer, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "@/lib/translations";
import { visitPrepTranslations } from "@/lib/visit-prep-translations";

type Category = {
  id: string;
  label: string;
  color: string;
  questions: string[];
};

const CATEGORIES: Category[] = [
  {
    id: "diagnosis",
    label: "About My Diagnosis",
    color: "border-blue-200 bg-blue-50/40",
    questions: [
      "What is the exact name and type of my cancer?",
      "What does my pathology report say in simple terms?",
      "Is this cancer slow-growing or fast-growing?",
      "Has it spread anywhere from where it started?"
    ]
  },
  {
    id: "stage",
    label: "About My Stage",
    color: "border-indigo-200 bg-indigo-50/40",
    questions: [
      "What stage is my cancer and what does that mean?",
      "How was the stage determined — imaging, biopsy, or surgery?",
      "Does my stage affect which treatments I can receive?",
      "Is there any chance the staging could change after more tests?"
    ]
  },
  {
    id: "treatment",
    label: "About Treatment Options",
    color: "border-violet-200 bg-violet-50/40",
    questions: [
      "What are all my treatment options at this stage?",
      "What is the goal of treatment — cure, control, or comfort?",
      "Which treatment do you recommend and why?",
      "What happens if I choose not to treat right now?"
    ]
  },
  {
    id: "sideeffects",
    label: "About Side Effects",
    color: "border-rose-200 bg-rose-50/40",
    questions: [
      "What side effects should I expect from this treatment?",
      "Are there side effects that require immediate medical attention?",
      "How will this treatment affect my daily life and work?",
      "What can I do to manage or reduce side effects?"
    ]
  },
  {
    id: "surgery",
    label: "About Surgery",
    color: "border-amber-200 bg-amber-50/40",
    questions: [
      "Am I a candidate for surgery? Why or why not?",
      "What will be removed during surgery and what will remain?",
      "What is the recovery time and what restrictions will I have?",
      "Are there less invasive surgical options available?"
    ]
  },
  {
    id: "chemo",
    label: "About Chemotherapy",
    color: "border-orange-200 bg-orange-50/40",
    questions: [
      "Which chemotherapy drugs are recommended for my cancer type?",
      "How many cycles of chemotherapy will I need?",
      "Will I lose my hair, and will it grow back?",
      "Can I work and maintain normal activities during chemotherapy?"
    ]
  },
  {
    id: "radiation",
    label: "About Radiation",
    color: "border-yellow-200 bg-yellow-50/40",
    questions: [
      "Is radiation therapy recommended as part of my treatment?",
      "How many radiation sessions will I need and over what time period?",
      "What are the short-term and long-term risks of radiation?",
      "Will radiation affect nearby healthy organs or tissues?"
    ]
  },
  {
    id: "immunotherapy",
    label: "About Immunotherapy",
    color: "border-teal-200 bg-teal-50/40",
    questions: [
      "Is immunotherapy an option for my cancer type and biomarker profile?",
      "What immune-related side effects should I watch for?",
      "How will we know if immunotherapy is working?",
      "How is immunotherapy different from chemotherapy in terms of how I might feel?"
    ]
  },
  {
    id: "targeted",
    label: "About Targeted Therapy",
    color: "border-cyan-200 bg-cyan-50/40",
    questions: [
      "Are there targeted therapies approved for my specific mutation or biomarker?",
      "Do I need genetic testing to determine if I qualify for targeted therapy?",
      "What happens if my cancer develops resistance to a targeted therapy?",
      "How is targeted therapy administered — oral pills or IV infusion?"
    ]
  },
  {
    id: "trials",
    label: "About Clinical Trials",
    color: "border-emerald-200 bg-emerald-50/40",
    questions: [
      "Am I eligible for any relevant clinical trials?",
      "What are the potential benefits and risks of participating in a trial?",
      "Will I receive experimental treatment or standard care in a trial?",
      "How will participating in a trial affect my regular treatment schedule?"
    ]
  },
  {
    id: "prognosis",
    label: "About Prognosis",
    color: "border-slate-200 bg-slate-50/40",
    questions: [
      "What is the typical outlook for someone with my cancer type and stage?",
      "What factors affect my prognosis most significantly?",
      "Are survival statistics meaningful for my specific situation?",
      "How often does this type of cancer come back after treatment?"
    ]
  },
  {
    id: "followup",
    label: "About Follow-Up Care",
    color: "border-blue-200 bg-blue-50/40",
    questions: [
      "How often will I need follow-up appointments and scans?",
      "What tests will be done at follow-up visits to check for recurrence?",
      "How will I know if the cancer has come back?",
      "When can I return to full normal activities after treatment ends?"
    ]
  },
  {
    id: "lifestyle",
    label: "About Lifestyle",
    color: "border-green-200 bg-green-50/40",
    questions: [
      "Are there dietary changes that could support my treatment or recovery?",
      "What types and amounts of exercise are safe during treatment?",
      "Should I avoid alcohol or any supplements during treatment?",
      "Are there any environmental or occupational exposures I should avoid?"
    ]
  },
  {
    id: "nutrition",
    label: "About Nutrition",
    color: "border-lime-200 bg-lime-50/40",
    questions: [
      "Should I meet with an oncology dietitian during treatment?",
      "What foods can help manage nausea, fatigue, or appetite loss?",
      "Are there foods I should completely avoid during chemotherapy or radiation?",
      "Is it safe to take vitamins, supplements, or herbal remedies during treatment?"
    ]
  },
  {
    id: "mentalhealth",
    label: "About Mental Health & Support",
    color: "border-pink-200 bg-pink-50/40",
    questions: [
      "Are psychological support or counseling services available to me?",
      "How can my family and caregivers best support me during treatment?",
      "Are there cancer support groups you recommend for my cancer type?",
      "What resources are available for managing cancer-related anxiety and fear?"
    ]
  }
];

export default function VisitPrepPage() {
  const { t, langKey, language } = useTranslation();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["diagnosis", "treatment", "stage"]));

  const translateText = (text: string) => {
    if (langKey === "te" || langKey === "hi") {
      return visitPrepTranslations[langKey]?.[text] || text;
    }
    return text;
  };

  function toggleQuestion(q: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(q) ? next.delete(q) : next.add(q);
      return next;
    });
  }

  function toggleCategory(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    const all = new Set(CATEGORIES.flatMap((c) => c.questions));
    setChecked(all);
  }

  function handlePrint() {
    window.print();
  }

  const total = CATEGORIES.flatMap((c) => c.questions).length;
  const selectedCount = checked.size;

  return (
    <>
      <PageHeader
        eyebrow={t("visitEyebrow")}
        title={t("visitTitle")}
        description={t("visitDesc")}
      />

      {/* Action bar */}
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black text-foreground">{selectedCount}</div>
          <div>
            <p className="text-sm font-bold text-foreground">{t("questionsSelected")}</p>
            <p className="text-xs text-muted-foreground">
              {t("outOf")} {total} {t("across")} {CATEGORIES.length} {t("categories")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll} className="gap-2 font-semibold">
            <CheckSquare className="h-4 w-4" />
            {t("selectAll")}
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-2 font-semibold">
            <Printer className="h-4 w-4" />
            {t("printPdf")}
          </Button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print-only mb-6">
        <h1 className="text-2xl font-black">Doctor Visit Checklist — OncoMind AI</h1>
        <p className="text-sm text-gray-600 mt-1">Questions selected for your oncology appointment</p>
      </div>

      {/* Categories */}
      <div className="grid gap-3">
        {CATEGORIES.map((cat) => {
          const isOpen = expanded.has(cat.id);
          const catChecked = cat.questions.filter((q) => checked.has(q)).length;
          return (
            <Card key={cat.id} className={`clinical-card overflow-hidden transition-all`}>
              <button
                className={`no-print w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-muted/40 ${cat.color} border-0`}
                onClick={() => toggleCategory(cat.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-black text-foreground">{translateText(cat.label)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === "Telugu"
                        ? `${cat.questions.length} ప్రశ్నలు · ${catChecked} ఎంపిక చేయబడ్డాయి`
                        : language === "Hindi"
                        ? `${cat.questions.length} प्रश्न · ${catChecked} चयनित`
                        : `${cat.questions.length} questions · ${catChecked} selected`}
                    </p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>

              {isOpen && (
                <CardContent className="p-4 pt-0 space-y-2">
                  {cat.questions.map((q) => {
                    const isChecked = checked.has(q);
                    return (
                      <label
                        key={q}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30 ${
                          isChecked ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => toggleQuestion(q)}
                        />
                        <span className="text-sm font-medium text-foreground leading-5">{translateText(q)}</span>
                      </label>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
