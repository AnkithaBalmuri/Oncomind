import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { UploadedDocument } from "@/types";

type RetrievedChunk = {
  documentId: string;
  documentName: string;
  chunk: string;
  score: number;
  citation: string;
};

type RagScope = "all" | "patient" | "knowledge";

const isVercel = process.env.VERCEL === "1" || process.env.NOW_BUILDER === "1";
const storeDir = isVercel
  ? path.join(os.tmpdir(), "document-store")
  : path.join(process.cwd(), "work", "document-store");
const metadataPath = path.join(storeDir, "documents.json");
const prebuiltPath = path.join(process.cwd(), "data", "prebuilt-documents.json");

const stopWords = new Set([
  "what",
  "is",
  "are",
  "the",
  "and",
  "or",
  "a",
  "an",
  "to",
  "of",
  "in",
  "for",
  "with",
  "about",
  "explain",
  "tell",
  "me",
  "give",
  "how",
  "does",
  "do",
  "it",
  "this",
  "that"
]);

async function readDocuments(): Promise<UploadedDocument[]> {
  await mkdir(storeDir, { recursive: true });
  
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

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function chunkText(text: string, maxLength = 1200) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if ((current + "\n\n" + paragraph).length > maxLength && current) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }

  if (current) chunks.push(current);
  return chunks.length ? chunks : [text.slice(0, maxLength)];
}

function inferSource(document: UploadedDocument): UploadedDocument["source"] {
  if (document.source) return document.source;
  const lower = document.name.toLowerCase();
  if (lower.startsWith("#") || lower.includes("cancer") || lower.includes("facts") || lower.includes("screening") || lower.includes("mammogram")) {
    return "knowledge-base";
  }
  return "patient-upload";
}

function filterByScope(documents: UploadedDocument[], scope: RagScope) {
  if (scope === "all") return documents;
  return documents.filter((document) => {
    const source = inferSource(document);
    return scope === "patient" ? source === "patient-upload" : source === "knowledge-base";
  });
}

function retrieve(question: string, documents: UploadedDocument[], scope: RagScope) {
  const queryTerms = tokenize(question);
  const querySet = new Set(queryTerms);
  const chunks: RetrievedChunk[] = [];

  for (const document of filterByScope(documents, scope)) {
    if (!document.extractedText || document.ocrStatus !== "Extracted") continue;

    chunkText(document.extractedText).forEach((chunk, index) => {
      const words = tokenize(chunk);
      let score = words.reduce((total, word) => total + (querySet.has(word) ? 1 : 0), 0);
      const lowerChunk = chunk.toLowerCase();
      const lowerName = document.name.toLowerCase();

      if (question.toLowerCase().includes("what is cancer") && lowerName.includes("introduction")) {
        score += 80;
      }

      if (lowerChunk.includes("what is cancer")) {
        score += 60;
      }

      for (const term of queryTerms) {
        if (lowerName.includes(term)) score += 12;
      }

      if (score > 0) {
        chunks.push({
          documentId: document.id,
          documentName: document.name,
          chunk,
          score,
          citation: `${document.name} - chunk ${index + 1}`
        });
      }
    });
  }

  const uniqueChunks: RetrievedChunk[] = [];
  const seen = new Set<string>();

  for (const item of chunks.sort((a, b) => b.score - a.score)) {
    const key = `${item.documentName.toLowerCase()}::${item.chunk.toLowerCase().replace(/\s+/g, " ").slice(0, 320)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueChunks.push(item);
    if (uniqueChunks.length === 5) break;
  }

  return uniqueChunks;
}

function fallbackAnswer(question: string, retrieved: RetrievedChunk[], queuedDocuments: UploadedDocument[], scope: RagScope) {
  if (!retrieved.length) {
    const label = scope === "patient" ? "uploaded patient documents" : scope === "knowledge" ? "cancer knowledge base" : "extracted knowledge base";
    const queued = queuedDocuments.length
      ? `\n\nSome uploaded files are waiting for OCR/extraction and cannot be searched yet: ${queuedDocuments
          .slice(0, 5)
          .map((document) => document.name)
          .join(", ")}.`
      : "";

    return `I could not find enough matching information in the ${label} for: "${question}".${queued}\n\nTry asking with cancer-specific terms such as breast cancer, lung cancer, screening, staging, chemotherapy, immunotherapy, symptoms, or risk factors.`;
  }

  const sections = retrieved
    .map((item, index) => {
      const compact = item.chunk
        .replace(/^#+\s*/gm, "")
        .replace(/\r/g, "")
        .split("\n")
        .filter(Boolean)
        .slice(0, 8)
        .join("\n");

      return `### Retrieved point ${index + 1}\n${compact}\n\nCitation: ${item.citation}`;
    })
    .join("\n\n");

  const heading = scope === "patient" ? "Answer from uploaded patient documents" : scope === "knowledge" ? "Answer from cancer knowledge base" : "Answer from extracted documents";
  return `## ${heading}\n\nQuestion: ${question}\n\n${sections}\n\n## Important note\nThis answer is grounded only in extracted local documents. Confirm medical decisions with a qualified oncology professional.`;
}

async function groqAnswer(question: string, retrieved: RetrievedChunk[], scope: RagScope, language = "English") {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !retrieved.length) return null;

  const context = retrieved.map((item) => `[${item.citation}]\n${item.chunk}`).join("\n\n---\n\n");

  const langInstruction = language === "Telugu"
    ? "Respond exclusively in high-quality Telugu. Translate all medical terminology and explanations into clear, readable Telugu."
    : language === "Hindi"
    ? "Respond exclusively in high-quality Hindi. Translate all medical terminology and explanations into clear, readable Hindi."
    : "Respond in English.";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              (scope === "patient"
                ? "You are OncoMind AI Document Analyzer. Analyze only the uploaded patient document context. Summarize key clinical details, diagnosis, treatment, medications, follow-up, and caution that this is not medical advice. If context is insufficient, say so. Cite document chunks."
                : "You are OncoMind AI Cancer Knowledge Chatbot. Answer only using the provided cancer knowledge-base context. If the context is insufficient, say so. Use headings, bullets, and cite document names/chunks.") + `\n\nCRITICAL REQUIREMENT: ${langInstruction}`
          },
          {
            role: "user",
            content: `Question: ${question}\n\nContext:\n${context}`
          }
        ]
      })
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as { question?: string; scope?: RagScope; language?: string };
  const question = body.question?.trim();
  const scope = body.scope || "all";
  const language = body.language || "English";

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const documents = await readDocuments();
  const scopedDocuments = filterByScope(documents, scope);
  const retrieved = retrieve(question, documents, scope);
  const queuedDocuments = scopedDocuments.filter((document) => document.ocrStatus !== "Extracted");
  const answer = (await groqAnswer(question, retrieved, scope, language)) || fallbackAnswer(question, retrieved, queuedDocuments, scope);

  return NextResponse.json({
    answer,
    citations: retrieved.map((item) => ({
      documentId: item.documentId,
      documentName: item.documentName,
      citation: item.citation,
      score: item.score,
      preview: item.chunk.slice(0, 420)
    })),
    scope,
    searchedDocuments: scopedDocuments.length,
    searchableDocuments: scopedDocuments.filter((document) => document.ocrStatus === "Extracted").length,
    queuedDocuments: queuedDocuments.length
  });
}
