// Real-browser regression checks for behaviour jsdom cannot verify (cascade on
// ::before, layout geometry, media queries), run against the examples of the
// docs site (apps/demo), plus checks of the docs site itself (D*). Starts the
// demo with Vite and drives the system Chrome through playwright-core.
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
// Opens a docs page (`#/route`) and waits for one of its examples
// (`<figure id="ex-…">`). Examples follow the real today.
const open = async (page, route, ex) => {
  await page.goto(`${base}#/${route}`);
  await page.waitForSelector(`#${ex} .cal-root[data-measured]`);
  await page.waitForTimeout(400);
};

await check('F06', 'focus ring visible on today', async (page) => {
  await open(page, 'selection-modes', 'ex-features-modesingle');
  await page.focus('#ex-features-modesingle .cal-nav-button');
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
  await open(page, 'tooltip', 'ex-features-tooltip');
  // First and last day of the first week row of the second (future) month:
  // right below the weekday row, and every future day has a tooltip there.
  const row = await page.$eval('#ex-features-tooltip .cal-month:nth-of-type(2) .cal-week', (w) => [...w.querySelectorAll('button[data-date]')].map((x) => x.dataset.date));
  const out = [];
  for (const date of new Set([row[0], row[row.length - 1]])) {
    await page.click(`#ex-features-tooltip button[data-date="${date}"]`);
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const root = document.querySelector('#ex-features-tooltip .cal-root');
      const t = document.getElementById(`${root.id}-tooltip`).getBoundingClientRect();
      const wk = root.querySelector('.cal-month:nth-of-type(2) .cal-weekdays').getBoundingClientRect();
      const vp = root.querySelector('.cal-viewport').getBoundingClientRect();
      return { top: t.top, wkBottom: wk.bottom, inside: t.left >= vp.left - 0.5 && t.right <= vp.right + 0.5 };
    });
    assert(r.top >= r.wkBottom - 0.5 && r.inside, `${date}: ${JSON.stringify(r)}`);
    out.push(`${date} ok`);
  }
  return out.join(', ');
});

await check('F15', 'LTR calendar inside an RTL ancestor is not mirrored', async (page) => {
  await open(page, 'selection-modes', 'ex-features-modesingle');
  const t = await page.evaluate(() => {
    document.getElementById('ex-features-modesingle').setAttribute('dir', 'rtl');
    return getComputedStyle(document.querySelector('#ex-features-modesingle .cal-nav-button svg')).transform;
  });
  assert(t === 'none', `transform: ${t}`);
  return t;
});

await check('F17', 'reduced motion stops the skeleton shimmer', async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, 'loading', 'ex-features-monthdata');
  // Months not requested yet start loading as soon as they are rendered.
  await page.click('#ex-features-monthdata .cal-nav-button[data-direction="next"]');
  await page.click('#ex-features-monthdata .cal-nav-button[data-direction="next"]');
  const sel = '#ex-features-monthdata section[data-status="loading"] .cal-day-button';
  await page.waitForSelector(sel, { timeout: 2000 });
  const anim = await page.evaluate((sel) => getComputedStyle(document.querySelector(sel), '::before').animationName, sel);
  assert(anim === 'none', `animation: ${anim}`);
  return anim;
});

