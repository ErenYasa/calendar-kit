/**
 * EN/TR documentation completeness (see src/docs/i18n.ts).
 *
 * - every page file has a Turkish counterpart exporting the same components;
 * - every example and snippet has a `.tr` variant with the same public imports,
 *   the same documented outputs (`// → value`) and different (translated) text;
 * - rendered pages match in structure (headings, tables and rows, examples,
 *   code blocks), keep every inline `<code>` (API names are never translated)
 *   and contain no English sentence left untranslated;
 * - the UI string tables differ for every key.
 */
import { render } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';
import { LangContext, type Lang, UI } from '../src/docs/i18n';

const root = join(__dirname, '..');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const read = (f: string) => readFileSync(f, 'utf8');
const rel = (f: string) => f.slice(root.length + 1);

const pagesDir = join(root, 'src/docs/pages');
const enPages = readdirSync(pagesDir).filter((f) => f.endsWith('.tsx'));
const exportsOf = (src: string) => [...src.matchAll(/^export function (\w+)/gm)].map((m) => m[1]!).sort();

const isTr = (f: string) => /\.tr\.\w+$/.test(f);
const trOf = (f: string) => f.replace(/\.(\w+)$/, '.tr.$1');
const codeFiles = [...walk(join(root, 'src/examples')), ...walk(join(root, 'src/snippets'))].filter((f) => !isTr(f));
const hasComment = (src: string, f: string) => (f.endsWith('.sh') ? /^\s*#/m.test(src) : /\/\*|\/\//.test(src));
// A .tr variant is required for every TS/TSX file, and for CSS/shell files with comments.
const needsTr = (f: string) => /\.tsx?$/.test(f) || hasComment(read(f), f);

/** Non-relative imports: `module: name, name` (the public API an example uses). */
const publicImports = (src: string) =>
  [...src.matchAll(/^import\s+(type\s+)?([^;]*?)\s+from\s+'([^.'][^']*)';/gm)]
    .map((m) => `${m[3]}: ${m[2]!.replace(/\s+/g, ' ').trim()}`)
    .sort();
const claims = (src: string) => [...src.matchAll(/^export const (\w+)\b[^\n]*?\/\/ → (.+)$/gm)].map((m) => `${m[1]} → ${m[2]!.trim()}`);

describe('page files', () => {
  it.each(enPages)('%s has a Turkish counterpart with the same exports', (file) => {
    const tr = join(pagesDir, 'tr', file);
    expect(() => statSync(tr), `missing src/docs/pages/tr/${file}`).not.toThrow();
    expect(exportsOf(read(tr))).toEqual(exportsOf(read(join(pagesDir, file))));
  });
});

describe('examples and snippets have Turkish variants', () => {
  it.each(codeFiles.filter(needsTr).map(rel))('%s', (file) => {
    const en = join(root, file);
    const tr = trOf(en);
    expect(() => statSync(tr), `missing ${rel(tr)}`).not.toThrow();
    const enSrc = read(en);
    const trSrc = read(tr);
    expect(trSrc, `${rel(tr)} is an untranslated copy`).not.toBe(enSrc);
    if (/\.tsx?$/.test(file)) {
      expect(publicImports(trSrc), `${rel(tr)} imports`).toEqual(publicImports(enSrc));
      expect(claims(trSrc), `${rel(tr)} documented outputs`).toEqual(claims(enSrc));
      // Relative imports point to the same files or their .tr variants.
      const relImports = (src: string) => [...src.matchAll(/from '(\.[^']+)'|^import '(\.[^']+)'/gm)].map((m) => (m[1] ?? m[2])!.replace(/\.tr(?=\.\w+$|$)/, '')).sort();
      expect(relImports(trSrc)).toEqual(relImports(enSrc));
    }
  });

  it('no .tr file without its English original', () => {
    const orphans = [...walk(join(root, 'src/examples')), ...walk(join(root, 'src/snippets'))]
      .filter(isTr)
      .filter((f) => !codeFiles.includes(f.replace(/\.tr(\.\w+)$/, '$1')));
    expect(orphans.map(rel)).toEqual([]);
  });
});

// ---------------------------------------------------------------- rendering
const modules = import.meta.glob<Record<string, ComponentType>>('../src/docs/pages/**/*.tsx');

const TEXT_SELECTOR = 'h1, h2, h3, h4, p, li, th, td, caption, dt, dd, figcaption, summary, label, button, legend';

function snapshot(container: HTMLElement) {
  const textOf = (el: Element) => {
    const clone = el.cloneNode(true) as Element;
    clone.querySelectorAll('code, pre, .docs-preview').forEach((c) => c.remove());
    return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
  };
  const docs = [...container.querySelectorAll(TEXT_SELECTOR)].filter((el) => !el.closest('.docs-preview'));
  return {
    headings: ['h1', 'h2', 'h3', 'h4'].map((h) => `${h}:${container.querySelectorAll(h).length}`),
    tables: [...container.querySelectorAll('table')].map((t) => t.querySelectorAll('tr').length),
    examples: [...container.querySelectorAll('figure.docs-example')].map((f) => f.id),
    codeBlocks: container.querySelectorAll('.docs-code').length,
    inlineCode: [...container.querySelectorAll('code')]
      .filter((c) => !c.closest('pre') && !c.closest('.docs-preview'))
      .map((c) => c.textContent ?? '')
      .sort(),
    text: [
      ...docs.map(textOf),
      ...[...container.querySelectorAll('[aria-label]')].filter((el) => !el.closest('.docs-preview')).map((el) => el.getAttribute('aria-label') ?? ''),
    ].filter(Boolean),
  };
}

const renderPage = (Component: ComponentType, lang: Lang) => {
  const { container, unmount } = render(
    <LangContext.Provider value={lang}>
      <Component />
    </LangContext.Provider>,
  );
  const snap = snapshot(container);
  unmount();
  return snap;
};

// A sentence counts as English when it has at least three words of letters.
const sentence = (s: string) => (s.match(/\p{L}{2,}/gu) ?? []).length >= 3;

describe('rendered pages: EN and TR match', () => {
  const pairs = enPages.flatMap((file) => exportsOf(read(join(pagesDir, file))).map((name) => [file, name] as const));
  it.each(pairs)('%s › %s', async (file, name) => {
    const en = (await modules[`../src/docs/pages/${file}`]!())[name]!;
    const trLoader = modules[`../src/docs/pages/tr/${file}`];
    expect(trLoader, `missing pages/tr/${file}`).toBeDefined();
    const tr = (await trLoader!())[name]!;
    const a = renderPage(en, 'en');
    const b = renderPage(tr, 'tr');
    expect(b.headings, 'headings').toEqual(a.headings);
    expect(b.tables, 'tables and their row counts').toEqual(a.tables);
    expect(b.examples, 'examples').toEqual(a.examples);
    expect(b.codeBlocks, 'code blocks').toEqual(a.codeBlocks);
    expect(b.inlineCode, 'inline code (API names) unchanged').toEqual(a.inlineCode);
    const english = new Set(a.text.filter(sentence));
    expect(b.text.filter((t) => english.has(t)), 'text left in English').toEqual([]);
  });
});

describe('UI strings', () => {
  it('every key is translated', () => {
    const same = Object.keys(UI.en).filter((k) => {
      const e = UI.en[k as keyof typeof UI.en];
      const t = UI.tr[k as keyof typeof UI.tr];
      return typeof e === 'string' ? e === t : (e as (x: string) => string)('x') === (t as (x: string) => string)('x');
    });
    expect(same).toEqual(['docTitleSuffix']);
  });
});

