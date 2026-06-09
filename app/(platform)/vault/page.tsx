"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  FolderHeart,
  Image as ImageIcon,
  Loader2,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useTranslation, type TranslationKey } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import type { UploadedDocument } from "@/types";
import { uploadService } from "@/services/upload-service";

/* ─── Vault folder categories ─── */
const VAULT_FOLDERS = [
  { key: "all", label: "All Documents", icon: FolderHeart, color: "hsl(24,80%,55%)" },
  { key: "Cancer Reports", label: "Cancer Reports", icon: FileText, color: "hsl(350,70%,55%)" },
  { key: "Pathology Reports", label: "Pathology Reports", icon: FileText, color: "hsl(280,60%,55%)" },
  { key: "Blood Tests", label: "Blood Tests", icon: FileText, color: "hsl(200,70%,50%)" },
  { key: "Scan Reports", label: "Scan Reports", icon: ImageIcon, color: "hsl(170,60%,45%)" },
  { key: "Prescriptions", label: "Prescriptions", icon: FileText, color: "hsl(30,80%,50%)" },
  { key: "Hospital Discharge Summaries", label: "Discharge Summaries", icon: FileText, color: "hsl(220,60%,55%)" },
  { key: "Treatment Plans", label: "Treatment Plans", icon: Sparkles, color: "hsl(140,50%,45%)" },
  { key: "Other Documents", label: "Other Documents", icon: FileText, color: "hsl(0,0%,55%)" },
] as const;

