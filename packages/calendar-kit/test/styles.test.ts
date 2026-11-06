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

describe('F17 / F33 skeleton day styles', () => {
  const skeleton = find((r) => !r.media && r.selector.includes('data-status') && r.selector.includes('.cal-day-button::before'), 'skeleton rule');
  const focus = find((r) => !r.media && r.selector.includes('.cal-day-button:focus-visible::before'), 'focus rule').sort((a, b) => b.order - a.order)[0]!;

  it('F17 prefers-reduced-motion stops the skeleton shimmer', () => {
    const reduced = find((r) => (r.media ?? '').includes('prefers-reduced-motion') && /animation:\s*none/.test(r.body) && r.selector.includes('.cal-day-button::before'), 'reduced-motion rule');
    for (const s of skeleton.filter((r) => /animation:/.test(r.body)))
      expect(reduced.some((rm) => wins(rm, s)), s.selector).toBe(true);
  });

  it('F33 keyboard focus ring stays visible on loading (skeleton) days', () => {
    for (const s of skeleton.filter((r) => /box-shadow/.test(r.body))) expect(wins(focus, s), `${focus.selector} vs ${s.selector}`).toBe(true);
  });
});

describe('F21 tooltip theming', () => {
  it('.cal-tooltip does not reset the theme variables it consumes', () => {
    for (const r of find((x) => /^\.cal-tooltip$/.test(x.selector), 'tooltip rule')) expect(r.body).not.toMatch(/--cal-tooltip-bg\s*:/);
  });

  it('tooltip variables set on the calendar root reach the portalled tooltip', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { createElement } = await import('react');
    const { Calendar, toCalendarDate } = await import('../src');
    render(
      createElement(Calendar, {
        mode: 'single',
        today: toCalendarDate('2026-10-12'),
        style: { ['--cal-tooltip-bg' as string]: 'rgb(1, 2, 3)', ['--cal-tooltip-color' as string]: 'rgb(4, 5, 6)' },
        getDayTooltip: ({ day }) => (day.date === '2026-10-20' ? { content: 'tip', persistent: true } : null),
      }),
    );
    const tip = screen.getByRole('tooltip');
    expect(tip.style.getPropertyValue('--cal-tooltip-bg').trim()).toBe('rgb(1, 2, 3)');
    expect(tip.style.getPropertyValue('--cal-tooltip-color').trim()).toBe('rgb(4, 5, 6)');
  });
});

describe('F16 reduced motion on the initial-load skeleton', () => {
  it('the reduced-motion rule matches initial-load skeleton days and beats the shimmer', async () => {
    const { render } = await import('@testing-library/react');
    const { createElement } = await import('react');
    const { Calendar, toCalendarDate } = await import('../src');
    const { container } = render(createElement(Calendar, { mode: 'single', today: toCalendarDate('2026-10-12'), loading: true }));
    const btn = container.querySelector<HTMLElement>('.cal-month[data-skeleton] .cal-day-button')!;
    expect(btn, 'initial-load skeleton day').not.toBeNull();
    const plain = (sel: string) => sel.replace(/::[\w-]+/g, '');
    const shimmer = find((r) => !r.media && /animation:/.test(r.body) && r.selector.endsWith('::before') && btn.matches(plain(r.selector)), 'shimmer on the button');
    const reduced = find(
      (r) => (r.media ?? '').includes('prefers-reduced-motion') && /animation:\s*none/.test(r.body) && r.selector.endsWith('::before') && btn.matches(plain(r.selector)),
      'reduced-motion rule matching the button',
    );
    for (const s of shimmer) expect(reduced.some((rm) => wins(rm, s)), s.selector).toBe(true);
  });
});
