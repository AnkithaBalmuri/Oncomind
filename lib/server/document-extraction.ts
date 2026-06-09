import { readFile, mkdir } from "node:fs/promises";
import mammoth from "mammoth";
// pdfParse will be loaded lazily when a PDF needs to be processed
import { createWorker } from "tesseract.js";
// pdf2pic will be imported lazily when OCR is needed to avoid DOMMatrix errors on module load
import { UploadedDocument } from "@/types";

export type ExtractionResult = {
  extractedText: string;
  ocrStatus: UploadedDocument["ocrStatus"];
  status: UploadedDocument["status"];
  progress: number;
};

export async function extractFromBuffer(buffer: Buffer, fileName: string, type: UploadedDocument["type"]): Promise<ExtractionResult> {
  if (type === "TXT") {
    return {
      extractedText: buffer.toString("utf8"),
      ocrStatus: "Extracted",
      status: "Processed",
      progress: 100
    };
  }

  if (type === "PNG" || type === "JPG") {
    try {
      const worker = await createWorker("eng");
      const { data: { text } } = await worker.recognize(buffer);
      await worker.terminate();
      const finalText = text.trim();
      return {
        extractedText: finalText || `No readable text found in image ${fileName}.`,
        ocrStatus: finalText ? "Extracted" : "Failed",
        status: finalText ? "Processed" : "Needs Review",
        progress: finalText ? 100 : 40
      };
    } catch (err) {
      return {
        extractedText: `Image OCR failed: ${err instanceof Error ? err.message : String(err)}`,
        ocrStatus: "Failed",
        status: "Needs Review",
        progress: 40
      };
    }
  }

  if (type === "DOCX") {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      return {
        extractedText: text || `No readable text found in ${fileName}.`,
        ocrStatus: text ? "Extracted" : "Failed",
        status: text ? "Processed" : "Needs Review",
        progress: text ? 100 : 40
      };
    } catch {
      return {
        extractedText: "DOCX extraction failed. Please verify the file is a valid Word document.",
        ocrStatus: "Failed",
        status: "Needs Review",
        progress: 40
      };
    }
  }

  // PDF extraction using pdf-parse with OCR fallback
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    const text = result.text?.trim() || "";
    if (text) {
      return {
        extractedText: text,
        ocrStatus: "Extracted",
        status: "Processed",
        progress: 100,
      };
    }
    // No text extracted – run OCR on each page
    const worker = await createWorker("eng");
    // Write buffer to a temporary PDF file
    const tempPath = await writeTempPdf(buffer);
    // Dynamically import pdf2pic to avoid loading it when not needed
    const { fromPath: pdf2picFromPath } = await import('pdf2pic');
    const options = { density: 150, format: "png", width: 1240, height: 1754 };
    const converter = pdf2picFromPath(tempPath, options);
    const pageCount = result.total || 1;
    let ocrText = "";
    for (let i = 1; i <= pageCount; i++) {
      const image = await converter(i);
      if (image.path) {
        const { data: { text: pageText } } = await worker.recognize(image.path);
        ocrText += pageText + "\n";
      }
    }
    await worker.terminate();
    await deleteTempPdf(tempPath);
    const finalText = ocrText.trim();
    return {
      extractedText: finalText || `No readable text found in PDF ${fileName}.`,
      ocrStatus: finalText ? "Extracted" : "Failed",
      status: finalText ? "Processed" : "Needs Review",
      progress: finalText ? 100 : 40,
    };
  } catch (err) {
    return {
      extractedText: `PDF extraction failed: ${err instanceof Error ? err.message : String(err)}`,
      ocrStatus: "Failed",
      status: "Needs Review",
      progress: 40,
    };
  }
}

export async function extractFromFile(filePath: string, fileName: string, type: UploadedDocument["type"]) {
  return extractFromBuffer(await readFile(filePath), fileName, type);
}

// Helper: write a Buffer to a temporary PDF file and return its path
import { writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "crypto";

/**
 * Writes the provided PDF buffer to a temporary file inside the workspace's
 * `work/temp` directory and returns the absolute path.
 */
export async function writeTempPdf(buffer: Buffer): Promise<string> {
  const tempDir = join(process.cwd(), "work", "temp");
  await mkdir(tempDir, { recursive: true });
  const tempPath = join(tempDir, `${randomUUID()}.pdf`);
  await writeFile(tempPath, buffer);
  return tempPath;
}

/**
 * Deletes a temporary PDF file created by `writeTempPdf`.
 */
export async function deleteTempPdf(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch {
    // ignore errors – file may have been already removed
  }
}