await check('F16', 'calendar-wide loading: initial skeleton (no visible text, reduced motion), refresh keeps the view', async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const box = '#ex-features-initialload';
  await open(page, 'loading', box.slice(1));
  // Initial load: the example remounts the calendar with `loading` on for 3 s.
  await page.click(`${box} button:text("Reload (initial load)")`);
  await page.waitForTimeout(250);
  const r = await page.evaluate((box) => {
    const root = document.querySelector(`${box} .cal-root`);
    const btn = root.querySelector('.cal-month[data-skeleton] .cal-day-button');
    const status = root.querySelector('.cal-loading[role=status]');
    const visible = (el) => el.getBoundingClientRect().width > 1 && getComputedStyle(el).clip === 'auto';
    const pill = getComputedStyle(btn, '::before');
    return {
      busy: root.getAttribute('aria-busy'),
      statusText: status.textContent,
      statusVisible: visible(status),
      anim: pill.animationName,
      pill: pill.backgroundImage.slice(0, 15),
      number: getComputedStyle(btn.querySelector('.cal-day-content')).visibility,
      controlHit: (() => {
        const b = [...document.querySelectorAll(`${box} button`)].find((x) => x.textContent.startsWith('Reload'));
        const f = b.getBoundingClientRect();
        return document.elementFromPoint(f.left + 4, f.top + 4) === b;
      })(),
    };
  }, box);
  assert(r.busy === 'true' && r.statusText && !r.statusVisible, JSON.stringify(r));
  assert(r.pill.startsWith('linear-gradient') && r.number === 'hidden', `no skeleton: ${JSON.stringify(r)}`);
  assert(r.anim === 'none', `reduced motion ignored: ${r.anim}`);
  assert(r.controlHit, 'controls next to the calendar are not reachable during the initial load');
  // No selection from pointer or keyboard while no data is known.
  const day = `${box} .cal-month[data-skeleton] .cal-day-button[data-date]`;
  const t0 = Date.now();
  // force: the days are aria-disabled now, which Playwright would wait out; a user can still click them.
  await page.click(day, { force: true });
  const tClick = Date.now() - t0;
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  const sel = await page.evaluate((box) => ({
    selected: document.querySelectorAll(`${box} .cal-day[data-selected]`).length,
    focusMoved: document.activeElement?.closest('.cal-month') != null,
    stillLoading: document.querySelectorAll(`${box} .cal-month[data-skeleton]`).length > 0,
  }), box);
  assert(sel.stillLoading, `initial load ended before the selection attempts (check is invalid; click took ${tClick} ms)`);
  assert(sel.selected === 0 && sel.focusMoved, `initial load selection: ${JSON.stringify(sel)}`);
  // After data was shown, calendar-wide loading is a background refresh.
  await page.waitForFunction((box) => !document.querySelector(`${box} .cal-month[data-skeleton]`), box, { timeout: 4000 });
  await page.focus(`${box} .cal-day-button[data-date]:not([aria-disabled])`);
  const focused = await page.evaluate(() => document.activeElement?.dataset.date);
  const months = await page.$$eval(`${box} .cal-month`, (m) => m.map((x) => x.dataset.month).join());
  // A programmatic click keeps keyboard focus on the day (as a refresh triggered elsewhere would).
  await page.evaluate((box) => [...document.querySelectorAll(`${box} button`)].find((b) => b.textContent === 'Refresh in background').click(), box);
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
  await open(page, 'selection-modes', 'ex-features-modesingle');
  const bg = await page.evaluate(async () => {
    const r = document.querySelector('#ex-features-modesingle .cal-root');
    r.style.setProperty('--cal-tooltip-bg', 'rgb(20, 20, 20)');
    return r.id;
  });
  await page.hover('#ex-features-modesingle .cal-day[data-today] button');
  await page.waitForTimeout(250);
  const actual = await page.evaluate((id) => getComputedStyle(document.getElementById(`${id}-tooltip`)).backgroundColor, bg);
  assert(actual === 'rgb(20, 20, 20)', `background: ${actual}`);
  return actual;
});

await check('F30', 'day label stays inside the circle at the minimum cell size (also with badge/icon, F38)', async (page) => {
  await open(page, 'day-content', 'ex-features-daycontent');
  await page.evaluate(() => (document.querySelector('#ex-features-daycontent .cal-root').style.width = '300px'));
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const out = [];
    for (const btn of document.querySelectorAll('#ex-features-daycontent .cal-day-button')) {
      const lbl = btn.querySelector('.cal-day-label');
      // Every label, with or without a badge or icon (F38).
      if (!lbl) continue;
      const cell = btn.getBoundingClientRect();
      const L = lbl.getBoundingClientRect();
      const rad = (0.84 * Math.min(cell.width, cell.height)) / 2;
      const cx = cell.left + cell.width / 2;
      const cy = cell.top + cell.height / 2;
      const outside = [[L.left, L.top], [L.right, L.top], [L.left, L.bottom], [L.right, L.bottom]].filter(([x, y]) => Math.hypot(x - cx, y - cy) > rad - 1.5).length; // inside the 1.5px today ring
      const icon = btn.querySelector('.cal-day-icon')?.getBoundingClientRect();
      const iconOut = icon ? icon.left < cell.left - 0.5 || icon.top < cell.top - 0.5 || icon.right > cell.right + 0.5 || icon.bottom > cell.bottom + 0.5 : false;
      out.push({ cell: Math.round(cell.height), outside: outside + (iconOut ? 1 : 0), date: btn.dataset.date, text: btn.textContent });
    }
    return out;
  });
  const bad = r.filter((x) => x.outside > 0);
  assert(r.length > 0 && r[0].cell <= 42, `cells not at minimum size: ${JSON.stringify(r[0])}`);
  assert(bad.length === 0, `${bad.length}/${r.length} labels cross the ring: ${JSON.stringify(bad)}`);
  return `${r.length} labels inside ${r[0].cell}px cells`;
});

