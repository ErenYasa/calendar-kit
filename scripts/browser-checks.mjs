// Real-browser regression checks for behaviour jsdom cannot verify (cascade on
// ::before, layout geometry, media queries). Starts the demo with Vite and
// drives the system Chrome through playwright-core (no browser download).
//
//   npm run test:browser            (all checks)
//   npm run test:browser -- F30     (only checks whose id matches)
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';

const only = process.argv.slice(2);
const demo = fileURLToPath(new URL('../apps/demo/', import.meta.url));
const server = await createServer({ root: demo, configFile: `${demo}vite.config.ts`, server: { port: 5199, strictPort: false, host: '127.0.0.1' }, logLevel: 'error' });
await server.listen();
const base = server.resolvedUrls.local[0];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];

async function check(id, title, fn) {
  if (only.length && !only.some((o) => id.includes(o))) return;
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    const detail = await fn(page);
    results.push({ id, title, ok: true, detail });
  } catch (e) {
    results.push({ id, title, ok: false, detail: String(e.message ?? e).split('\n')[0] });
  } finally {
    await page.close();
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const open = async (page, hash) => {
  await page.goto(`${base}#${hash}`);
  await page.waitForSelector(`#${hash} .cal-root[data-measured]`);
  await page.waitForTimeout(400);
};

await check('F06', 'focus ring visible on today', async (page) => {
  await open(page, 'f-today');
  await page.focus('#f-today .cal-nav-button');
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => document.activeElement?.closest('.cal-day')?.hasAttribute('data-today'))) break;
  }
  await page.waitForTimeout(250);
  const shadow = await page.evaluate(() => getComputedStyle(document.activeElement, '::before').boxShadow);
  assert(shadow.includes('37, 99, 235'), `focused today shadow: ${shadow}`);
  return shadow;
});

await check('F10', 'calendar-boundary tooltip below the weekday row', async (page) => {
  await open(page, 'f-tooltip');
  const out = [];
  for (const date of ['2026-10-01', '2026-10-04']) {
    await page.click(`#f-tooltip button[data-date="${date}"]`);
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const root = document.querySelector('#f-tooltip .cal-root');
      const t = document.getElementById(`${root.id}-tooltip`).getBoundingClientRect();
      const wk = root.querySelector('.cal-weekdays').getBoundingClientRect();
      const vp = root.querySelector('.cal-viewport').getBoundingClientRect();
      return { top: t.top, wkBottom: wk.bottom, inside: t.left >= vp.left - 0.5 && t.right <= vp.right + 0.5 };
    });
    assert(r.top >= r.wkBottom - 0.5 && r.inside, `${date}: ${JSON.stringify(r)}`);
    out.push(`${date} ok`);
  }
  return out.join(', ');
});

await check('F15', 'LTR calendar inside an RTL ancestor is not mirrored', async (page) => {
  await open(page, 'f-today');
  const t = await page.evaluate(() => {
    document.getElementById('f-today').setAttribute('dir', 'rtl');
    return getComputedStyle(document.querySelector('#f-today .cal-nav-button svg')).transform;
  });
  assert(t === 'none', `transform: ${t}`);
  return t;
});

await check('F17', 'reduced motion stops the skeleton shimmer', async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, 'f-loading');
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector('#f-loading section[data-status="loading"] .cal-day-button'), '::before').animationName);
  assert(anim === 'none', `animation: ${anim}`);
  return anim;
});

