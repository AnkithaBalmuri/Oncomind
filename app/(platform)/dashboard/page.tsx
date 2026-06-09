"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookmarkCheck,
  Bot,
  Brain,
  CalendarCheck,
  FileText,
  FlaskConical,
  MessageSquareText,
  Mic,
  Pill,
  Search,
  Upload,
  ShieldCheck,
  ClipboardList,
  Sparkles,
  FolderHeart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PatientProfilePanel } from "@/components/shared/patient-profile-panel";
import { useTranslation, translations } from "@/lib/translations";
import type { UploadedDocument } from "@/types";
import { Button } from "@/components/ui/button";

const quickActionsData = [
  {
    titleKey: "chat" as const,
    href: "/chat",
    icon: MessageSquareText,
    gradient: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-200/60",
    iconBg: "bg-blue-500/10 text-blue-600",
    textKey: "AI Chat"
  },
  {
    titleKey: "voice" as const,
    href: "/voice",
    icon: Mic,
    gradient: "from-rose-500/10 to-pink-500/10",
    border: "border-rose-200/60",
    iconBg: "bg-rose-500/10 text-rose-600",
    textKey: "Voice Assistant"
  },
  {
    titleKey: "research" as const,
    href: "/research",
    icon: FlaskConical,
    gradient: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-200/60",
    iconBg: "bg-violet-500/10 text-violet-600",
    textKey: "Research"
  },
  {
    titleKey: "analyzer" as const,
    href: "/analyzer",
    icon: FileText,
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200/60",
    iconBg: "bg-amber-500/10 text-amber-600",
    textKey: "Report Analyzer"
  },
  {
    titleKey: "trials" as const,
    href: "/trials",
    icon: Search,
    gradient: "from-teal-500/10 to-cyan-500/10",
    border: "border-teal-200/60",
    iconBg: "bg-teal-500/10 text-teal-600",
    textKey: "Clinical Trials"
  },
  {
    titleKey: "documents" as const,
    href: "/documents",
    icon: Upload,
    gradient: "from-emerald-500/10 to-green-500/10",
    border: "border-emerald-200/60",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    textKey: "Upload Documents"
  }
];

const featureLinksData = [
  { titleKey: "hub" as const, href: "/hub", icon: Brain, textKey: "Knowledge Hub" },
  { titleKey: "treatments" as const, href: "/treatments", icon: Pill, textKey: "Treatment Explorer" },
  { titleKey: "saved" as const, href: "/saved", icon: BookmarkCheck, textKey: "Saved Insights" },
  { titleKey: "tracker" as const, href: "/tracker", icon: CalendarCheck, textKey: "Follow-Up Tracker" }
];

const actionTexts: Record<string, Record<string, string>> = {
  "AI Chat": {
    en: "Ask report and treatment questions.",
    te: "నివేదిక మరియు చికిత్స ప్రశ్నలను అడగండి.",
    hi: "रिपोर्ट और उपचार संबंधी प्रश्न पूछें।"
  },
  "Voice Assistant": {
    en: "Speak questions, hear AI responses.",
    te: "ప్రశ్నలు మాట్లాడండి, AI సమాధానాలు వినండి.",
    hi: "प्रश्न बोलें, AI प्रतिक्रियाएं सुनें।"
  },
  "Research": {
    en: "Review studies and medical evidence.",
    te: "అధ్యయనాలు మరియు వైద్య ఆధారాలను సమీక్షించండి.",
    hi: "अध्ययन और चिकित्सा साक्ष्यों की समीक्षा करें।"
  },
  "Report Analyzer": {
    en: "Extract cancer type, stage, biomarkers.",
    te: "క్యాన్సర్ రకం, స్టేజ్, బయోమార్కర్లను సేకరించండి.",
    hi: "कैंसर के प्रकार, चरण, बायोमार्कर निकालें।"
  },
  "Clinical Trials": {
    en: "Find matching trials worldwide.",
    te: "ప్రపంచవ్యాప్తంగా సరిపోయే క్లినికల్ ట్రయల్స్ కనుగొనండి.",
    hi: "दुनिया भर में मेल खाने वाले परीक्षण खोजें।"
  },
  "Upload Documents": {
    en: "Add reports for AI analysis.",
    te: "AI విశ్లేషణ కోసం నివేదికలను జోడించండి.",
    hi: "AI विश्लेषण के लिए रिपोर्ट जोड़ें।"
  }
};