await check('F34', 'shared weekday row: no overflow beyond the calendar, aligned with scrolled months', async (page) => {
  // Vertical continuous calendar (shared weekday row) squeezed below its minimum width.
  const ex = '#ex-features-loadmore';
  await open(page, 'load-more', ex.slice(1));
  await page.evaluate((ex) => {
    const host = document.querySelector(`${ex} .cal-root`).parentElement;
    host.style.maxWidth = 'none';
    host.style.width = '220px';
  }, ex);
  await page.setViewportSize({ width: 260, height: 900 });
  await page.waitForTimeout(400);
  // The calendar must not widen its container (the rest of the page may).
  const overflow = await page.evaluate((ex) => {
    const root = document.querySelector(`${ex} .cal-root`);
    return root.scrollWidth - root.clientWidth;
  }, ex);
  assert(overflow <= 0, `calendar content overflows its root by ${overflow}px`);
  await page.evaluate((ex) => (document.querySelector(`${ex} .cal-viewport`).scrollLeft = 60), ex);
  await page.waitForTimeout(150);
  const a = await page.evaluate((ex) => {
    const root = document.querySelector(`${ex} .cal-root`);
    const wk = root.querySelector(':scope > .cal-weekdays').children[0].getBoundingClientRect();
    const day = root.querySelector('.cal-week > *').getBoundingClientRect();
    return { weekday: wk.left, day: day.left, width: day.width };
  }, ex);
  assert(Math.abs(a.weekday - a.day) <= 1, `column 0 misaligned: weekday ${a.weekday} vs day ${a.day}`);
  return 'aligned, no overflow';
});

await check('F35', 'tooltip in a transformed portal container stays on its anchor', async (page) => {
  // Modal example: the tooltip portal goes into the <dialog>; a transform on the
  // dialog (as animated or translate-centred modals have) makes it the
  // containing block of the fixed tooltip.
  await page.goto(`${base}#/placement`);
  await page.click('#ex-features-modal button:text("Choose dates")');
  await page.waitForSelector('dialog[open] .cal-root[data-measured]');
  await page.evaluate(() => (document.querySelector('dialog[open]').style.transform = 'translate(10px, 20px)'));
  await page.waitForTimeout(200);
  await page.hover('dialog[open] .cal-day[data-today] button');
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const root = document.querySelector('dialog[open] .cal-root');
    const tip = document.getElementById(`${root.id}-tooltip`);
    const t = tip.getBoundingClientRect();
    const arrow = tip.querySelector('.cal-tooltip-arrow').getBoundingClientRect();
    const a = root.querySelector('.cal-day[data-today] button').getBoundingClientRect();
    const place = tip.dataset.placement;
    const gap = place === 'top' ? a.top - t.bottom : place === 'bottom' ? t.top - a.bottom : place === 'left' ? a.left - t.right : t.left - a.right;
    const arrowOff = place === 'top' || place === 'bottom' ? arrow.left + arrow.width / 2 - (a.left + a.width / 2) : arrow.top + arrow.height / 2 - (a.top + a.height / 2);
    return { place, inDialog: !!tip.closest('dialog'), text: tip.textContent, gap: Math.round(gap), arrowOff: Math.round(arrowOff), height: Math.round(t.height) };
  });
  assert(r.inDialog, 'tooltip is not portalled into the dialog');
  // Its width must not follow the container's (a one-word tooltip stays on one line).
  assert(r.height <= 48, `tooltip wrapped: ${r.height}px tall`);
  assert(Math.abs(r.gap - 8) <= 2 && Math.abs(r.arrowOff) <= 2, JSON.stringify(r));
  return JSON.stringify(r);
});

// ---------------------------------------------------------------- docs site

