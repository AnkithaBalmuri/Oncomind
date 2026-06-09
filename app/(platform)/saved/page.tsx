"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, FileText, FlaskConical, MessageSquareText, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation, type TranslationKey } from "@/lib/translations";

type SavedItem = {
  id: string;
  type: "chat" | "report" | "research" | "trial";
  title: string;
  summary: string;
  savedAt: string;
  tag?: string;
};

const INITIAL_ITEMS: SavedItem[] = [
  {
    id: "s1",
    type: "report",
    title: "Pathology Report Analysis – Breast Carcinoma",
    summary: "Stage IIB invasive ductal carcinoma, ER+, HER2−, Ki-67 32%. Moderate risk. Endocrine therapy and CDK4/6 inhibitor evaluation recommended.",
    savedAt: "Today",
    tag: "Analyzed"
  },
  {
    id: "s2",
    type: "research",
    title: "CDK4/6 inhibitors in HR+ metastatic breast cancer",
    summary: "Strong evidence: Palbociclib + letrozole extends PFS to 24.8 months vs 14.5 months. The Lancet Oncology, 2025.",
    savedAt: "Yesterday",
    tag: "Strong Evidence"
  },
  {
    id: "s3",
    type: "chat",
    title: "Q: What does ER-positive mean for my treatment?",
    summary: "ER-positive means your cancer cells have estrogen receptors. This means the cancer uses estrogen to grow, and it can likely be treated with hormone therapies such as tamoxifen or aromatase inhibitors.",
    savedAt: "2 days ago",
    tag: "AI Chat"
  },
  {
    id: "s4",
    type: "trial",
    title: "NCT-OM-1042 – HR+ Breast Cancer Targeted Therapy",
    summary: "Phase 2 trial at MSK. Recruiting adults with measurable HR+/HER2- disease. Contact: trials@mskcc.org",
    savedAt: "3 days ago",
    tag: "Recruiting"
  }
];

const typeConfig: Record<string, { icon: typeof Bookmark; color: string; label: string }> = {
  chat: { icon: MessageSquareText, color: "text-blue-600 bg-blue-50", label: "Chat" },
  report: { icon: FileText, color: "text-amber-600 bg-amber-50", label: "Report" },
  research: { icon: FlaskConical, color: "text-violet-600 bg-violet-50", label: "Research" },
  trial: { icon: Search, color: "text-emerald-600 bg-emerald-50", label: "Trial" }
};

const FILTERS = ["All", "Chat", "Report", "Research", "Trial"];

export default function SavedPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<SavedItem[]>(INITIAL_ITEMS);
  const [filter, setFilter] = useState("All");

  const filterTranslations: Record<string, TranslationKey> = {
    All: "all",
    Chat: "chat",
    Report: "analyzer",
    Research: "research",
    Trial: "trials"
  };

  const getBadgeLabel = (type: string) => {
    if (type === "chat") return t("chat");
    if (type === "report") return t("analyzer");
    if (type === "research") return t("research");
    if (type === "trial") return t("trials");
    return type;
  };

  const filtered = items.filter(
    (item) => filter === "All" || item.type.toLowerCase() === filter.toLowerCase()
  );

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <>
      <PageHeader
        eyebrow={t("savedEyebrow")}
        title={t("savedTitle")}
        description={t("savedDesc")}
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-all ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40"
            }`}
          >
            {t(filterTranslations[f] || "all")}
            {f === "All" && <span className="ml-1.5 text-xs opacity-70">({items.length})</span>}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <Card className="clinical-card">
          <CardContent className="grid place-items-center p-12 text-center">
            <BookmarkCheck className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 font-bold text-foreground">{t("noSavedItems")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("noSavedItemsDesc")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => {
            const cfg = typeConfig[item.type];
            const Icon = cfg.icon;
            return (
              <Card key={item.id} className="clinical-card group hover:-translate-y-0.5 transition-transform duration-150">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{getBadgeLabel(item.type)}</span>
                          {item.tag && (
                            <Badge variant="outline" className="text-xs">{item.tag}</Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">{item.savedAt}</span>
                        </div>
                        <h3 className="text-base font-black text-foreground leading-5">{item.title}</h3>
                        <p className="mt-1.5 text-sm font-medium leading-5 text-muted-foreground">{item.summary}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
