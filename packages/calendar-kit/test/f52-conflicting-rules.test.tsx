/**
 * F52: length options that no range can satisfy (docs/verification-findings.md).
 * Before: every start was rejected with a misleading 'min-length', or — when no
 * day allowed a check-out — a start was accepted that could never be completed.
 */
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calendar, type SelectionRules, combineRules, createSelectionEngine, dayRangeRules, messagesTr, stayRules, toCalendarDate as d } from '../src';

const TODAY = d('2026-11-02');
const START = d('2026-11-10');
const engine = (rules: SelectionRules, start: string | null = null) =>
  createSelectionEngine({
    rules,
    today: TODAY,
    state: { selection: { mode: 'range', value: { start: start as never, end: null } }, activeEndpoint: start ? 'end' : 'start' },
  });
// The same rules stayRules builds, without the adapter's own check.
const conflicting = (getDayAvailability?: SelectionRules['getDayAvailability']): SelectionRules => ({
  rangeSemantics: 'exclusive',
  allowSameDay: false,
  requireReachableEnd: true,
  minLength: 5,
  maxLength: 3,
  ...(getDayAvailability ? { getDayAvailability } : {}),
});

describe('F52 adapters reject conflicting lengths where they are configured', () => {
  it('stayRules and dayRangeRules throw a RangeError naming the options', () => {
    expect(() => stayRules({ minNights: 5, maxNights: 3 })).toThrow(new RangeError('stayRules: minNights (5) is greater than maxNights (3), so no stay can be selected.'));
    expect(() => stayRules({ fixedNights: 7, maxNights: 5 })).toThrow(/fixedNights \(7\) is greater than maxNights \(5\)/);
    expect(() => stayRules({ fixedNights: 1, minNights: 2 })).toThrow(/fixedNights \(1\) is less than minNights \(2\)/);
    expect(() => dayRangeRules({ minDays: 4, maxDays: 2 })).toThrow(/dayRangeRules: minDays \(4\) is greater than maxDays \(2\)/);
  });
  it('valid bounds are accepted, including equal minimum and maximum', () => {
    expect(() => stayRules({ minNights: 3, maxNights: 3 })).not.toThrow();
    expect(() => stayRules({ fixedNights: 7, minNights: 7, maxNights: 14 })).not.toThrow();
    expect(() => dayRangeRules({ minDays: 1, maxDays: 30 })).not.toThrow();
  });
});

describe('F52 the engine rejects every start with the clashing values', () => {
  const expectConflict = (rules: SelectionRules) => {
    const plan = engine(rules).plan(START);
    expect(plan.kind).toBe('rejected');
    expect(plan.issue).toMatchObject({ code: 'conflicting-rules', params: { min: 5, max: 3, unit: 'nights' } });
  };
  it('all days available (was: min-length)', () => expectConflict(conflicting()));
  it('every day check-in-only (was: start accepted, every end rejected)', () => expectConflict(conflicting(() => ({ canEnd: false }))));
  it('a booked day in between (was: min-length)', () => expectConflict(conflicting((date) => (date === '2026-11-11' ? { closed: true } : undefined))));
  it('a range proposed directly is invalid with the same reason', () => {
    const result = engine(conflicting(), START).validate({ mode: 'range', value: { start: START, end: d('2026-11-14') } });
    expect(result).toMatchObject({ valid: false, issue: { code: 'conflicting-rules' } });
  });
  it('a fixed length outside min/max is a conflict too', () => {
    const plan = engine({ rangeSemantics: 'inclusive', allowSameDay: true, fixedLength: 7, maxLength: 5 }).plan(START);
    expect(plan.issue).toMatchObject({ code: 'conflicting-rules', params: { length: 7, max: 5, unit: 'days' } });
  });
  it('single and multiple selections are not affected', () => {
    const single = createSelectionEngine({ rules: conflicting(), today: TODAY, state: { selection: { mode: 'single', value: null }, activeEndpoint: 'start' } });
    expect(single.plan(START).kind).toBe('select');
  });
});

describe('F52 in the calendar: combined rule sets', () => {
  it('no day can start a stay and the reason names the values (English and Turkish)', () => {
    const rules = combineRules(stayRules({ minNights: 5 }), stayRules({ maxNights: 3 }));
    for (const [messages, text] of [
      [undefined, 'No stay fits these rules: at least 5 nights and at most 3 nights'],
      [messagesTr, 'Bu kurallara uyan konaklama yok: en az 5 gece ve en fazla 3 gece'],
    ] as const) {
      const rejected: string[] = [];
      const { container, unmount } = render(
        <Calendar mode="range" today={TODAY} rules={rules} messages={messages} onInvalidSelection={(e) => rejected.push(e.message)} />,
      );
      expect(container.querySelectorAll('button[data-date]:not([aria-disabled="true"])').length).toBe(0);
      const day = container.querySelector<HTMLElement>('button[data-date="2026-11-10"]')!;
      expect(day.getAttribute('aria-label')).toContain(text);
      fireEvent.click(day, { detail: 1 });
      expect(rejected).toEqual([text]);
      unmount();
    }
  });
  it('valid bounds keep working: 2–5 nights', () => {
    const values: unknown[] = [];
    const rejected: string[] = [];
    const { container } = render(
      <Calendar mode="range" today={TODAY} rules={stayRules({ minNights: 2, maxNights: 5 })} onChange={(v) => values.push(v)} onInvalidSelection={(e) => rejected.push(e.issue.code)} />,
    );
    const click = (date: string) => fireEvent.click(container.querySelector(`button[data-date="${date}"]`)!, { detail: 1 });
    click('2026-11-10');
    click('2026-11-11'); // 1 night
    click('2026-11-16'); // 6 nights
    click('2026-11-13'); // 3 nights
    expect(rejected).toEqual(['min-length', 'max-length']);
    expect(values.at(-1)).toEqual({ start: '2026-11-10', end: '2026-11-13' });
  });
});