await check('D05', 'renderDay numbers are visibly drawn on selected, in-range, hovered, focused and disabled days', async (page) => {
  const ex = '#ex-styling-renderday';
  await open(page, 'styling', ex.slice(1));
  const days = await page.$$eval(`${ex} .cal-month:nth-of-type(2) button[data-date]`, (b) => b.map((x) => x.dataset.date));
  const sel = (d) => `${ex} button[data-date="${d}"]`;
  await page.click(sel(days[3]));
  await page.click(sel(days[8]));
  // A day whose text is painted looks different once its text is made transparent.
  // Pixels that clearly change when the day's text is made transparent = text
  // actually painted (not hidden under the selection circle). Decoding happens
  // in the page; a few antialiasing pixels of noise are ignored.
  const changedPixels = (a, b) =>
    page.evaluate(async ([a, b]) => {
      const pixels = async (b64) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const c = Object.assign(document.createElement('canvas'), { width: img.width, height: img.height });
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0);
        return g.getImageData(0, 0, c.width, c.height).data;
      };
      const [pa, pb] = await Promise.all([pixels(a), pixels(b)]);
      let n = 0;
      for (let i = 0; i < pa.length; i += 4) if (Math.abs(pa[i] - pb[i]) + Math.abs(pa[i + 1] - pb[i + 1]) + Math.abs(pa[i + 2] - pb[i + 2]) > 90) n++;
      return n;
    }, [a.toString('base64'), b.toString('base64')]);
  const visible = async (d, prepare) => {
    await page.mouse.move(0, 0);
    if (prepare) await prepare();
    await page.waitForTimeout(300);
    const shot = () => page.locator(sel(d)).screenshot({ animations: 'disabled', caret: 'hide' });
    const withText = await shot();
    await page.$eval(sel(d), (el) => (el.style.color = 'transparent'));
    await page.waitForTimeout(50);
    const withoutText = await shot();
    await page.$eval(sel(d), (el) => (el.style.color = ''));
    return (await changedPixels(withText, withoutText)) >= 12;
  };
  const past = await page.$eval(`${ex} button[data-date][data-past]`, (b) => b.dataset.date).catch(() => null);
  const results = {
    start: await visible(days[3]),
    end: await visible(days[8]),
    inRange: await visible(days[5]),
    hovered: await visible(days[12], () => page.hover(sel(days[12]))),
    focused: await visible(days[14], async () => {
      await page.focus(sel(days[13]));
      await page.keyboard.press('ArrowRight');
    }),
    ...(past ? { disabled: await visible(past) } : {}),
  };
  const hidden = Object.entries(results).filter(([, v]) => !v).map(([k]) => k);
  assert(hidden.length === 0, `numbers not visible on: ${hidden.join(', ')}`);
  return Object.keys(results).join(', ');
});


const ROUTES = await (async () => {
  const page = await browser.newPage();
  await page.goto(base);
  await page.waitForSelector('#docs-nav a');
  const routes = await page.$$eval('#docs-nav a', (as) => as.map((a) => a.getAttribute('href').slice(2)));
  await page.close();
  return routes;
})();

await check('D01', 'every page renders its examples without errors', async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  let examples = 0;
  for (const route of ROUTES) {
    await page.goto(`${base}#/${route}`);
    // The heading of this page (pages load lazily; the previous page may still be shown).
    await page.waitForSelector(`[data-page="${route}"] .docs-page h1`);
    // Each example renders a calendar, except dialog/popover ones, which render a button until opened.
    const figures = await page.$$eval('figure.docs-example', (f) => f.map((x) => x.id));
    for (const id of figures) {
      await page
        .waitForSelector(`#${id} .docs-preview [data-measured], #${id} .docs-preview > div > button`, { timeout: 8000 })
        .catch(() => errors.push(`${route}: ${id} did not render`));
      examples++;
    }
  }
  assert(errors.length === 0, errors.slice(0, 3).join(' | '));
  return `${ROUTES.length} pages, ${examples} examples`;
});

await check('D02', 'sidebar navigation: current page, heading focus, previous/next', async (page) => {
  await page.goto(`${base}#/introduction`);
  await page.click('#docs-nav a[href="#/tooltip"]');
  await page.waitForSelector('#ex-features-tooltip .cal-root');
  await page.waitForTimeout(100);
  const r = await page.evaluate(() => ({
    current: document.querySelector('#docs-nav a[aria-current="page"]')?.getAttribute('href'),
    focus: document.activeElement?.id,
    title: document.title,
  }));
  assert(r.current === '#/tooltip' && r.focus === 'page-title' && r.title.startsWith('Tooltip'), JSON.stringify(r));
  return JSON.stringify(r);
});

