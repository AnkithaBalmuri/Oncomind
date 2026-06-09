import { documents } from "@/lib/mock-data";
import type { UploadedDocument } from "@/types";

export const uploadService = {
  async listDocuments() {
    try {
      const response = await fetch("/api/documents", { cache: "no-store" });
      if (!response.ok) throw new Error("Document API unavailable");
      const data = (await response.json()) as { documents: UploadedDocument[] };
      return data.documents;
    } catch {
      return documents;
    }
  },
  async uploadDocuments(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/documents", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return (await response.json()) as { documents: UploadedDocument[]; created: UploadedDocument[] };
  },
  async deleteDocument(id: string) {
    const response = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Delete failed");
    }

    return (await response.json()) as { documents: UploadedDocument[] };
  },
  async reprocessDocuments() {
    const response = await fetch("/api/documents/reprocess", { method: "POST" });
    if (!response.ok) {
      throw new Error("Reprocess failed");
    }

    return (await response.json()) as { documents: UploadedDocument[]; updatedCount: number };
  }
};
