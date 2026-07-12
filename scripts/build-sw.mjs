// Injects the current build id + a precache manifest of the hashed static assets
// into the service-worker template, writing public/sw.js. Run AFTER `next build`.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const nextDir = path.join(root, '.next');
const templatePath = path.join(root, 'scripts', 'sw-template.js');
const outPath = path.join(root, 'public', 'sw.js');
const capabilitiesPath = path.join(root, 'src', 'lib', 'offline', 'capabilities.json');

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
    else if (/\.(?:js|css|woff2?|ttf|otf|png|jpe?g|svg|webp|avif|json)$/.test(entry.name)) acc.push(url);
  }
  return acc;
}

const capabilities = JSON.parse(fs.readFileSync(capabilitiesPath, 'utf8'));
const buildId = readBuildId();
const allowedShellRoutes = new Set(capabilities.shellRoutes);
const staticAssets = walk(path.join(nextDir, 'static'), '/_next/static', []).filter((url) => {
  const marker = '/chunks/app/';
  const start = url.indexOf(marker);
  if (start < 0) return true; // shared hashed runtime/framework chunks
  const appChunk = url.slice(start + marker.length);
  if (appChunk.startsWith('layout-') || appChunk.startsWith('layout/')) return true;
  if (appChunk.startsWith('page-')) return allowedShellRoutes.has('/');
  const pageMarker = appChunk.lastIndexOf('/page-');
  if (pageMarker < 0) return false;
  const route = `/${appChunk.slice(0, pageMarker)}`.replace('/page', '/');
  return allowedShellRoutes.has(route);
});
const runnerRoutes = capabilities.runners.flatMap((runner) => [runner.route, ...(runner.alternateRoutes ?? [])]);
const missingRunnerRoutes = runnerRoutes.filter((route) => !capabilities.shellRoutes.includes(route));
if (missingRunnerRoutes.length) throw new Error(`Offline runner routes missing from shell manifest: ${missingRunnerRoutes.join(', ')}`);

const appPathsPath = path.join(nextDir, 'server', 'app-paths-manifest.json');
if (fs.existsSync(appPathsPath)) {
  const appPaths = JSON.parse(fs.readFileSync(appPathsPath, 'utf8'));
  const missingPages = capabilities.shellRoutes.filter((route) => !appPaths[route === '/' ? '/page' : `${route}/page`]);
  if (missingPages.length) throw new Error(`Offline shell routes missing from the production build: ${missingPages.join(', ')}`);
}

const template = fs.readFileSync(templatePath, 'utf8');
const output = template
  .replace('__BUILD_ID__', buildId)
  .replace('__PRECACHE__', JSON.stringify(staticAssets))
  .replace('__CAPABILITY_MANIFEST__', JSON.stringify(capabilities));

fs.writeFileSync(outPath, output);
console.log(`[build-sw] wrote public/sw.js — build ${buildId}, ${staticAssets.length} precached assets`);
