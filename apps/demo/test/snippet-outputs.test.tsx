/**
 * Documented outputs are real: in src/snippets, a line
 *   export const name = expression; // → <JSON value>
 * is checked by importing the snippet and comparing the exported value.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const files = walk(join(root, 'src/snippets')).filter((f) => /\.tsx?$/.test(f));
const modules = import.meta.glob('../src/snippets/**/*.{ts,tsx}');

describe('documented snippet outputs', () => {
  for (const file of files) {
    const claims = [...readFileSync(file, 'utf8').matchAll(/^export const (\w+)\b[^\n]*?\/\/ → (.+)$/gm)].map((m) => ({ name: m[1]!, expected: m[2]!.trim() }));
    if (!claims.length) continue;
    it(relative(root, file), async () => {
      const mod = (await modules[`../${relative(root, file)}`]!()) as Record<string, unknown>;
      for (const { name, expected } of claims) expect(JSON.stringify(mod[name]), name).toBe(JSON.stringify(JSON.parse(expected)));
    });
  }
});
