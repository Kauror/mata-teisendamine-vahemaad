import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

describe('Unraid and Cloudflare deployment topology', () => {
  it('does not publish the application port and uses the named edge network', () => {
    const compose = read('docker-compose.yml');
    expect(compose).not.toMatch(/^\s+ports:/m);
    expect(compose).toContain('name: pikkuste-harjutaja-edge');
    expect(compose).toMatch(/app:[\s\S]*?networks:\s*\n\s+- edge/);
    expect(compose).toMatch(/cloudflared:[\s\S]*?networks:\s*\n\s+- edge/);
    expect(compose.match(/init: true/g)).toHaveLength(2);
  });

  it('keeps the runtime non-root, read-only, and production-dependency-only', () => {
    const dockerfile = read('Dockerfile');
    const compose = read('docker-compose.yml');
    expect(dockerfile).toContain('node:22.22.3-alpine3.23');
    expect(dockerfile).toContain('npm ci --omit=dev');
    expect(dockerfile).toContain('USER node');
    expect(compose).toMatch(/app:[\s\S]*?read_only: true/);
    expect(compose).toContain('${APP_DATA_DIR:-./data}:/data');
  });

  it('documents the Docker-network origin and rejects localhost as tunnel origin', () => {
    const deployment = read('docs/unraid-cloudflare.md');
    expect(deployment).toContain('http://pikkuste-harjutaja:3000');
    expect(deployment).toContain('not `127.0.0.1`, `localhost`');
    expect(read('docker-compose.yml')).toContain('--metrics 127.0.0.1:2000');
  });

  it('forwards graceful-stop signals to Next.js', () => {
    const startup = read('scripts/verified-start.ts');
    expect(startup).toContain("process.once('SIGTERM'");
    expect(startup).toContain("child.kill(signal)");
  });
});
