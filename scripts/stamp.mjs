// Stamps the current UTC build time into index.html (#buildLabel).
// Run as part of `npm run build` so the live GitHub Pages site shows
// when the deployed files were last built.
import { readFileSync, writeFileSync } from 'node:fs';

const file = 'index.html';
const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

const html = readFileSync(file, 'utf8');
const updated = html.replace(
    /(<span id="buildLabel">)[^<]*(<\/span>)/,
    `$1${stamp}$2`);

if (updated === html) {
    console.error('stamp: #buildLabel span not found in ' + file);
    process.exit(1);
}

writeFileSync(file, updated);
console.log('stamped build ' + stamp);
