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
