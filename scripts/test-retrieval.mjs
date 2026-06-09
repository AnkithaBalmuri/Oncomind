import { readFile } from "node:fs/promises";
import path from "node:path";

const storeDir = path.join(process.cwd(), "work", "document-store");
const metadataPath = path.join(storeDir, "documents.json");

const stopWords = new Set([
  "what", "is", "are", "the", "and", "or", "a", "an", "to", "of", "in", "for", "with", "about", "explain", "tell", "me", "give", "how", "does", "do", "it", "this", "that"
]);

async function readDocuments() {
  return JSON.parse(await readFile(metadataPath, "utf8"));
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function chunkText(text, maxLength = 1200) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks = [];
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

function retrieve(question, documents, scope = "all") {
  const queryTerms = tokenize(question);
  const querySet = new Set(queryTerms);
  const chunks = [];

  for (const document of documents) {
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

  const uniqueChunks = [];
  const seen = new Set();

  for (const item of chunks.sort((a, b) => b.score - a.score)) {
    const key = `${item.documentName.toLowerCase()}::${item.chunk.toLowerCase().replace(/\s+/g, " ").slice(0, 320)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueChunks.push(item);
    if (uniqueChunks.length === 5) break;
  }

  return uniqueChunks;
}

const docs = await readDocuments();
const result = retrieve("What are the symptoms and warning signs of cancer?", docs);
console.log("Found matches:", result.length);
result.forEach((r, idx) => {
  console.log(`\nMatch ${idx + 1}: ${r.documentName} (Score: ${r.score})`);
  console.log(r.chunk.slice(0, 300) + "...\n");
});
