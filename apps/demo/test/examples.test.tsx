/**
 * Docs examples are the shown code: they may import only public entry points,
 * every file they import is shown as a tab, every <Example src> on a page
 * exists, and the highlighted HTML is exactly the source text.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectFiles, highlight } from '../code-plugin';

const root = resolve(__dirname, '..');
const examples = join(root, 'src/examples');
const PUBLIC = new Set(['react', 'react-dom', 'calendar-kit', 'calendar-kit/core', 'calendar-kit/client', 'calendar-kit/styles.css']);

const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const files = walk(examples);
const specifiers = (code: string) => [...code.matchAll(/(?:from\s+|import\s+)['"]([^'"]+)['"]/g)].map((m) => m[1]!);
const unescape = (html: string) =>
  html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');

describe('docs examples', () => {
  it('import only the public API, local files inside src/examples, or React', () => {
    for (const file of files.filter((f) => /\.tsx?$/.test(f)))
      for (const spec of specifiers(readFileSync(file, 'utf8'))) {
        if (spec.startsWith('.')) expect(resolve(file, '..', spec).startsWith(examples), `${relative(root, file)} → ${spec}`).toBe(true);
        else expect(PUBLIC.has(spec), `${relative(root, file)} imports ${spec}`).toBe(true);
      }
  });

  it('show every local file they depend on', () => {
    for (const file of files.filter((f) => f.endsWith('.tsx'))) {
      const shown = collectFiles(file);
      for (const spec of specifiers(readFileSync(file, 'utf8')).filter((s) => s.startsWith('.')))
        expect(shown.some((s) => s.startsWith(resolve(file, '..', spec))), `${relative(root, file)} hides ${spec}`).toBe(true);
    }
  });

  it('every <Example src> on a docs page exists and has a default export', () => {
    const pages = walk(join(root, 'src/docs/pages'));
    const used = pages.flatMap((p) => [...readFileSync(p, 'utf8').matchAll(/<Example src="([^"]+)"/g)].map((m) => m[1]!));
    expect(used.length).toBeGreaterThan(30);
    for (const src of used) expect(readFileSync(join(examples, `${src}.tsx`), 'utf8'), src).toMatch(/export default function/);
  });

  it('highlighted code is exactly the source', () => {
    for (const file of [...files, ...walk(join(root, 'src/snippets'))]) {
      const code = readFileSync(file, 'utf8');
      const lang = file.endsWith('.css') ? 'css' : file.endsWith('.sh') ? 'sh' : file.endsWith('.tsx') ? 'tsx' : 'ts';
      expect(unescape(highlight(code, lang)), relative(root, file)).toBe(code);
    }
  });
});
