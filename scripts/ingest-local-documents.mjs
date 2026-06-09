import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const root = process.cwd();
const storeDir = path.join(root, "work", "document-store");
const importDir = path.join(root, "data");
const uploadDir = path.join(storeDir, "uploads");
const metadataPath = path.join(storeDir, "documents.json");
const allowed = new Set([".pdf", ".docx", ".txt"]);

await mkdir(importDir, { recursive: true });
await mkdir(uploadDir, { recursive: true });

async function readDocuments() {
  try {
    return JSON.parse(await readFile(metadataPath, "utf8"));
  } catch {
    return [];
  }
}

function getType(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  if (extension === ".docx") return "DOCX";
  if (extension === ".txt") return "TXT";
  return "PDF";
}

function cleanFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function extractText(filePath, type) {
  if (type === "TXT") {
    return {
      extractedText: await readFile(filePath, "utf8"),
      ocrStatus: "Extracted",
      status: "Processed",
      progress: 100
    };
  }

  if (type === "PDF") {
    try {
      const buffer = await readFile(filePath);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      const text = result.text?.trim() || "";
      await parser.destroy();
      return {
        extractedText: text || `No readable text found in PDF ${path.basename(filePath)}.`,
        ocrStatus: text ? "Extracted" : "Failed",
        status: text ? "Processed" : "Needs Review",
        progress: text ? 100 : 40
      };
    } catch (err) {
      return {
        extractedText: `PDF extraction failed: ${err instanceof Error ? err.message : String(err)}`,
        ocrStatus: "Failed",
        status: "Needs Review",
        progress: 40
      };
    }
  }

  try {
    const result = await mammoth.extractRawText({ buffer: await readFile(filePath) });
    const text = result.value.trim();
    return {
      extractedText: text || "No readable text found in DOCX.",
      ocrStatus: text ? "Extracted" : "Failed",
      status: text ? "Processed" : "Needs Review",
      progress: text ? 100 : 40
    };
  } catch {
    return {
      extractedText: "DOCX extraction failed. Please verify the file is valid.",
      ocrStatus: "Failed",
      status: "Needs Review",
      progress: 40
    };
  }
}

const files = existsSync(importDir)
  ? (await readdir(importDir, { withFileTypes: true })).filter((entry) => entry.isFile())
  : [];

const documents = await readDocuments();
const existingMap = new Map(documents.map((doc) => [doc.name, doc]));
const imported = [];

for (const entry of files) {
  const extension = path.extname(entry.name).toLowerCase();
  if (!allowed.has(extension)) continue;

  const existingDoc = existingMap.get(entry.name);
  if (existingDoc && existingDoc.ocrStatus === "Extracted") {
    continue;
  }

  const sourcePath = path.join(importDir, entry.name);
  const id = existingDoc ? existingDoc.id : crypto.randomUUID();
  const type = getType(entry.name);
  const targetName = `${id}-${cleanFileName(entry.name)}`;
  const targetPath = path.join(uploadDir, targetName);

  if (!existingDoc) {
    await copyFile(sourcePath, targetPath);
  }

  const extraction = await extractText(sourcePath, type);
  const stat = await readFile(sourcePath);

  const document = {
    id,
    name: entry.name,
    type,
    status: extraction.status,
    progress: extraction.progress,
    uploadedAt: existingDoc ? existingDoc.uploadedAt : new Date().toLocaleString(),
    size: stat.byteLength,
    pages: type === "PDF" ? 1 : undefined,
    extractedText: extraction.extractedText,
    ocrStatus: extraction.ocrStatus,
    source: "knowledge-base"
  };

  if (existingDoc) {
    const idx = documents.findIndex((doc) => doc.id === existingDoc.id);
    if (idx !== -1) {
      documents[idx] = document;
    }
    imported.push(`${document.name} (Updated PDF Text)`);
  } else {
    documents.unshift(document);
    imported.push(document.name);
  }
}

await writeFile(metadataPath, JSON.stringify(documents, null, 2), "utf8");

console.log(`Bulk import folder: ${importDir}`);
console.log(`Processed/Imported documents: ${imported.length}`);
if (imported.length) {
  imported.forEach((name) => console.log(`- ${name}`));
}
