// The app version is a calendar version derived from the date of the last commit
// in the checkout being built: 2026.07.26. It answers one question — "when was
// the app last updated?" — and cannot drift, because nobody has to remember to
// bump it.
//
// Resolution order:
//   1. APP_VERSION in the environment. Docker builds take this path: the image
//      is built with .git excluded (see .dockerignore), so the host computes the
//      version and passes it in as a build arg.
//   2. The committer date of HEAD, read from git.
// A production build with neither is a build that would ship a lying version
// string, so it fails loudly instead.

import { spawnSync } from 'node:child_process';

// The whole app reckons calendar days in Tallinn (see src/lib/appDate.ts), so a
// commit made late in the evening belongs to the day the family experienced.
const versionFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Tallinn',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export function formatVersionDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return versionFormat.format(date).replace(/-/g, '.');
}

export function isVersionString(value) {
  return typeof value === 'string' && /^\d{4}\.\d{2}\.\d{2}$/.test(value);
}

export function lastCommitIso() {
  const result = spawnSync('git', ['log', '-1', '--format=%cI'], { encoding: 'utf8' });
  if (result.status !== 0) return null;
  const iso = String(result.stdout ?? '').trim();
  return iso || null;
}

// `env` and `gitIso` are injected so the resolution rules can be unit-tested
// without a git checkout or a mutated process environment.
export function resolveAppVersion({ env = process.env, gitIso = undefined } = {}) {
  const provided = String(env.APP_VERSION ?? '').trim();
  if (provided) {
    if (!isVersionString(provided)) {
      throw new Error(`APP_VERSION must look like 2026.07.26, got "${provided}".`);
    }
    return provided;
  }

  const iso = gitIso === undefined ? lastCommitIso() : gitIso;
  const fromGit = iso ? formatVersionDate(iso) : null;
  if (fromGit) return fromGit;

  throw new Error(
    'Cannot determine the app version: git is unavailable and APP_VERSION is not set. ' +
    'Pass it explicitly, e.g. APP_VERSION=$(npm run --silent version:print) docker compose build.'
  );
}

// `node scripts/app-version.mjs` prints the version, so build tooling that has a
// git checkout (the host, CI) can hand it to tooling that does not (Docker).
if (process.argv[1] && process.argv[1].endsWith('app-version.mjs')) {
  process.stdout.write(resolveAppVersion());
}