await check('D03', 'mobile menu: hidden by default, toggles, Escape returns focus, no page overflow', async (page) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${base}#/introduction`);
  await page.waitForSelector('.docs-page h1');
  const hidden = await page.isHidden('#docs-nav');
  const click = (sel) => page.click(sel, { timeout: 5000 }).catch((e) => {
    throw new Error(`cannot click ${sel}: ${String(e.message).split('\n').filter((l) => /intercept|not visible|outside|not stable|detached/.test(l)).slice(0, 2).join(' ')}`);
  });
  await click('.docs-menu-button');
  const open = await page.evaluate(() => ({ visible: getComputedStyle(document.getElementById('docs-nav')).display !== 'none', expanded: document.querySelector('.docs-menu-button').getAttribute('aria-expanded') }));
  await page.keyboard.press('Escape');
  const afterEsc = await page.evaluate(() => ({ focus: document.activeElement?.className, hidden: getComputedStyle(document.getElementById('docs-nav')).display === 'none' }));
  await click('.docs-menu-button');
  await click('#docs-nav a[href="#/recipe-home-rental"]');
  await page.waitForSelector('#ex-recipes-homerental .cal-root[data-measured]');
  await page.waitForTimeout(300);
  const nav = await page.evaluate(() => ({ closed: getComputedStyle(document.getElementById('docs-nav')).display === 'none', hash: location.hash }));
  assert(hidden && open.visible && open.expanded === 'true', `toggle: ${JSON.stringify({ hidden, open })}`);
  assert(afterEsc.hidden && afterEsc.focus.includes('docs-menu-button'), `escape: ${JSON.stringify(afterEsc)}`);
  assert(nav.closed && nav.hash === '#/recipe-home-rental', `navigate: ${JSON.stringify(nav)}`);
  const wide = [];
  for (const route of ROUTES) {
    await page.goto(`${base}#/${route}`);
    await page.waitForSelector(`[data-page="${route}"] .docs-page h1`, { timeout: 8000 }).catch(() => {
      throw new Error(`${route} did not render`);
    });
    await page.waitForTimeout(250);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 0) wide.push(`${route} +${over}px`);
  }
  assert(wide.length === 0, `horizontal page overflow at 375px: ${wide.join(', ')}`);
  return `menu ok, ${ROUTES.length} pages fit 375px`;
});

await check('D09', 'language switch: English first, EN/TR toggle keeps the page, lang/title update, choice stored, View code in Turkish', async (page) => {
  await page.goto(`${base}#/tooltip`);
  await page.waitForSelector('#ex-features-tooltip .cal-root[data-measured]');
  const first = await page.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, pressed: document.querySelector('.docs-lang-button[aria-pressed="true"]')?.textContent }));
  assert(first.lang === 'en' && first.pressed === 'EN' && first.title.startsWith('Tooltip'), `first visit: ${JSON.stringify(first)}`);
  // Keyboard: Tab from EN to TR and press Enter; focus stays on TR.
  await page.focus('.docs-lang-button[lang="en"]');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForSelector('[data-page="tooltip"][data-lang="tr"] .docs-page h1');
  await page.waitForSelector('#ex-features-tooltip .cal-root[data-measured]');
  const tr = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    hash: location.hash,
    h1: document.querySelector('.docs-page h1')?.textContent,
    focus: document.activeElement?.getAttribute('lang'),
    pressed: document.querySelector('.docs-lang-button[aria-pressed="true"]')?.textContent,
    nav: document.querySelector('#docs-nav a[href="#/tooltip"]')?.textContent,
    untranslated: document.querySelectorAll('.docs-untranslated').length,
  }));
  assert(tr.lang === 'tr' && tr.hash === '#/tooltip' && tr.pressed === 'TR' && tr.focus === 'tr', `switch: ${JSON.stringify(tr)}`);
  assert(tr.title === `${tr.h1} — calendar-kit` && tr.h1 !== 'Tooltip' && tr.nav === tr.h1, `texts: ${JSON.stringify(tr)}`);
  assert(tr.untranslated === 0, 'an example on the Turkish page has no Turkish version');
  // View code shows the Turkish example file.
  await page.click('#ex-features-tooltip .docs-example-bar button');
  await page.waitForSelector('#ex-features-tooltip .docs-code');
  const code = await page.evaluate(() => ({
    button: document.querySelector('#ex-features-tooltip .docs-example-bar button')?.textContent,
    file: document.querySelector('#ex-features-tooltip .docs-code-file, #ex-features-tooltip [role=tab][aria-selected=true]')?.textContent,
    copy: document.querySelector('#ex-features-tooltip .docs-copy')?.textContent,
  }));
  assert(code.button === 'Kodu gizle' && /\.tr\.tsx$/.test(code.file ?? '') && code.copy === 'Kopyala', `view code: ${JSON.stringify(code)}`);
  // Stored: a reload and another page stay Turkish; switching back restores English on the same page.
  await page.reload();
  await page.waitForSelector('[data-page="tooltip"][data-lang="tr"] .docs-page h1');
  await page.goto(`${base}#/selection-modes`);
  await page.waitForSelector('[data-page="selection-modes"][data-lang="tr"] .docs-page h1');
  await page.click('.docs-lang-button[lang="en"]');
  await page.waitForSelector('[data-page="selection-modes"][data-lang="en"] .docs-page h1');
  const back = await page.evaluate(() => ({ lang: document.documentElement.lang, stored: localStorage.getItem('calendar-kit-docs-lang'), hash: location.hash }));
  assert(back.lang === 'en' && back.stored === 'en' && back.hash === '#/selection-modes', `back: ${JSON.stringify(back)}`);
  return `tr: "${tr.h1}", view code ${code.file}, stored`;
});

