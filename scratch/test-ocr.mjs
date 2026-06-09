import { extractFromFile } from "../lib/server/document-extraction";
import path from "node:path";

async function run() {
  const filePath = path.resolve(process.cwd(), "data", "356-india-fact-sheet.pdf");
  const result = await extractFromFile(filePath, "356-india-fact-sheet.pdf", "PDF");
  console.log(JSON.stringify(result, null, 2));
}
run();
