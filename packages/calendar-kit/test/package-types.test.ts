/**
 * Consumer type resolution through the real `exports` map of package.json
 * (F36: `import 'calendar-kit/styles.css'` must resolve to a declaration in a
 * plain TypeScript project that declares no `*.css` modules; TypeScript 6+
 * reports unresolved side-effect imports by default).
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const pkgRoot = resolve(__dirname, '..');
const tmp = join(pkgRoot, 'test', '.tmp-package-types');
const pkgDir = join(tmp, 'node_modules', 'calendar-kit');
const tsc = resolve(pkgRoot, '../../node_modules/.bin/tsc');
const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'));

function run(args: string[]): string {
  try {
    return execFileSync(tsc, args, { cwd: tmp, encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string };
    return `${err.stdout ?? ''}${err.stderr ?? ''}` || 'tsc failed';
  }
}

/** Every file the exports map points at, emitted or stubbed like the build does. */
beforeAll(() => {
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(pkgDir, { recursive: true });
  writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: pkg.name, type: pkg.type, exports: pkg.exports }));
  execFileSync(tsc, ['-p', 'tsconfig.build.json', '--outDir', join(pkgDir, 'dist', 'types')], { cwd: pkgRoot });
  const targets = (node: unknown, out: string[] = []): string[] => {
    if (typeof node === 'string') out.push(node);
    else if (node && typeof node === 'object') for (const v of Object.values(node)) targets(v, out);
    return out;
  };
  for (const t of targets(pkg.exports)) {
    const file = join(pkgDir, t);
    if (t.endsWith('.d.ts') && !t.includes('/types/')) copyFileSync(join(pkgRoot, 'src/styles', t.split('/').pop()!), file);
    else if (t.endsWith('.js') || t.endsWith('.css')) {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, '');
    }
  }
  writeFileSync(join(tmp, 'package.json'), JSON.stringify({ name: 'consumer', type: 'module' }));
}, 60_000);
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

describe.each(['bundler', 'node16', 'nodenext'] as const)('plain TypeScript consumer (moduleResolution %s, no *.css declarations)', (resolution) => {
  it('F36 resolves the CSS side-effect import through the public export', () => {
    writeFileSync(join(tmp, `css-${resolution}.ts`), `import 'calendar-kit/styles.css';\nexport {};\n`);
    const config = join(tmp, `tsconfig.${resolution}.json`);
    writeFileSync(
      config,
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: resolution === 'bundler' ? 'ESNext' : resolution,
          moduleResolution: resolution,
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          noUncheckedSideEffectImports: true,
          types: [],
        },
        files: [`css-${resolution}.ts`],
      }),
    );
    expect(run(['-p', config])).toBe('');
    const trace = run(['-p', config, '--traceResolution']);
    expect(trace).toMatch(/'calendar-kit\/styles\.css' was successfully resolved to '[^']*node_modules\/calendar-kit\/dist\/styles\.css\.d\.ts'/);
  }, 60_000);

  it('core and client entry points are typed (not any)', () => {
    writeFileSync(
      join(tmp, `entries-${resolution}.ts`),
      `import { type CalendarDate, stayRules, toCalendarDate } from 'calendar-kit/core';
import { Calendar, type CalendarProps } from 'calendar-kit/client';
import { Calendar as Same } from 'calendar-kit';
const d: CalendarDate = toCalendarDate('2026-11-13');
// @ts-expect-error plain strings are not CalendarDate
const bad: CalendarDate = '2026-11-13';
// @ts-expect-error activeEndpoint is not allowed in single mode
const p: CalendarProps = { mode: 'single', activeEndpoint: 'end' };
// @ts-expect-error Calendar must not be \`any\`
const c: { totallyWrong: true } = Calendar;
// @ts-expect-error the core entry has no React component
import { Calendar as None } from 'calendar-kit/core';
export const same: typeof Calendar = Same;
export { d, bad, p, c, None, stayRules };
`,
    );
    const config = join(tmp, `tsconfig.entries-${resolution}.json`);
    writeFileSync(
      config,
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM'],
          module: resolution === 'bundler' ? 'ESNext' : resolution,
          moduleResolution: resolution,
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          types: [],
        },
        files: [`entries-${resolution}.ts`],
      }),
    );
    expect(run(['-p', config])).toBe('');
  }, 60_000);
});