await check('D10', 'Turkish: every page renders its examples without errors, no untranslated example, no overflow at 375px', async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`${base}#/introduction`);
  await page.evaluate(() => localStorage.setItem('calendar-kit-docs-lang', 'tr'));
  await page.reload(); // the stored language is read on load
  await page.waitForSelector('[data-lang="tr"] .docs-page h1');
  let examples = 0;
  const untranslated = [];
  const wide = [];
  let headerFits = true;
  for (const [w, h] of [[1280, 900], [375, 800]]) {
    await page.setViewportSize({ width: w, height: h });
    for (const route of ROUTES) {
      await page.goto(`${base}#/${route}`);
      await page.waitForSelector(`[data-page="${route}"][data-lang="tr"] .docs-page h1`);
      const figures = await page.$$eval('figure.docs-example', (f) => f.map((x) => x.id));
      for (const id of figures) {
        await page
          .waitForSelector(`#${id} .docs-preview [data-measured], #${id} .docs-preview > div > button`, { timeout: 8000 })
          .catch(() => errors.push(`${route}: ${id} did not render`));
        if (w > 400) examples++;
      }
      if ((await page.$$('.docs-untranslated')).length) untranslated.push(route);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) wide.push(`${w}px ${route} +${over}px`);
    }
    // The header (brand, language switch, menu button) fits the viewport.
    headerFits &&= await page.evaluate(() =>
      [...document.querySelectorAll('.docs-header > *:not(.docs-skip)')]
        .filter((e) => getComputedStyle(e).display !== 'none')
        .every((e) => e.getBoundingClientRect().right <= document.documentElement.clientWidth + 0.5),
    );
  }
  assert(errors.length === 0, errors.slice(0, 3).join(' | '));
  assert(untranslated.length === 0, `examples without a Turkish version on: ${untranslated.join(', ')}`);
  assert(wide.length === 0, `horizontal overflow: ${wide.join(', ')}`);
  assert(headerFits, 'header items overflow');
  return `${ROUTES.length} pages × 2 widths, ${examples} examples`;
});

await check('D06','sidebar: the last item is reachable and clickable at short heights (desktop and mobile)', async (page) => {
  // Slow CPU (as on CI runners): navigation must not close a menu opened right after it.
  await (await page.context().newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: 6 });
  const out = [];
  for (const [w, h] of [[1280, 900], [1280, 420], [1000, 360], [375, 560], [375, 420]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${base}#/introduction`);
    await page.waitForSelector('[data-page="introduction"] .docs-page h1');
    await page.waitForTimeout(100);
    if (w < 860) await page.click('.docs-menu-button');
    const last = await page.evaluate(async () => {
      const nav = document.getElementById('docs-nav');
      nav.scrollTop = nav.scrollHeight;
      await new Promise((r) => setTimeout(r, 100));
      const a = [...nav.querySelectorAll('a')].at(-1);
      const r = a.getBoundingClientRect();
      return { href: a.getAttribute('href'), bottom: r.bottom, navBottom: nav.getBoundingClientRect().bottom, vh: innerHeight, hit: document.elementFromPoint(r.left + 4, r.top + r.height / 2) === a };
    });
    assert(last.hit && last.bottom <= last.vh && last.navBottom <= last.vh, `${w}x${h}: ${JSON.stringify(last)}`);
    await page.click(`#docs-nav a[href="${last.href}"]`);
    await page.waitForFunction((h) => location.hash === h, last.href);
    out.push(`${w}x${h}`);
  }
  return out.join(', ');
});

