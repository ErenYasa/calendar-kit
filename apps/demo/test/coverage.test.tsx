/**
 * docs/documentation-coverage.md must list every public item of the package.
 * The inventory is read from the package itself (runtime exports and source
 * files), so a new prop, controller method, classNames part, CSS variable or
 * day data attribute fails here until it has a row in the matrix. Statuses are
 * not judged (a `missing` row still counts as listed); referenced pages and
 * example/snippet files must exist.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as api from 'calendar-kit';

const demo = resolve(__dirname, '..');
const repo = resolve(demo, '../..');
const pkg = join(repo, 'packages/calendar-kit/src');
const read = (path: string) => readFileSync(path, 'utf8');

const doc = read(join(repo, 'docs/documentation-coverage.md'));
const typesSrc = read(join(pkg, 'react/types.ts'));

// ------------------------------------------------------------------ matrix

interface Row {
  name: string;
  category: string;
  pages: string;
  examples: string;
  status: string;
  note: string;
}

const matrixText = doc.slice(doc.indexOf('## Coverage matrix'), doc.indexOf('\n## ', doc.indexOf('## Coverage matrix') + 1));
const rows: Row[] = matrixText
  .split('\n')
  .filter((line) => line.startsWith('| `'))
  .map((line) => {
    const cells = line.slice(1, -1).split(/(?<!\\)\|/).map((c) => c.trim());
    const [name, category, pages, examples, status, note] = cells as [string, string, string, string, string, string];
    return { name: name.replace(/^`|`$/g, ''), category, pages, examples, status, note: note ?? '' };
  });
const listed = (category: (c: string) => boolean) => new Set(rows.filter((r) => category(r.category)).map((r) => r.name));

// ------------------------------------------------------------------ source parsing

/** Body of `export interface Name … { … }` (brace-matched). */
function interfaceBody(src: string, name: string): { body: string; extends: string[] } {
  const m = new RegExp(`export interface ${name}\\b([^{]*)\\{`).exec(src);
  if (!m) throw new Error(`interface ${name} not found`);
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  for (; i < src.length && depth; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
  }
  const ext = /extends\s+(.+)/.exec(m[1]!)?.[1] ?? '';
  return { body: src.slice(start, i - 1), extends: [...ext.matchAll(/([A-Z]\w*)(?:<[^>]*>)?/g)].map((x) => x[1]!) };
}

/** Member names of an interface, following `extends` to interfaces of the same file. */
function members(src: string, name: string): string[] {
  const { body, extends: parents } = interfaceBody(src, name);
  const own = [
    ...body
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .matchAll(/^ {2}(?:readonly\s+)?('[^']+'|[A-Za-z_$][\w$]*)\??\s*[:(]/gm),
  ].map((m) => m[1]!.replace(/'/g, ''));
  const inherited = parents.filter((p) => new RegExp(`export interface ${p}\\b`).test(src)).flatMap((p) => members(src, p));
  return [...new Set([...own, ...inherited])];
}

const calendarProps = [
  ...new Set(['CalendarBaseProps', 'SingleSelectionProps', 'RangeSelectionProps', 'MultipleSelectionProps', 'ReadonlySelectionProps'].flatMap((n) => members(typesSrc, n))),
];
const controllerMembers = members(typesSrc, 'CalendarController');
const calendarParts = [.../export type CalendarPart =([\s\S]*?);/.exec(typesSrc)![1]!.matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]!);

const scss = read(join(pkg, 'styles/index.scss'));
const rootBlock = /^\.(?:cal|#\{\$p\})-root\s*\{([\s\S]*?)^\}/m.exec(scss)![1]!;
const publicCssVars = [...rootBlock.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1]!);

const daySrc = read(join(pkg, 'react/Day.tsx'));
const dayAttrsBlock = /export function dayDataAttributes[\s\S]*?const attrs[^{]*\{([\s\S]*?)\};/.exec(daySrc)![1]!;
const dayAttributes = [...dayAttrsBlock.matchAll(/'(data-[\w-]+)'\s*:/g)].map((m) => m[1]!);

const navSlugs = new Set([...read(join(demo, 'src/docs/nav.ts')).matchAll(/\bp\('([\w-]+)'/g)].map((m) => m[1]!));

const missing = (expected: readonly string[], have: Set<string>) => expected.filter((n) => !have.has(n));

// ------------------------------------------------------------------ tests

describe('documentation coverage matrix', () => {
  it('parses the inventory and the matrix', () => {
    expect(rows.length).toBeGreaterThan(300);
    expect(calendarProps.length).toBeGreaterThan(60);
    expect(calendarProps).toContain('onEvent'); // inherited from CalendarEventHandlers
    expect(controllerMembers.length).toBeGreaterThan(5);
    expect(calendarParts.length).toBeGreaterThan(10);
    expect(publicCssVars.length).toBeGreaterThan(10);
    expect(dayAttributes.length).toBeGreaterThan(10);
  });

  it('lists every runtime export of calendar-kit, and nothing else as one', () => {
    const exported = Object.keys(api).filter((k) => k !== 'default');
    const have = listed((c) => c === 'Runtime export');
    expect(missing(exported, have)).toEqual([]);
    expect([...have].filter((n) => !exported.includes(n))).toEqual([]);
  });

  it('lists every Calendar prop (base props, event callbacks, selection props)', () => {
    expect(missing(calendarProps, listed((c) => c.startsWith('Prop')))).toEqual([]);
  });

  it('lists every CalendarController member', () => {
    expect(missing(controllerMembers, listed((c) => c === 'Controller member'))).toEqual([]);
  });

  it('lists every CalendarPart (classNames key)', () => {
    expect(missing(calendarParts, listed((c) => c === 'classNames key'))).toEqual([]);
  });

  it('lists every public CSS variable declared on .cal-root, and only those as public', () => {
    const have = listed((c) => c === 'CSS variable');
    expect(missing(publicCssVars, have)).toEqual([]);
    expect([...have].filter((n) => !publicCssVars.includes(n))).toEqual([]);
  });

  it('lists every day data attribute', () => {
    expect(missing(dayAttributes, listed((c) => c.startsWith('data attribute (day cell')))).toEqual([]);
  });

  it('uses only known statuses and explains every gap', () => {
    for (const r of rows) {
      expect(['complete', 'partial', 'missing'], `${r.name}: status ${r.status}`).toContain(r.status);
      if (r.status !== 'complete') expect(r.note, `${r.name} needs a note`).not.toBe('');
    }
  });

  it('references only existing doc pages', () => {
    for (const r of rows) expect(r.pages, `${r.name} has no docs page`).toMatch(/#\//);
    const slugs = [...doc.matchAll(/`#\/([\w-]+)`/g)].map((m) => m[1]!);
    expect(slugs.length).toBeGreaterThan(0);
    expect([...new Set(slugs)].filter((s) => !navSlugs.has(s))).toEqual([]);
  });

  it('references only existing example and snippet files', () => {
    const paths = [...doc.matchAll(/`((?:examples|snippets)\/[^`*]+\.\w+)`/g)].map((m) => m[1]!);
    expect(paths.length).toBeGreaterThan(0);
    expect([...new Set(paths)].filter((p) => !existsSync(join(demo, 'src', p)))).toEqual([]);
  });
});
