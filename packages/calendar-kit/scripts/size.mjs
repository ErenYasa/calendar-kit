// Measures minified + compressed size as a consumer's bundler would ship it.
// - full:    everything exported from the entry
// - typical: Calendar + stayRules + messagesTr (tree-shaken)
// - core:    headless engine + adapter + date helpers, no React
import { rolldown } from 'rolldown';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { compileString } from 'sass';

const root = resolve(import.meta.dirname, '..');
const tmp = mkdtempSync(join(tmpdir(), 'cal-size-'));
const cases = {
  full: `export * from '${root}/src/index.ts';`,
  typical: `export { Calendar, stayRules, messagesTr } from '${root}/src/index.ts';`,
  core: `export { createSelectionEngine, stayRules, parseDate } from '${root}/src/index.ts';`,
};
const kb = (n) => `${(n / 1024).toFixed(2)} kB`;
const row = (name, buf) => ({ bundle: name, min: kb(buf.length), gzip: kb(gzipSync(buf, { level: 9 }).length), brotli: kb(brotliCompressSync(buf).length) });
const rows = [];
try {
  for (const [name, code] of Object.entries(cases)) {
    const input = join(tmp, `${name}.js`);
    writeFileSync(input, code);
    const bundle = await rolldown({ input, external: [/^react/], transform: { jsx: 'react-jsx' }, logLevel: 'silent' });
    const { output } = await bundle.generate({ format: 'es', minify: true });
    rows.push(row(name, Buffer.from(output[0].code)));
  }
  const css = compileString(readFileSync(join(root, 'src/styles/index.scss'), 'utf8'), { style: 'compressed' }).css;
  rows.push(row('styles.css', Buffer.from(css)));
  console.table(rows);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
