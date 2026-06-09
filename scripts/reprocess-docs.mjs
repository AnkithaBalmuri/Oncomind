import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

const storeDir = path.join(process.cwd(), "work", "document-store");
const uploadDir = path.join(storeDir, "uploads");
const metadataPath = path.join(storeDir, "documents.json");

async function readDocuments() {
  try {
    return JSON.parse(await readFile(metadataPath, "utf8"));
  } catch {
    return [];
  }
}

async function writeDocuments(documents) {
  await writeFile(metadataPath, JSON.stringify(documents, null, 2), "utf8");
}

async function findStoredFile(document) {
  try {
    const files = await readdir(uploadDir);
    const match = files.find((file) => file.startsWith(`${document.id}-`));
    return match ? path.join(uploadDir, match) : null;
  } catch {
    return null;
  }
}

const documents = await readDocuments();
let updatedCount = 0;

for (let i = 0; i < documents.length; i++) {
  const document = documents[i];
  if (document.ocrStatus === "Extracted") continue;

  console.log(`Reprocessing: ${document.name}`);
  const storedFile = await findStoredFile(document);
  if (!storedFile) {
    console.log(`File not found for: ${document.name}`);
    continue;
  }

  if (document.type === "PDF") {
    try {
      const buffer = await readFile(storedFile);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      const text = result.text?.trim() || "";
      await parser.destroy();
      
      if (text) {
        documents[i] = {
          ...document,
          status: "Processed",
          progress: 100,
          extractedText: text,
          ocrStatus: "Extracted"
        };
        updatedCount++;
        console.log(`Success: Extracted text from PDF ${document.name}`);
      } else {
        console.log(`No text found in PDF ${document.name}`);
      }
    } catch (err) {
      console.log(`Failed to process PDF ${document.name}: ${err}`);
    }
  }
}

if (updatedCount > 0) {
  await writeDocuments(documents);
  console.log(`Successfully updated ${updatedCount} documents in documents.json`);
} else {
  console.log("No documents needed reprocessing.");
}