const statusStyle: Record<string, { label: string; cls: string }> = {
  Processed: { label: "Ready", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  Processing: { label: "Processing", cls: "text-amber-700 bg-amber-50 border-amber-200" },
  "Needs Review": { label: "Needs Review", cls: "text-rose-700 bg-rose-50 border-rose-200" },
};

export default function VaultPage() {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");
  const [preview, setPreview] = useState<UploadedDocument | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name" | "type">("date");

  const folderTranslations: Record<string, TranslationKey> = {
    all: "allFolders",
    "Cancer Reports": "cat1",
    "Pathology Reports": "cat2",
    "Blood Tests": "cat3",
    "Scan Reports": "cat4",
    "Prescriptions": "cat5",
    "Hospital Discharge Summaries": "cat6",
    "Treatment Plans": "cat7",
    "Other Documents": "cat8",
  };

  const getStatusLabel = (status: string) => {
    if (status === "Processed") return t("ready");
    if (status === "Processing") return t("processing");
    if (status === "Needs Review") return t("needsReview");
    return status;
  };

  /* Load documents on mount */
  useEffect(() => {
    uploadService.listDocuments().then((d) => { setDocs(d); setLoading(false); });
  }, []);

  /* Accepted file types */
  const acceptedExts = [".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg"];

  /* ─── Upload handler ─── */
  async function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const files = Array.from(fileList).filter((f) =>
      acceptedExts.some((ext) => f.name.toLowerCase().endsWith(ext))
    );
    if (!files.length) {
      setError(t("unsupportedType"));
      return;
    }
    setUploading(true);
    setError("");
    setNotice("");
    try {
      const result = await uploadService.uploadDocuments(files);
      setDocs(result.documents);
      setNotice(`${result.created.length} ${t("uploadSuccess")}`);
    } catch {
      setError(t("uploadFailed"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  /* ─── Delete handler ─── */
  async function removeDoc(id: string) {
    setError("");
    setNotice("");
    try {
      const result = await uploadService.deleteDocument(id);
      setDocs(result.documents);
      if (preview?.id === id) setPreview(null);
    } catch {
      setError(t("deleteFailed"));
    }
  }

  /* ─── Filtering & sorting ─── */
  const filtered = useMemo(() => {
    let list = docs;
    if (activeFolder !== "all") {
      list = list.filter((d) => d.category === activeFolder);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
          (d) =>
              d.name.toLowerCase().includes(q) ||
              d.doctorName?.toLowerCase().includes(q) ||
              d.hospitalName?.toLowerCase().includes(q) ||
              d.cancerType?.toLowerCase().includes(q) ||
              d.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
    return list;
  }, [docs, activeFolder, search, sortBy]);

  /* ─── Stats ─── */
  const totalDocs = docs.length;
  const processedCount = docs.filter((d) => d.status === "Processed").length;
  const totalSizeMB = (docs.reduce((s, d) => s + (d.size ?? 0), 0) / (1024 * 1024)).toFixed(1);

  return (
    <>
      <PageHeader
        eyebrow={t("vault")}
        title={t("vaultTitle")}
        description={t("vaultSubtitle")}
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* ── Left sidebar: Folders ── */}
        <div className="space-y-3">
          {/* Quick stats */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("vaultOverview")}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-black text-foreground">{totalDocs}</p>
                  <p className="text-xs text-muted-foreground">{t("documents")}</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground">{processedCount}</p>
                  <p className="text-xs text-muted-foreground">{t("analyzedCount")}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-lg font-bold text-foreground">{totalSizeMB} MB</p>
                  <p className="text-xs text-muted-foreground">{t("totalStorage")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Folder list */}
          <Card>
            <CardContent className="p-2">
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {t("folders")}
              </p>
              {VAULT_FOLDERS.map((f) => {
                const Icon = f.icon;
                const count =
                  f.key === "all"
                    ? totalDocs
                    : docs.filter((d) => d.category === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setActiveFolder(f.key)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                      activeFolder === f.key
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: f.color }} />
                    <span className="flex-1 text-left truncate">{t(folderTranslations[f.key] || "cat8")}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Upload + Document grid ── */}
        <div className="space-y-5">
          {/* Upload zone */}
          <Card
            className={`border-dashed shadow-sm transition-colors cursor-pointer ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-primary/30 bg-gradient-to-br from-primary/4 via-accent/3 to-transparent"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
          >
            <CardContent className="flex items-center gap-5 p-5">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors ${dragging ? "bg-primary/15" : "bg-primary/8"}`}>
                <UploadCloud className="h-7 w-7 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground">
                  {dragging ? t("dragDrop") : t("uploadMethod")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("dragDrop")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                <Button
                  size="sm"
                  className="gap-2 font-bold"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                  <UploadCloud className="h-4 w-4" />
                  {t("browse")}
                </Button>
              </div>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                multiple
                onChange={(e) => addFiles(e.target.files)}
              />
            </CardContent>
          </Card>

          {/* Notices */}
          {error && (
            <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          {notice && (
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {notice}
            </p>
          )}

          {/* Search + Sort toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "name" | "type")}
                className="appearance-none rounded-lg border bg-background py-2 pl-3 pr-8 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="date">{t("sortByDate")}</option>
                <option value="name">{t("sortByName")}</option>
                <option value="type">{t("sortByType")}</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Document list */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="grid place-items-center p-12 text-center">
                <FolderHeart className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 font-bold text-foreground">
                  {docs.length === 0 ? t("vaultEmpty") : t("noSearchResults")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {docs.length === 0
                    ? t("vaultEmptyDesc")
                    : t("noSearchResultsDesc")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((doc) => {
                const st = statusStyle[doc.status] ?? { label: doc.status, cls: "text-muted-foreground bg-muted border-muted" };
                return (
                  <Card key={doc.id} className="clinical-card group transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3 flex-1">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                            {(doc.type === "PNG" || doc.type === "JPG") ? (
                              <ImageIcon className="h-5 w-5 text-primary" />
                            ) : (
                              <FileText className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-foreground">{doc.name}</p>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span>{doc.type}</span>
                              {doc.size && <span>{(doc.size / 1024).toFixed(0)} KB</span>}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {doc.uploadedAt}
                              </span>
                            </div>
                            {/* AI metadata row */}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {doc.category && (
                                <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary">
                                  {t(folderTranslations[doc.category] || "cat8")}
                                </span>
                              )}
                              {doc.cancerType && (
                                <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                                  {doc.cancerType}
                                </span>
                              )}
                              {doc.doctorName && (
                                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                  Dr. {doc.doctorName}
                                </span>
                              )}
                              {doc.hospitalName && (
                                <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                                  {doc.hospitalName}
                                </span>
                              )}
                            </div>
                            {doc.summary && (
                              <p className="mt-2 text-xs leading-5 text-muted-foreground line-clamp-2">
                                {doc.summary}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${st.cls}`}>
                            {getStatusLabel(doc.status)}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" aria-label="Preview" onClick={() => setPreview(doc)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" aria-label="Delete" onClick={() => removeDoc(doc.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Progress value={doc.progress} className="mt-3 h-1" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Preview panel */}
          {preview && (
            <Card className="border-amber-200 bg-amber-50/60">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-foreground">{t("docPreview")}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{preview.name}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setPreview(null)} aria-label="Close preview">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Key Findings */}
                {preview.keyFindings && preview.keyFindings.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{t("keyFindings")}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                      {preview.keyFindings.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Biomarkers */}
                {preview.biomarkers && preview.biomarkers.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{t("biomarkers")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {preview.biomarkers.map((b, i) => (
                        <span key={i} className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted text */}
                <p className="rounded-lg border border-amber-200 bg-amber-100/60 p-3 text-sm font-medium leading-6 text-foreground max-h-60 overflow-y-auto">
                  {preview.extractedText || "Extraction preview will appear here after processing completes."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
