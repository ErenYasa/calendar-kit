/**
 * F23 regression: every target in the published `exports` map must exist in
 * the packed tarball (no conditions pointing at files that are not shipped).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

const root = resolve(__dirname, '..');

function targets(node: unknown, out: string[] = []): string[] {
  if (typeof node === 'string') out.push(node.replace(/^\.\//, ''));
  else if (node && typeof node === 'object') for (const v of Object.values(node)) targets(v, out);
  return out;
}

it('all export targets are included in the npm pack file list', () => {
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: root, encoding: 'utf8' }))[0];
  const files = new Set<string>(packed.files.map((f: { path: string }) => f.path));
  const missing = targets(pkg.exports).filter((t) => !files.has(t));
  expect(missing).toEqual([]);
}, 60_000);