const featureTexts: Record<string, Record<string, string>> = {
  "Knowledge Hub": {
    en: "Cancer education & symptoms",
    te: "క్యాన్సర్ విద్య & లక్షణాలు",
    hi: "कैंसर शिक्षा और लक्षण"
  },
  "Treatment Explorer": {
    en: "Compare treatment options",
    te: "చికిత్స ఎంపికలను పోల్చండి",
    hi: "उपचार विकल्पों की तुलना करें"
  },
  "Saved Insights": {
    en: "Your saved research",
    te: "మీరు సేవ్ చేసిన పరిశోధన",
    hi: "आपका सहेजा गया शोध"
  },
  "Follow-Up Tracker": {
    en: "Appointments & reminders",
    te: "నియామకాలు & రిమైండర్‌లు",
    hi: "अपॉइंटमेंट और रिमाइंडर"
  }
};

export default function DashboardPage() {
  const { t, langKey } = useTranslation();
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch(() => {});
  }, []);

  // Calculate vault stats
  const totalDocsCount = documents.length;
  const analyzedCount = documents.filter((d) => d.status === "Processed").length;
  const recentDocs = documents.slice(0, 3);
  const latestDocWithSummary = documents.find((d) => d.summary);
  const latestSummaryText = latestDocWithSummary 
    ? latestDocWithSummary.summary 
    : (langKey === "te" ? "ఇంకా ఎటువంటి సారాంశాలు సృష్టించబడలేదు." : langKey === "hi" ? "अभी तक कोई सारांश नहीं बनाया गया है।" : "No summaries generated yet.");

  const totalSizeBytes = documents.reduce((acc, d) => acc + (d.size || 0), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  const storagePercentage = Math.min(100, Math.round((parseFloat(totalSizeMB) / 100) * 100));

  const translatedCapabilities = [
    { text: t("cap1"), icon: Upload, tone: "text-amber-500" },
    { text: t("cap2"), icon: Brain, tone: "text-orange-500" },
    { text: t("cap3"), icon: MessageSquareText, tone: "text-rose-500" },
    { text: t("cap4"), icon: ShieldCheck, tone: "text-emerald-500" },
    { text: t("cap5"), icon: Search, tone: "text-indigo-500" },
    { text: t("cap6"), icon: ClipboardList, tone: "text-violet-500" },
    { text: t("cap7"), icon: Sparkles, tone: "text-yellow-500" }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-accent/5 to-transparent p-8 shadow-soft">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary mb-4">
            <Bot className="h-3.5 w-3.5" />
            {t("intelPlatform")}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {t("welcome")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
            {t("platformDesc")}
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            {[
              { label: langKey === "te" ? "సైటెడ్ సమాధానాలు" : langKey === "hi" ? "साइटेड जवाब" : "Cited answers", dot: "bg-emerald-500" },
              { label: langKey === "te" ? "విశ్వసనీయత స్కోరింగ్" : langKey === "hi" ? "विश्वसनीयता स्कोरिंग" : "Confidence scoring", dot: "bg-blue-500" },
              { label: langKey === "te" ? "బయోమార్కర్ సేకరణ" : langKey === "hi" ? "बायोमार्कर निष्कर्षण" : "Biomarker extraction", dot: "bg-violet-500" },
              { label: langKey === "te" ? "క్లినికల్ ట్రయల్ మ్యాచింగ్" : langKey === "hi" ? "क्लिनिकल ट्रायल मिलान" : "Clinical trial matching", dot: "bg-amber-500" }
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(24 85% 58%), transparent 70%)" }} />
      </div>

      {/* OncoMind Capabilities & Medical Doodles */}
      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl border border-amber-100 bg-amber-50/40 p-6 md:p-8 shadow-sm relative overflow-hidden glass-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/20 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-lg font-black tracking-tight text-foreground mb-4 flex items-center gap-2">
              <span className="text-amber-500">✨</span> {t("capabilities")}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {translatedCapabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.text} className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white border border-border shadow-sm ${item.tone}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/20 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group glass-card">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative">
              <img
                src="/medical_doodles.png"
                alt="Medical doodles"
                className="h-24 w-auto object-contain doodle-float mb-3 filter drop-shadow-sm rounded-lg"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600/80">{t("cancerIntel")}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">{t("companionText")}</p>
          </div>
        </div>
      </section>

      {/* My Medical Vault Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-black tracking-tight text-foreground">{t("myVault")}</h2>
        <Card className="border-amber-100 bg-amber-50/10 shadow-sm relative overflow-hidden glass-card">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t("vaultBanner")}
                </span>
                <p className="mt-4 text-sm font-semibold leading-relaxed text-muted-foreground max-w-xl">
                  {t("latestSummary")}: <span className="text-foreground italic font-medium">{latestSummaryText}</span>
                </p>

                {/* Stats row */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t pt-4 border-border/60">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("totalDocs")}</p>
                    <p className="mt-1 text-xl font-black text-foreground">{totalDocsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("reportsAnalyzed")}</p>
                    <p className="mt-1 text-xl font-black text-foreground">{analyzedCount}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("storageUsage")}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted overflow-hidden border">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${storagePercentage}%` }} />
                      </div>
                      <span className="text-xs font-bold text-foreground">{totalSizeMB} MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Uploads & Link */}
              <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6 border-border/60 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("recentUploads")}</h4>
                  <div className="space-y-2">
                    {recentDocs.length > 0 ? (
                      recentDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2 text-xs font-semibold text-foreground truncate bg-card border rounded-lg p-2 shadow-sm">
                          <FileText className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                          <span className="truncate flex-1">{doc.name}</span>
                          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">{t(`cat${Object.keys(translations.en).filter(k => k.startsWith("cat")).findIndex(k => translations.en[k as "cat1"] === doc.category) + 1}` as any) || doc.category || "General"}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground font-medium italic">
                        {langKey === "te" ? "వాల్ట్‌లో ఇంకా ఏ పత్రాలు అప్‌లోడ్ కాలేదు." : langKey === "hi" ? "वॉल्ट में अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है।" : "No uploads in the vault yet."}
                      </p>
                    )}
                  </div>
                </div>

                <Button asChild size="sm" className="mt-6 w-full font-bold shadow-sm py-4">
                  <Link href="/vault">
                    <FolderHeart className="h-4 w-4 mr-1.5" />
                    {t("viewVault")}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-black tracking-tight text-foreground">{t("quickActions")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActionsData.map((action) => {
            const Icon = action.icon;
            const translatedTitle = t(action.titleKey);
            const translatedDesc = actionTexts[action.textKey]?.[langKey] || actionTexts[action.textKey]?.en;
            return (
              <Link key={action.href} href={action.href}>
                <Card className={`h-full border bg-gradient-to-br shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${action.gradient} ${action.border}`}>
                  <CardContent className="p-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-base font-black text-foreground">{translatedTitle}</h3>
                    <p className="mt-1.5 text-sm font-medium leading-5 text-muted-foreground">{translatedDesc}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Feature Links */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-black tracking-tight text-foreground">{t("moreTools")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featureLinksData.map((item) => {
            const Icon = item.icon;
            const translatedTitle = t(item.titleKey);
            const translatedDesc = featureTexts[item.textKey]?.[langKey] || featureTexts[item.textKey]?.en;
            return (
              <Link key={item.href} href={item.href}>
                <div className="group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all duration-150 hover:border-primary/30 hover:shadow-md hover:bg-primary/5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{translatedTitle}</p>
                    <p className="text-xs text-muted-foreground">{translatedDesc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Patient Profile */}
      <PatientProfilePanel />
    </>
  );
}
