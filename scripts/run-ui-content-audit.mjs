import { spawnSync } from 'node:child_process';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('npm_execpath is unavailable; run this audit through npm.');
const stages = [
  ['lint'],
  ['typecheck'],
  ['validate:science'],
  ['test:content'],
  ['test:e2e:audit']
];

for (const [script] of stages) {
  console.log(`\n=== npm run ${script} ===`);
  const result = spawnSync(process.execPath, [npmCli, 'run', script], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('\nUI and content audit passed.');
