import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { UploadedDocument } from "@/types";
import { extractFromBuffer } from "@/lib/server/document-extraction";
import { extractMetadata } from "@/lib/server/metadata-extractor";

const isVercel = process.env.VERCEL === "1" || process.env.NOW_BUILDER === "1";
const storeDir = isVercel
  ? path.join(os.tmpdir(), "document-store")
  : path.join(process.cwd(), "work", "document-store");
const uploadDir = path.join(storeDir, "uploads");
const metadataPath = path.join(storeDir, "documents.json");
const prebuiltPath = path.join(process.cwd(), "data", "prebuilt-documents.json");

async function ensureStore() {
  await mkdir(uploadDir, { recursive: true });
}

async function readDocuments(): Promise<UploadedDocument[]> {
  await ensureStore();
  
  // If the metadata file does not exist yet (first load on Vercel/tmp), initialize it from prebuilt-documents.json if available
  if (!existsSync(metadataPath)) {
    if (existsSync(prebuiltPath)) {
      try {
        const content = await readFile(prebuiltPath, "utf8");
        await writeFile(metadataPath, content, "utf8");
        return JSON.parse(content) as UploadedDocument[];
      } catch (err) {
        console.error("Failed to initialize document-store metadata from prebuilt-documents.json:", err);
      }
    }
  }

  try {
    return JSON.parse(await readFile(metadataPath, "utf8")) as UploadedDocument[];
  } catch {
    return [];
  }
}

async function writeDocuments(documents: UploadedDocument[]) {
  await ensureStore();
  await writeFile(metadataPath, JSON.stringify(documents, null, 2), "utf8");
}

function getType(fileName: string): UploadedDocument["type"] {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".docx")) return "DOCX";
  if (lower.endsWith(".txt")) return "TXT";
  if (lower.endsWith(".png")) return "PNG";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "JPG";
  return "PDF";
}

function cleanFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function GET() {
  const documents = await readDocuments();
  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const current = await readDocuments();
  const created: UploadedDocument[] = [];

  for (const file of files) {
    const type = getType(file.name);
    const id = crypto.randomUUID();
    const safeName = `${id}-${cleanFileName(file.name)}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, safeName), bytes);

    const extraction = await extractFromBuffer(bytes, file.name, type);
    const metadata = await extractMetadata(extraction.extractedText, file.name);

    const document: UploadedDocument = {
      id,
      name: file.name,
      type,
      status: extraction.status,
      progress: extraction.progress,
      uploadedAt: new Date().toLocaleString(),
      size: file.size,
      pages: type === "PDF" ? 1 : undefined,
      extractedText: extraction.extractedText,
      ocrStatus: extraction.ocrStatus,
      source: "patient-upload",
      ...metadata
    };
    created.push(document);
  }

  const documents = [...created, ...current];
  await writeDocuments(documents);

  return NextResponse.json({ documents, created });
}
