/**
 * Cascade regressions on the compiled default stylesheet (see test/css.ts).
 * These are also checked in a real browser; jsdom cannot apply the cascade
 * to ::before.
 */
import { describe, expect, it } from 'vitest';
import { type CssRule, compiledRules, specificity, wins } from './css';

const rules = compiledRules();
const find = (pred: (r: CssRule) => boolean, label: string) => {
  const found = rules.filter(pred);
  expect(found.length, label).toBeGreaterThan(0);
  return found;
};

describe('specificity helper', () => {
  it('matches the CSS spec for the features used', () => {
    expect(specificity('.a [b] .c::before')).toEqual([0, 3, 1]);
    expect(specificity('.a:where([x]) .c:hover::before')).toEqual([0, 3, 1]);
    expect(specificity('.a:not([x]):not([y]) .c')).toEqual([0, 4, 0]);
  });
});

describe('F06 keyboard focus ring wins over day state styles', () => {
  const focus = find((r) => !r.media && r.selector.includes('.cal-day-button:focus-visible::before') && /box-shadow/.test(r.body), 'focus rule')
    .sort((a, b) => b.order - a.order)[0]!;

  it("today's outline does not hide the focus ring", () => {
    for (const today of find((r) => r.selector.includes('[data-today]') && r.selector.includes('.cal-day-button::before'), 'today rule'))
      expect(wins(focus, today), `${focus.selector} vs ${today.selector}`).toBe(true);
  });

  it('hover outline does not hide the focus ring', () => {
    for (const hover of find((r) => r.selector.includes('.cal-day-button:hover::before'), 'hover rule'))
      expect(wins(focus, hover), `${focus.selector} vs ${hover.selector}`).toBe(true);
  });
});

describe('F15 direction styles follow the calendar instance, not an ancestor', () => {
  const rtlRules = rules.filter((r) => /\[dir=['"]?rtl/.test(r.selector));

  it('RTL rules do not match inside an LTR calendar nested in an RTL page', async () => {
    const { render } = await import('@testing-library/react');
    const { createElement } = await import('react');
    const { Calendar, toCalendarDate } = await import('../src');
    const value = { start: toCalendarDate('2026-10-14'), end: toCalendarDate('2026-10-17') };
    const { container } = render(
      createElement('div', { dir: 'rtl' }, createElement(Calendar, { mode: 'range', direction: 'ltr', today: toCalendarDate('2026-10-12'), defaultValue: value })),
    );
    expect(rtlRules.length).toBeGreaterThan(0);
    const els = [...container.querySelectorAll('.cal-root *')];
    for (const r of rtlRules) {
      const sel = r.selector.replace(/::[\w-]+/g, '');
      expect(els.filter((el) => el.matches(sel)), r.selector).toEqual([]);
    }
  });

  it('RTL rules still match inside an RTL calendar', async () => {
    const { render } = await import('@testing-library/react');
    const { createElement } = await import('react');
    const { Calendar, toCalendarDate } = await import('../src');
    const value = { start: toCalendarDate('2026-10-14'), end: toCalendarDate('2026-10-17') };
    const { container } = render(createElement(Calendar, { mode: 'range', direction: 'rtl', today: toCalendarDate('2026-10-12'), defaultValue: value }));
    const els = [...container.querySelectorAll('.cal-root *')];
    const matched = rtlRules.filter((r) => els.some((el) => el.matches(r.selector.replace(/::[\w-]+/g, ''))));
    expect(matched.length).toBe(rtlRules.length);
  });
});
