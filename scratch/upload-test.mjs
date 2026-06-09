import fs from "node:fs/promises";
import path from "node:path";
import FormData from "form-data";

async function uploadPdf() {
  const filePath = path.resolve(process.cwd(), "data", "doc2025213500801.pdf");
  const fileBuffer = await fs.readFile(filePath);
  const form = new FormData();
  form.append("files", fileBuffer, { filename: "doc2025213500801.pdf" });

  const response = await fetch("http://localhost:3002/api/documents", {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
  });

  if (!response.ok) {
    console.error("Upload failed", response.status, await response.text());
    return;
  }

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

uploadPdf().catch((e) => console.error(e));