await check('F16', 'calendar-wide loading: initial skeleton (no visible text, reduced motion), refresh keeps the view', async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, 'f-loading');
  const box = '#f-loading';
  await page.uncheck(`${box} .cal-footer input[type=checkbox] >> nth=0`); // month data loaded
  // Initial load: the demo remounts the calendar with `loading` on for 1.5 s.
  await page.click(`${box} .cal-footer button`);
  await page.waitForTimeout(250);
  const r = await page.evaluate((box) => {
    const root = document.querySelector(`${box} .cal-root`);
    const btn = root.querySelector('.cal-month[data-skeleton] .cal-day-button');
    const status = root.querySelector('.cal-loading[role=status]');
    const visible = (el) => el.getBoundingClientRect().width > 1 && getComputedStyle(el).clip === 'auto';
    const pill = getComputedStyle(btn, '::before');
    const c = btn.getBoundingClientRect();
    return {
      busy: root.getAttribute('aria-busy'),
      statusText: status.textContent,
      statusVisible: visible(status),
      anim: pill.animationName,
      pill: pill.backgroundImage.slice(0, 15),
      number: getComputedStyle(btn.querySelector('.cal-day-content')).visibility,
      hit: document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2) === btn,
      footerHit: root.querySelector('.cal-footer button') === document.elementFromPoint(...(() => { const f = root.querySelector('.cal-footer button').getBoundingClientRect(); return [f.left + 4, f.top + 4]; })()),
    };
  }, box);
  assert(r.busy === 'true' && r.statusText && !r.statusVisible, JSON.stringify(r));
  assert(r.pill.startsWith('linear-gradient') && r.number === 'hidden', `no skeleton: ${JSON.stringify(r)}`);
  assert(r.anim === 'none', `reduced motion ignored: ${r.anim}`);
  assert(!r.hit && r.footerHit, `pointer: day hit ${r.hit}, footer reachable ${r.footerHit}`);
  // After data was shown, calendar-wide loading is a background refresh.
  await page.waitForFunction((box) => !document.querySelector(`${box} .cal-month[data-skeleton]`), box, { timeout: 4000 });
  await page.focus(`${box} .cal-day-button[data-date]:not([aria-disabled])`);
  const focused = await page.evaluate(() => document.activeElement?.dataset.date);
  const months = await page.$$eval(`${box} .cal-month`, (m) => m.map((x) => x.dataset.month).join());
  await page.evaluate((box) => document.querySelectorAll(`${box} .cal-footer input[type=checkbox]`)[2].click(), box);
  await page.waitForTimeout(200);
  const after = await page.evaluate((box) => ({
    focused: document.activeElement?.dataset.date,
    months: [...document.querySelectorAll(`${box} .cal-month`)].map((x) => x.dataset.month).join(),
    skeleton: document.querySelectorAll(`${box} .cal-month[data-skeleton]`).length,
    busy: document.querySelector(`${box} .cal-root`).getAttribute('aria-busy'),
  }), box);
  assert(after.focused === focused && after.months === months && after.skeleton === 0 && after.busy === 'true', JSON.stringify({ focused, months, ...after }));
  return `initial: skeleton, sr-only text, animation ${r.anim}; refresh kept ${focused}`;
});

await check('F21', 'root tooltip theme reaches the portalled tooltip', async (page) => {
  await open(page, 'f-today');
  const bg = await page.evaluate(async () => {
    const r = document.querySelector('#f-today .cal-root');
    r.style.setProperty('--cal-tooltip-bg', 'rgb(20, 20, 20)');
    return r.id;
  });
  await page.hover('#f-today .cal-day[data-today] button');
  await page.waitForTimeout(250);
  const actual = await page.evaluate((id) => getComputedStyle(document.getElementById(`${id}-tooltip`)).backgroundColor, bg);
  assert(actual === 'rgb(20, 20, 20)', `background: ${actual}`);
  return actual;
});

