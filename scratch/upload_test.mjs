import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const filePath = path.resolve('work', 'temp', 'test.pdf');
const fileStream = fs.createReadStream(filePath);
const form = new (require('form-data'))();
form.append('files', fileStream, { filename: 'test.pdf' });

await fetch('http://localhost:3000/api/documents', {
  method: 'POST',
  body: form,
  headers: form.getHeaders()
}).then(res => res.text().then(text => console.log('Response:', res.status, text)));
