// Build-time code blocks for the docs. `import files from './Example.tsx?code'`
// returns the file and every local file it imports (recursively, e.g. a CSS
// file or a shared data module), each pre-highlighted to HTML. The running
// example and the shown code therefore come from the same source files, and
// no highlighter is shipped to the browser.
import { readFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { highlight as sugarHighlight } from 'sugar-high';
import type { Plugin } from 'vite';

export interface CodeFile {
  name: string;
  lang: 'tsx' | 'ts' | 'css' | 'sh';
  code: string;
  html: string;
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (cls: string | null, text: string) => (cls ? `<span class="tok-${cls}">${escape(text)}</span>` : escape(text));

/**
 * TS/TSX via sugar-high (build time only, handles JSX text), reduced to short
 * class names: one span per token kind, adjacent spans of the same kind merged.
 */
export function highlightTs(code: string): string {
  return sugarHighlight(code)
    .split('\n')
    .map((line) => line.replace(/^<span class="sh__line">/, '').replace(/<\/span>$/, ''))
    .join('\n')
    .replace(/<span class="sh__token--space"[^>]*>([^<]*)<\/span>/g, '$1')
    .replace(/<span class="sh__token--([a-z]+)"[^>]*>/g, '<span class="tok-$1">')
    .replace(/<span class="tok-[a-z]+"><\/span>/g, '')
    .replace(/<\/span><span class="(tok-[a-z]+)">/g, (m, cls: string, offset: number, all: string) =>
      all.startsWith(`<span class="${cls}">`, all.lastIndexOf('<span class="', offset)) ? '' : m,
    );
}

export function highlightCss(code: string): string {
  let out = '';
  const re = /(\/\*[\s\S]*?\*\/)|([^{}]+)(?=\{)|([\w-]+)(\s*:)([^;{}]*)|([{};])|(\s+)/g;
  let last = 0;
  for (const m of code.matchAll(re)) {
    out += escape(code.slice(last, m.index));
    if (m[1]) out += span('comment', m[1]);
    else if (m[2]) out += span('tag', m[2]);
    else if (m[3]) out += span('attr', m[3]) + escape(m[4]!) + span('string', m[5]!);
    else out += escape(m[0]);
    last = m.index! + m[0].length;
  }
  return out + escape(code.slice(last));
}

export function highlight(code: string, lang: CodeFile['lang']): string {
  if (lang === 'css') return highlightCss(code);
  if (lang === 'sh') return code.split('\n').map((l) => (l.startsWith('#') ? span('comment', l) : escape(l))).join('\n');
  return highlightTs(code);
}

const langOf = (file: string): CodeFile['lang'] => (file.endsWith('.css') ? 'css' : file.endsWith('.tsx') ? 'tsx' : file.endsWith('.sh') ? 'sh' : 'ts');

/** Relative imports of a source file, resolved to files on disk. */
function localImports(file: string, code: string): string[] {
  if (langOf(file) === 'css' || langOf(file) === 'sh') return [];
  const out: string[] = [];
  for (const m of code.matchAll(/(?:from\s+|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const spec = resolve(dirname(file), m[1]!);
    const candidates = /\.(css|tsx?|sh)$/.test(spec) ? [spec] : [`${spec}.tsx`, `${spec}.ts`];
    const found = candidates.find((c) => {
      try {
        readFileSync(c);
        return true;
      } catch {
        return false;
      }
    });
    if (!found) throw new Error(`${file}: cannot resolve ${m[1]}`);
    out.push(found);
  }
  return out;
}

export function collectFiles(entry: string): string[] {
  const seen: string[] = [];
  const walk = (file: string) => {
    if (seen.includes(file)) return;
    seen.push(file);
    for (const dep of localImports(file, readFileSync(file, 'utf8'))) walk(dep);
  };
  walk(entry);
  return seen;
}

export function codePlugin(): Plugin {
  return {
    name: 'docs-code',
    enforce: 'pre',
    // A virtual id without the file extension: otherwise Vite's CSS plugin
    // would claim `x.css?code` before this plugin can load it.
    async resolveId(source, importer) {
      if (!source.endsWith('?code')) return null;
      const resolved = await this.resolve(source.slice(0, -5), importer, { skipSelf: true });
      return resolved ? `\0docs-code:${resolved.id.split('?')[0]}` : null;
    },
    load(id) {
      if (!id.startsWith('\0docs-code:')) return null;
      const entry = id.slice('\0docs-code:'.length);
      const files: CodeFile[] = collectFiles(entry).map((file) => {
        this.addWatchFile(file);
        const code = readFileSync(file, 'utf8').replace(/\s+$/, '') + '\n';
        const lang = langOf(file);
        return { name: basename(file), lang, code, html: highlight(code, lang) };
      });
      return `export default ${JSON.stringify(files)};`;
    },
  };
}
