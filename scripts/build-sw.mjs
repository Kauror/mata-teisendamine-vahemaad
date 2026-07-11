// Injects the current build id + a precache manifest of the hashed static assets
// into the service-worker template, writing public/sw.js. Run AFTER `next build`.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const nextDir = path.join(root, '.next');
const templatePath = path.join(root, 'scripts', 'sw-template.js');
const outPath = path.join(root, 'public', 'sw.js');

function readBuildId() {
  try {
    return fs.readFileSync(path.join(nextDir, 'BUILD_ID'), 'utf8').trim();
  } catch {
    return `dev-${Date.now()}`;
  }
}

function walk(dir, baseUrl, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const url = `${baseUrl}/${entry.name}`;
    if (entry.isDirectory()) walk(full, url, acc);
    else if (/\.(?:js|css)$/.test(entry.name)) acc.push(url);
  }
  return acc;
}

const buildId = readBuildId();
const staticAssets = walk(path.join(nextDir, 'static'), '/_next/static', []);

const template = fs.readFileSync(templatePath, 'utf8');
const output = template
  .replace('__BUILD_ID__', buildId)
  .replace('__PRECACHE__', JSON.stringify(staticAssets));

fs.writeFileSync(outPath, output);
console.log(`[build-sw] wrote public/sw.js — build ${buildId}, ${staticAssets.length} precached assets`);
