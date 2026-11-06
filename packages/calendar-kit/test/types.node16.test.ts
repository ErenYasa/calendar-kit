/**
 * F01 regression: the emitted declarations must type-check for consumers that
 * use `moduleResolution: node16/nodenext` (relative imports in .d.ts need
 * explicit `.js` extensions there; otherwise every type silently becomes `any`
 * under `skipLibCheck: true`).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterAll, expect, it } from 'vitest';

const pkgRoot = resolve(__dirname, '..');
const tmp = join(pkgRoot, 'test', '.tmp-node16');
const tsc = resolve(pkgRoot, '../../node_modules/.bin/tsc');

afterAll(() => rmSync(tmp, { recursive: true, force: true }));

function run(args: string[]): string {
  try {
    return execFileSync(tsc, args, { cwd: pkgRoot, encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string };
    return `${err.stdout ?? ''}${err.stderr ?? ''}` || 'tsc failed';
  }
}

it('declarations type-check under moduleResolution node16 (strict, skipLibCheck false)', () => {
  rmSync(tmp, { recursive: true, force: true });
  const pkgDir = join(tmp, 'node_modules', 'calendar-kit');
  mkdirSync(pkgDir, { recursive: true });
  expect(run(['-p', 'tsconfig.build.json', '--outDir', join(pkgDir, 'types')])).toBe('');
  writeFileSync(
    join(pkgDir, 'package.json'),
    JSON.stringify({ name: 'calendar-kit', type: 'module', exports: { '.': { types: './types/index.d.ts', import: './index.js' } } }),
  );
  writeFileSync(join(pkgDir, 'index.js'), 'export {};\n');
  writeFileSync(join(tmp, 'package.json'), JSON.stringify({ name: 'consumer', type: 'module' }));
  writeFileSync(
    join(tmp, 'consumer.ts'),
    `import { type CalendarDate, type CalendarProps, Calendar, createSelectionEngine, toCalendarDate } from 'calendar-kit';
const d: CalendarDate = toCalendarDate('2026-11-13');
// @ts-expect-error plain strings are not CalendarDate
const bad: CalendarDate = '2026-11-13';
// @ts-expect-error activeEndpoint is not allowed in single mode
const p: CalendarProps = { mode: 'single', activeEndpoint: 'end' };
// @ts-expect-error Calendar must not be \`any\`
const c: { totallyWrong: true } = Calendar;
const e = createSelectionEngine({ rules: {}, state: { selection: { mode: 'single', value: d }, activeEndpoint: 'start' }, today: d });
export const ok: boolean = e.validate({ mode: 'single', value: d }).valid;
export { bad, p, c };
`,
  );
  writeFileSync(
    join(tmp, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM'],
        module: 'node16',
        moduleResolution: 'node16',
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        types: [],
      },
      files: ['consumer.ts'],
    }),
  );
  expect(run(['-p', join(tmp, 'tsconfig.json')])).toBe('');
}, 60_000);
