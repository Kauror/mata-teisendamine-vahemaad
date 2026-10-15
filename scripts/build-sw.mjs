// Injects the current build id + a precache manifest of the hashed static assets
// into the service-worker template, writing public/sw.js. Run AFTER `next build`.
import fs from 'node:fs';
import path from 'node:path';
import { selectFontFiles, selectShellFiles } from './precache-selection.mjs';

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

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const capabilities = readJson(capabilitiesPath);
const buildId = readBuildId();

// Only what the App Router shell loads (see scripts/precache-selection.mjs).
const shellFiles = selectShellFiles({
  appBuildManifest: readJson(path.join(nextDir, 'app-build-manifest.json')).pages,
  loadableManifest: readJson(path.join(nextDir, 'react-loadable-manifest.json')),
  shellRoutes: capabilities.shellRoutes
});
const cssTexts = shellFiles.filter((file) => file.endsWith('.css')).map((file) => fs.readFileSync(path.join(nextDir, file), 'utf8'));
const fontUrls = selectFontFiles(cssTexts);
// Images imported by components are emitted next to the fonts; keep them.
const mediaDir = path.join(nextDir, 'static', 'media');
const mediaUrls = fs.existsSync(mediaDir)
  ? fs.readdirSync(mediaDir).filter((name) => /\.(?:png|jpe?g|svg|webp|avif)$/.test(name)).map((name) => `/_next/static/media/${name}`)
  : [];
const staticAssets = [...new Set([...shellFiles.map((file) => `/_next/${file}`), ...fontUrls, ...mediaUrls])].sort();
const missingFiles = staticAssets.filter((url) => !url.startsWith('/_next/static/') || !fs.existsSync(path.join(nextDir, url.slice('/_next/'.length))));
if (missingFiles.length) throw new Error(`Precache entries missing from .next/static: ${missingFiles.join(', ')}`);
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
