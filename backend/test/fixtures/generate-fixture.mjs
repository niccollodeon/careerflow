import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const doc = new PDFDocument();
doc.pipe(createWriteStream(join(__dirname, 'sample-resume.pdf')));
doc
  .fontSize(14)
  .text('Test Candidate')
  .text('Skills: React, TypeScript, Node.js, PostgreSQL, Docker');
doc.end();