await check('D07', 'mobile menu: background does not scroll, scroll position and styles restored, closes on Escape/backdrop/selection', async (page) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto(`${base}#/api-props`);
  await page.waitForSelector('[data-page="api-props"] .docs-page h1');
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 600));
  assert((await page.evaluate(() => Math.round(scrollY))) === 600, 'page too short for the scroll test');
  // Real pointer clicks: page.click() would first scroll the sticky header button "into view".
  const menuButton = async () => {
    const b = await page.locator('.docs-menu-button').boundingBox();
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(100);
  };
  const state = () => page.evaluate(() => ({ y: Math.round(scrollY), overflow: document.documentElement.style.overflow, open: !!document.querySelector('#docs-nav[data-open]'), focus: document.activeElement?.className || document.activeElement?.tagName }));
  await menuButton();
  const opened = await state();
  // Wheel over the menu scrolls the menu, not the page; wheel over the backdrop does not scroll the page.
  const navBox = await page.locator('#docs-nav').boundingBox();
  await page.mouse.move(navBox.x + 40, navBox.y + 200);
  await page.mouse.wheel(0, 800);
  await page.mouse.move(navBox.x + navBox.width + 20, navBox.y + 200);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(300);
  const scrolled = await page.evaluate(() => ({ y: Math.round(scrollY), nav: document.getElementById('docs-nav').scrollTop }));
  await page.keyboard.press('Escape');
  const afterEsc = await state();
  await menuButton();
  await page.mouse.click(370, 400); // backdrop
  const afterBackdrop = await state();
  await menuButton();
  await page.click('#docs-nav a[href="#/tooltip"]');
  await page.waitForSelector('#ex-features-tooltip');
  const afterSelect = await state();
  assert(opened.open && opened.overflow === 'hidden' && opened.y === 600 && /^A$/.test(opened.focus), `open: ${JSON.stringify(opened)}`);
  assert(scrolled.y === 600 && scrolled.nav > 0, `background scrolled: ${JSON.stringify(scrolled)}`);
  assert(!afterEsc.open && afterEsc.overflow === '' && afterEsc.y === 600 && afterEsc.focus.includes('docs-menu-button'), `escape: ${JSON.stringify(afterEsc)}`);
  assert(!afterBackdrop.open && afterBackdrop.y === 600 && afterBackdrop.focus.includes('docs-menu-button'), `backdrop: ${JSON.stringify(afterBackdrop)}`);
  assert(!afterSelect.open && afterSelect.overflow === '', `selection: ${JSON.stringify(afterSelect)}`);
  return 'lock, restore, Escape, backdrop, selection';
});

