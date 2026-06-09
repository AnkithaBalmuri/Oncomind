"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, FileText, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UploadedDocument } from "@/types";
import { uploadService } from "@/services/upload-service";

const statusLabel: Record<string, { label: string; color: string }> = {
  Processed: { label: "Ready for Analysis", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  Processing: { label: "Processing", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Needs Review": { label: "Needs Review", color: "text-rose-700 bg-rose-50 border-rose-200" },
  Uploading: { label: "Uploading", color: "text-blue-700 bg-blue-50 border-blue-200" }
};

export function UploadWidget({ documents }: { documents: UploadedDocument[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>(documents);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<UploadedDocument | null>(null);

  const acceptedTypes = useMemo(() => [".pdf", ".docx", ".txt"], []);

  useEffect(() => {
    uploadService.listDocuments().then(setUploadedFiles);
  }, []);

  async function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const files = Array.from(fileList).filter((file) =>
      acceptedTypes.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
    if (!files.length) {
      setError("Please upload PDF, DOCX, or TXT files only.");
      return;
    }
    setUploading(true);
    setError("");
    setNotice("");
    try {
      const result = await uploadService.uploadDocuments(files);
      setUploadedFiles(result.documents);
      setNotice(`${result.created.length} file(s) uploaded and processing started.`);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeDocument(id: string) {
    setError("");
    setNotice("");
    try {
      const result = await uploadService.deleteDocument(id);
      setUploadedFiles(result.documents);
      setPreview((current) => (current?.id === id ? null : current));
    } catch {
      setError("Could not delete this document.");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
      {/* Drop Zone */}
      <Card
        className={`border-dashed shadow-sm transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-primary/30 bg-gradient-to-br from-primary/4 via-accent/3 to-transparent"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
      >
        <CardContent className="grid min-h-72 place-items-center p-8 text-center">
          <div>
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${dragging ? "bg-primary/15" : "bg-primary/8"}`}>
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-black text-foreground">
              {dragging ? "Drop files here" : "Drop cancer reports here"}
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-muted-foreground">
              PDF, DOCX, and TXT files are automatically processed and made searchable by the AI.
            </p>
            <input
              ref={inputRef}
              className="sr-only"
              type="file"
              accept=".pdf,.docx,.txt"
              multiple
              onChange={(e) => addFiles(e.target.files)}
            />
            <Button
              className="mt-5 gap-2 font-bold shadow-sm"
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {uploading ? "Uploading..." : "Browse files"}
            </Button>
            {error && (
              <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
            {notice && (
              <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {notice}
              </p>
            )}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["PDF", "DOCX", "TXT"].map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-bold text-primary"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <div className="space-y-3">
        {uploadedFiles.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="grid place-items-center p-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 font-bold text-foreground">No documents uploaded yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Choose a PDF, DOCX, or TXT file to begin analysis.</p>
            </CardContent>
          </Card>
        ) : null}

        {uploadedFiles.map((doc) => {
          const status = statusLabel[doc.status] ?? { label: doc.status, color: "text-muted-foreground bg-muted border-muted" };
          return (
            <Card key={doc.id} className="clinical-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-foreground">{doc.name}</p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {doc.type} · {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.color}`}>
                      {status.label}
                    </span>
                    <Button variant="ghost" size="sm" aria-label={`Preview ${doc.name}`} onClick={() => setPreview(doc)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" aria-label={`Remove ${doc.name}`} onClick={() => removeDocument(doc.id)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Progress value={doc.progress} className="mt-3 h-1.5" />
              </CardContent>
            </Card>
          );
        })}

        {/* Preview panel */}
        {preview && (
          <Card className="border-amber-200 bg-amber-50/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">Document Preview</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{preview.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPreview(null)} aria-label="Close preview">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-100/60 p-3 text-sm font-medium leading-6 text-foreground">
                {preview.extractedText || "Extraction preview will appear here after processing completes."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
