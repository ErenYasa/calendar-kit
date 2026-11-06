// Interaction performance of the calendar in a real browser.
//
//   npm run perf
//
// Builds the demo's bench page (apps/demo/bench.html: only the calendar inside
// a React Profiler) with the profiling build of react-dom, serves it, and
// drives the system Chrome with real mouse/keyboard input (playwright-core),
// optionally under CDP CPU throttling.
//
// Three separate measurements per interaction (they are NOT interchangeable):
// - render     : sum of React Profiler `actualDuration` for the commits caused
//                by the interaction = time React spent rendering the calendar
//                subtree (render phase only; memoised cells that bailed out are
//                not included; DOM mutation/commit work is not included).
// - input delay: event timestamp (OS input time) -> the event being dispatched
//                to the page. Browser queueing; Chrome aligns continuous input
//                (pointerover/move) to animation frames, so hover shows up to
//                one frame here. Not caused by the calendar.
// - processing : dispatch -> first DOM mutation observed after it
//                (MutationObserver callback). Covers React scheduling, render
//                and commit (DOM writes + layout effects).
// - next frame : event timestamp -> first task after the next animation frame
//                (rAF + setTimeout 0). Approximates input-to-next-paint; it
//                includes style/layout/paint of that frame plus queueing.
// Clicks are timed from the `click` event (the selection changes there); the
// `render` column still sums every commit of the interaction, including the
// small focus update on pointerdown.
import { build, preview } from 'vite';
import { chromium } from 'playwright-core';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATES = (process.env.RATES ?? '1,4,6').split(',').map(Number);
const MONTHS = (process.env.MONTHS ?? '2,12').split(',').map(Number);
const SAMPLES = Number(process.env.SAMPLES ?? 10);

const demo = fileURLToPath(new URL('../apps/demo/', import.meta.url));
const configFile = `${demo}vite.config.ts`;
const outDir = mkdtempSync(join(tmpdir(), 'cal-bench-'));
process.env.PROFILE = '1';
await build({ root: demo, configFile, logLevel: 'error', build: { outDir, emptyOutDir: true, rollupOptions: { input: { bench: `${demo}bench.html` } } } });
const server = await preview({ root: demo, configFile, logLevel: 'error', build: { outDir }, preview: { port: 4199, host: '127.0.0.1', strictPort: false } });
const base = server.resolvedUrls.local[0];
const browser = await chromium.launch({ channel: 'chrome' });
const chromeVersion = browser.version();

const instrument = () => {
  window.__ev = null;
  window.__res = [];
  for (const type of ['click', 'pointerover', 'keydown'])
    addEventListener(
      type,
      (e) => {
        if (type === 'pointerover' && !(e.target instanceof Element && e.target.closest('button[data-date]'))) return;
        window.__ev = { type, t: e.timeStamp, td: performance.now(), done: false };
      },
      true,
    );
  new MutationObserver(() => {
    const ev = window.__ev;
    if (!ev || ev.done) return;
    ev.done = true;
    const processing = performance.now() - ev.td;
    const inputDelay = ev.td - ev.t;
    requestAnimationFrame(() => setTimeout(() => window.__res.push({ inputDelay, processing, nextFrame: performance.now() - ev.t }), 0));
  }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
};

const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? s[Math.floor(s.length / 2)] : NaN;
};
const p95 = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? s[Math.min(s.length - 1, Math.ceil(s.length * 0.95) - 1)] : NaN;
};
const f = (n) => (Number.isFinite(n) ? n.toFixed(1) : '–');

const rows = [];
for (const months of MONTHS) {
  for (const rate of RATES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript(instrument);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await page.goto(`${base}bench.html?months=${months}`);
    await page.waitForSelector('.cal-root[data-measured]');
    await page.waitForTimeout(500);
    const samples = { 'start click': [], hover: [], 'end click': [], 'ArrowRight key': [], 'next month': [] };

    const measure = async (label, act) => {
      const before = await page.evaluate(() => ({ c: window.__commits.length, r: window.__res.length }));
      await act();
      const ok = await page
        .waitForFunction((n) => window.__res.length > n, before.r, { timeout: 3000 })
        .then(() => true)
        .catch(() => false);
      await page.waitForTimeout(60);
      if (!ok) return;
      const m = await page.evaluate((b) => ({ render: window.__commits.slice(b.c).reduce((s, c) => s + c.actual, 0), ...window.__res[b.r] }), before);
      samples[label].push(m);
    };
    const center = async (sel) => {
      const box = await page.locator(sel).first().boundingBox();
      return [box.x + box.width / 2, box.y + box.height / 2];
    };

    for (let k = 0; k < SAMPLES; k++) {
      const days = await page.$$eval('.cal-month:first-of-type button[data-date]:not([aria-disabled])', (b) => b.map((x) => x.dataset.date));
      const d = (i) => `button[data-date="${days[(i + k) % days.length]}"]`;
      await measure('start click', async () => page.mouse.click(...(await center(d(2)))));
      for (let h = 3; h < 6; h++) await measure('hover', async () => page.mouse.move(...(await center(d(h)))));
      await measure('end click', async () => page.mouse.click(...(await center(d(6)))));
      await measure('ArrowRight key', async () => page.keyboard.press('ArrowRight'));
      await measure('next month', async () => page.mouse.click(...(await center('.cal-nav-button[data-direction="next"]'))));
      await page.mouse.click(...(await center('.cal-nav-button[data-direction="previous"]')));
      await page.waitForTimeout(80);
    }
    const cells = await page.$$eval('button[data-date]', (b) => b.length);
    for (const [action, list] of Object.entries(samples))
      rows.push({
        months,
        cells,
        cpu: rate === 1 ? '1x' : `${rate}x slower`,
        action,
        n: list.length,
        'render ms (med/p95)': `${f(median(list.map((x) => x.render)))} / ${f(p95(list.map((x) => x.render)))}`,
        'input delay ms (med)': f(median(list.map((x) => x.inputDelay))),
        'processing ms (med/p95)': `${f(median(list.map((x) => x.processing)))} / ${f(p95(list.map((x) => x.processing)))}`,
        'next frame ms (med/p95)': `${f(median(list.map((x) => x.nextFrame)))} / ${f(p95(list.map((x) => x.nextFrame)))}`,
      });
    await page.close();
  }
}

await browser.close();
await server.close();
rmSync(outDir, { recursive: true, force: true });
console.log(`Chrome ${chromeVersion} · samples per action: ${SAMPLES} (hover: ${SAMPLES * 3})`);
console.table(rows);