await check('D08', 'popover follows its trigger on scroll/resize, flips, closes when the trigger leaves the view, returns focus', async (page) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto(`${base}#/placement`);
  const trigger = '#ex-features-popover .docs-preview button';
  await page.waitForSelector(trigger);
  // Room to scroll the example anywhere in the viewport (test setup only).
  await page.evaluate(() => (document.querySelector('.docs-main').style.paddingBottom = '1500px'));
  // Put the trigger at a given viewport y (page scroll), then measure.
  const at = (y) => page.evaluate(([sel, y]) => window.scrollBy(0, document.querySelector(sel).getBoundingClientRect().top - y), [trigger, y]);
  const geo = () =>
    page.evaluate((sel) => {
      const t = document.querySelector(sel).getBoundingClientRect();
      const p = document.querySelector('.popover')?.getBoundingClientRect();
      return p && { side: document.querySelector('.popover').dataset.side, below: Math.round(p.top - t.bottom), above: Math.round(t.top - p.bottom), left: Math.round(p.left), right: Math.round(p.right), top: Math.round(p.top), bottom: Math.round(p.bottom), vw: document.documentElement.clientWidth, vh: innerHeight };
    }, trigger);
  const settle = () => page.waitForTimeout(250);
  const open = async () => {
    await page.$eval(trigger, (b) => b.click());
    await page.waitForSelector('.popover .cal-root[data-measured]');
    await settle();
  };
  const isOpen = () => page.evaluate(() => !!document.querySelector('.popover'));

  await at(150);
  const y0 = await page.evaluate(() => scrollY);
  await open();
  const g1 = await geo();
  assert(g1.side === 'bottom' && g1.below === 8 && (await page.evaluate(() => scrollY)) === y0, `open: ${JSON.stringify(g1)}`);
  await page.mouse.wheel(0, 60);
  await settle();
  const g2 = await geo();
  assert(g2 && g2.below === 8, `after scroll: ${JSON.stringify(g2)}`);
  await at(700); // trigger near the bottom: not enough room below
  await settle();
  const g3 = await geo();
  assert(g3.side === 'top' && g3.above === 8 && g3.top >= 8, `flip: ${JSON.stringify(g3)}`);
  // Resize with the popover open (the trigger stays in view): the position follows.
  await at(150);
  await settle();
  await page.setViewportSize({ width: 900, height: 700 });
  await settle();
  const g4 = await geo();
  assert(g4 && g4.below === 8 && g4.right <= g4.vw - 8 && g4.bottom <= g4.vh - 8, `resize: ${JSON.stringify(g4)}`);
  // Narrow screen: the popover fits the viewport horizontally.
  await page.setViewportSize({ width: 380, height: 800 });
  await settle();
  if (!(await isOpen())) {
    await at(150);
    await open();
  }
  const g5 = await geo();
  assert(g5.left >= 8 && g5.right <= g5.vw - 8 && g5.bottom <= g5.vh - 8, `narrow: ${JSON.stringify(g5)}`);
  await page.setViewportSize({ width: 1100, height: 800 });
  await at(-60); // trigger scrolled above the viewport
  await settle();
  assert(!(await isOpen()), 'popover stays open after its trigger left the view');

  await at(150);
  await open();
  await page.keyboard.press('Escape');
  await settle();
  const esc = await page.evaluate((sel) => ({ open: !!document.querySelector('.popover'), focus: document.activeElement === document.querySelector(sel) }), trigger);
  assert(!esc.open && esc.focus, `escape: ${JSON.stringify(esc)}`);
  await open();
  await page.mouse.click(1050, 400);
  await settle();
  assert(!(await isOpen()), 'outside click did not close');
  await open();
  const day = await page.$eval('.popover button[data-date]:not([aria-disabled])', (b) => b.dataset.date);
  await page.click(`.popover button[data-date="${day}"]`);
  await settle();
  const sel = await page.evaluate((s) => ({ open: !!document.querySelector('.popover'), text: document.querySelector(s).textContent, focus: document.activeElement === document.querySelector(s) }), trigger);
  assert(!sel.open && sel.text === day && sel.focus, `selection: ${JSON.stringify(sel)}`);
  return 'attached, flips, resize, closes out of view, Escape/outside/selection, focus back';
});

await check('D04', 'View code: file tabs, keyboard, copy with an announced result', async (page) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
  await open(page, 'slots', 'ex-features-slots');
  const ex = '#ex-features-slots';
  await page.click(`${ex} .docs-example-bar button`);
  await page.waitForSelector(`${ex} [role=tab]`);
  const tabs = await page.$$eval(`${ex} [role=tab]`, (t) => t.map((x) => x.textContent));
  await page.focus(`${ex} [role=tab][aria-selected=true]`);
  await page.keyboard.press('ArrowRight');
  const selected = await page.$eval(`${ex} [role=tab][aria-selected=true]`, (t) => t.textContent);
  await page.click(`${ex} .docs-copy`);
  await page.waitForTimeout(100);
  const r = await page.evaluate(async (ex) => ({
    status: document.querySelector(`${ex} [role=status]`).textContent,
    clip: await navigator.clipboard.readText(),
    shown: document.querySelector(`${ex} pre code`).textContent,
    expanded: document.querySelector(`${ex} .docs-example-bar button`).getAttribute('aria-expanded'),
  }), ex);
  assert(tabs.join() === 'Slots.tsx,Slots.css' && selected === 'Slots.css', `tabs: ${tabs} / ${selected}`);
  assert(r.status === 'Copied Slots.css to the clipboard' && r.clip === r.shown && r.clip.includes('.slot-row') && r.expanded === 'true', JSON.stringify({ ...r, clip: r.clip.slice(0, 40), shown: r.shown.slice(0, 40) }));
  return `${tabs.join(' + ')}; copied ${r.clip.length} chars`;
});

await browser.close();
await server.close();
console.table(results.map((r) => ({ id: r.id, ok: r.ok ? 'PASS' : 'FAIL', title: r.title, detail: r.detail })));
process.exit(results.every((r) => r.ok) ? 0 : 1);
