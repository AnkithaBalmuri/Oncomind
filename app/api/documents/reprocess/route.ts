import { NextResponse } from "next/server";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { UploadedDocument } from "@/types";
import { extractFromFile } from "@/lib/server/document-extraction";

const isVercel = process.env.VERCEL === "1" || process.env.NOW_BUILDER === "1";
const storeDir = isVercel
  ? path.join(os.tmpdir(), "document-store")
  : path.join(process.cwd(), "work", "document-store");
const uploadDir = path.join(storeDir, "uploads");
const metadataPath = path.join(storeDir, "documents.json");

async function readDocuments(): Promise<UploadedDocument[]> {
  await mkdir(uploadDir, { recursive: true });
  try {
    return JSON.parse(await readFile(metadataPath, "utf8")) as UploadedDocument[];
  } catch {
    return [];
  }
}

async function writeDocuments(documents: UploadedDocument[]) {
  await mkdir(uploadDir, { recursive: true });
  await writeFile(metadataPath, JSON.stringify(documents, null, 2), "utf8");
}

async function findStoredFile(document: UploadedDocument) {
  const files = await readdir(uploadDir);
  const match = files.find((file) => file.startsWith(`${document.id}-`));
  return match ? path.join(uploadDir, match) : null;
}

export async function POST() {
  const documents = await readDocuments();
  let updatedCount = 0;

  const updated = await Promise.all(
    documents.map(async (document) => {
      if (document.ocrStatus === "Extracted") return document;

      const storedFile = await findStoredFile(document);
      if (!storedFile) return document;

      const extraction = await extractFromFile(storedFile, document.name, document.type);
      updatedCount += extraction.ocrStatus === "Extracted" ? 1 : 0;

      return {
        ...document,
        status: extraction.status,
        progress: extraction.progress,
        extractedText: extraction.extractedText,
        ocrStatus: extraction.ocrStatus
      };
    })
  );

  await writeDocuments(updated);

  return NextResponse.json({ documents: updated, updatedCount });
}
