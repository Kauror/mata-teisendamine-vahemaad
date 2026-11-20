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
    expect(dockerfile).toContain('node:22.23.1-alpine3.23');
    expect(dockerfile).toContain('npm ci --omit=dev');
    expect(dockerfile).toContain('rm -rf /usr/local/lib/node_modules/npm');
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

  it('documents the real release: no npm in the image, the tunnel never recreated (C6)', () => {
    const deployment = read('docs/unraid-cloudflare.md');
    expect(deployment).toContain('/mnt/user/appdata/mata-teisendamine-vahemaad');
    expect(deployment).toContain('docker compose up -d --no-deps --force-recreate app');
    expect(deployment).not.toMatch(/docker compose run[^\n]*npm /);
    expect(deployment).not.toMatch(/--profile tunnel up -d --force-recreate/);
    expect(deployment).toContain(read('Dockerfile').match(/node:(22\.[0-9.]+-alpine[0-9.]+)/)![1]);
  });

  it('forwards graceful-stop signals to Next.js', () => {
    const startup = read('scripts/verified-start.ts');
    expect(startup).toContain("process.once('SIGTERM'");
    expect(startup).toContain("child.kill(signal)");
  });

  it('stops a crash loop and bounds memory, processes and logs (C2)', () => {
    const app = read('docker-compose.yml').split(/\r?\n  cloudflared:/)[0];
    expect(app).toMatch(/restart: on-failure:\d+/);
    expect(app).not.toContain('restart: unless-stopped');
    expect(app).toMatch(/mem_limit: \S+/);
    expect(app).toMatch(/pids_limit: \d+/);
    expect(app).toMatch(/driver: json-file[\s\S]*?max-size: "\d+m"[\s\S]*?max-file: "\d+"/);
  });
});