await check('F30', 'day label stays inside the circle at the minimum cell size', async (page) => {
  await open(page, 'boat-weekend');
  await page.click('#boat-weekend input[role=switch]');
  await page.evaluate(() => (document.querySelector('#boat-weekend .cal-root').style.width = '300px'));
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const out = [];
    for (const btn of document.querySelectorAll('#boat-weekend .cal-day-button')) {
      const lbl = btn.querySelector('.cal-day-label');
      if (!lbl) continue;
      const cell = btn.getBoundingClientRect();
      const L = lbl.getBoundingClientRect();
      const rad = (0.84 * Math.min(cell.width, cell.height)) / 2;
      const cx = cell.left + cell.width / 2;
      const cy = cell.top + cell.height / 2;
      const outside = [[L.left, L.top], [L.right, L.top], [L.left, L.bottom], [L.right, L.bottom]].filter(([x, y]) => Math.hypot(x - cx, y - cy) > rad - 1.5).length; // inside the 1.5px today ring
      out.push({ cell: Math.round(cell.height), outside });
    }
    return out;
  });
  const bad = r.filter((x) => x.outside > 0);
  assert(r.length > 0 && r[0].cell <= 42, `cells not at minimum size: ${JSON.stringify(r[0])}`);
  assert(bad.length === 0, `${bad.length}/${r.length} labels cross the ring`);
  return `${r.length} labels inside ${r[0].cell}px cells`;
});

await check('F34', 'shared weekday row: no overflow beyond the calendar, aligned with scrolled months', async (page) => {
  await open(page, 'playground');
  await page.selectOption('#playground select >> nth=0', 'vertical');
  await page.selectOption('#playground select >> nth=1', 'continuous');
  await page.evaluate(() => {
    const r = document.querySelector('#playground .resizable');
    r.style.overflow = 'visible';
    r.style.width = '220px';
  });
  await page.setViewportSize({ width: 260, height: 900 });
  await page.waitForTimeout(400);
  // The calendar must not widen its container (the rest of the demo page may).
  const overflow = await page.evaluate(() => {
    const root = document.querySelector('#playground .cal-root');
    return root.scrollWidth - root.clientWidth;
  });
  assert(overflow <= 0, `calendar content overflows its root by ${overflow}px`);
  await page.evaluate(() => (document.querySelector('#playground .cal-viewport').scrollLeft = 60));
  await page.waitForTimeout(150);
  const a = await page.evaluate(() => {
    const root = document.querySelector('#playground .cal-root');
    const wk = root.querySelector(':scope > .cal-weekdays').children[0].getBoundingClientRect();
    const day = root.querySelector('.cal-week > *').getBoundingClientRect();
    return { weekday: wk.left, day: day.left, width: day.width };
  });
  assert(Math.abs(a.weekday - a.day) <= 1, `column 0 misaligned: weekday ${a.weekday} vs day ${a.day}`);
  return 'aligned, no overflow';
});

await check('F35', 'tooltip in a transformed portal container stays on its anchor', async (page) => {
  await open(page, 'f-tooltip');
  await page.check('#f-tooltip .controls input[type=checkbox]');
  await page.click('#f-tooltip button[data-date="2026-10-14"]');
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const root = document.querySelector('#f-tooltip .cal-root');
    const tip = document.getElementById(`${root.id}-tooltip`);
    const t = tip.getBoundingClientRect();
    const arrow = tip.querySelector('.cal-tooltip-arrow').getBoundingClientRect();
    const a = root.querySelector('button[data-date="2026-10-14"]').getBoundingClientRect();
    const place = tip.dataset.placement;
    const gap = place === 'top' ? a.top - t.bottom : place === 'bottom' ? t.top - a.bottom : place === 'left' ? a.left - t.right : t.left - a.right;
    const arrowOff = place === 'top' || place === 'bottom' ? arrow.left + arrow.width / 2 - (a.left + a.width / 2) : arrow.top + arrow.height / 2 - (a.top + a.height / 2);
    return { place, inHost: !!tip.closest('.transformed-host'), gap: Math.round(gap), arrowOff: Math.round(arrowOff) };
  });
  assert(r.inHost, 'tooltip is not portalled into the transformed container');
  assert(Math.abs(r.gap - 8) <= 2 && Math.abs(r.arrowOff) <= 2, JSON.stringify(r));
  return JSON.stringify(r);
});

await browser.close();
await server.close();
console.table(results.map((r) => ({ id: r.id, ok: r.ok ? 'PASS' : 'FAIL', title: r.title, detail: r.detail })));
process.exit(results.every((r) => r.ok) ? 0 : 1);
