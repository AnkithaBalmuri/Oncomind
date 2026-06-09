// upload_test_fixed.mjs
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const SERVER = process.env.SERVER_URL || 'http://localhost:3000';

async function uploadFile(filePath) {
  const fileName = path.basename(filePath);
  const fileStream = fs.createReadStream(filePath);
  const form = new FormData();
  form.append('files', fileStream, fileName);

  const resp = await fetch(`${SERVER}/api/documents`, {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });
  const data = await resp.json();
  console.log('Upload response:', data);
  return data.documents;
}

async function askRag(question, scope = 'patient') {
  const resp = await fetch(`${SERVER}/api/rag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, scope })
  });
  const data = await resp.json();
  console.log('RAG response:', JSON.stringify(data, null, 2));
}

(async () => {
  const samplePath = path.resolve('sample.txt'); // Ensure this file exists
  if (!fs.existsSync(samplePath)) {
    console.error('Sample file not found at', samplePath);
    process.exit(1);
  }
  await uploadFile(samplePath);
  // Wait a bit for extraction if needed
  await new Promise(r => setTimeout(r, 2000));
  await askRag('What is the diagnosis?', 'patient');
})();
