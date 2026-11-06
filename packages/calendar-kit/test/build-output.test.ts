/**
 * Entry points of the built package: `client` must start with the
 * 'use client' directive (React Server Components boundary), `core` must not
 * load React, and `.` stays directive-free so its pure helpers work on the server.
 */
import { readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { build } from 'vite';
import { afterAll, beforeAll, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const outDir = join(root, 'test', '.tmp-build');
const read = (f: string) => readFileSync(join(outDir, f), 'utf8');

beforeAll(async () => {
  await build({ root, configFile: join(root, 'vite.config.ts'), logLevel: 'silent', build: { outDir, emptyOutDir: true, sourcemap: false } });
}, 60_000);
afterAll(() => rmSync(outDir, { recursive: true, force: true }));

/** All modules statically reachable from an entry chunk. */
function graph(entry: string, seen = new Set<string>()): Set<string> {
  if (seen.has(entry)) return seen;
  seen.add(entry);
  for (const m of read(entry).matchAll(/(?:from|import)\s*"([^"]+)"/g)) if (m[1]!.startsWith('./')) graph(m[1]!.slice(2), seen);
  return seen;
}

it("client.js begins with the 'use client' directive", () => {
  expect(read('client.js').trimStart()).toMatch(/^["']use client["'];/);
});

it('core.js and its chunks never import React', () => {
  for (const f of graph('core.js')) expect(read(f), f).not.toMatch(/from\s*"react(-dom)?(\/[^"]*)?"/);
});

it('index.js has no directive (helpers stay usable in Server Components)', () => {
  expect(read('index.js')).not.toMatch(/["']use client["']/);
});
