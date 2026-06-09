import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { UploadedDocument } from "@/types";

const isVercel = process.env.VERCEL === "1" || process.env.NOW_BUILDER === "1";
const storeDir = isVercel
  ? path.join(os.tmpdir(), "document-store")
  : path.join(process.cwd(), "work", "document-store");
const metadataPath = path.join(storeDir, "documents.json");

async function readDocuments(): Promise<UploadedDocument[]> {
  await mkdir(storeDir, { recursive: true });
  try {
    return JSON.parse(await readFile(metadataPath, "utf8")) as UploadedDocument[];
  } catch {
    return [];
  }
}

async function writeDocuments(documents: UploadedDocument[]) {
  await mkdir(storeDir, { recursive: true });
  await writeFile(metadataPath, JSON.stringify(documents, null, 2), "utf8");
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const documents = await readDocuments();
  const nextDocuments = documents.filter((document) => document.id !== id);

  await writeDocuments(nextDocuments);

  return NextResponse.json({ documents: nextDocuments });
}
