/**
 * Regression tests for docs/verification-findings.md. Each block names the
 * finding id; every test failed before its fix.
 */
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Calendar,
  type CalendarDate,
  type Selection,
  type SelectionRules,
  closedDates,
  combineRules,
  createSelectionEngine,
  relaxRules,
  stayRules,
  toCalendarDate as d,
} from '../src';

const TODAY = d('2026-10-12');
const range = (start: string | null, end: string | null): Selection => ({
  mode: 'range',
  value: { start: start as CalendarDate | null, end: end as CalendarDate | null },
});
const engine = (rules: SelectionRules, selection: Selection = range(null, null), activeEndpoint: 'start' | 'end' = 'start') =>
  createSelectionEngine({ rules, state: { selection, activeEndpoint }, today: TODAY });

describe('F02 combineRules ignores explicit undefined values', () => {
  it('keeps an earlier validator when a later set has validateSelection: undefined', () => {
    const check: SelectionRules['validateSelection'] = () => ({ code: 'custom', message: 'blocked' });
    const rules = combineRules({ validateSelection: check }, stayRules({ minNights: 2, validateSelection: undefined }));
    expect(rules.validateSelection).toBe(check);
    expect(engine(rules).validate(range('2026-11-13', '2026-11-16')).issue?.message).toBe('blocked');
  });

  it('keeps an earlier closed day when a later set has getDayAvailability: undefined', () => {
    const rules = combineRules(closedDates([d('2026-11-14')]), { getDayAvailability: undefined });
    expect(engine(rules).plan(d('2026-11-14')).issue?.code).toBe('closed');
  });

  it('keeps earlier scalar semantics when a later set leaves them undefined', () => {
    const rules = combineRules({ rangeSemantics: 'exclusive', unknownDataPolicy: 'allow' }, { rangeSemantics: undefined, unknownDataPolicy: undefined });
    expect(rules.rangeSemantics).toBe('exclusive');
    expect(rules.unknownDataPolicy).toBe('allow');
  });
});

describe('F03 relaxing combined rules keeps real partial restrictions only', () => {
  const X = d('2026-10-20');
  const schedule: SelectionRules = { getDayAvailability: (x) => (x === X ? { closed: true, schedule: true, reason: 'out-of-season' } : undefined) };
  const real: SelectionRules = { getDayAvailability: (x) => (x === X ? { canEnd: false, reason: 'check-in-only' } : undefined) };

  it('relaxRules(combineRules(A, B)) equals combining the relaxed sets', () => {
    const e = engine(relaxRules(combineRules(schedule, real)));
    const a = e.availability(X);
    expect(a).toMatchObject({ closed: false, canStart: true, canEnd: false, reason: 'check-in-only' });
  });

  it('Calendar relaxSchedule lets the day start a range but not end one', () => {
    render(<Calendar mode="range" today={TODAY} rules={[schedule, real]} relaxSchedule />);
    const day = document.querySelector<HTMLElement>(`button[data-date="${X}"]`)!;
    expect(day.getAttribute('aria-disabled')).toBeNull();
    fireEvent.click(document.querySelector<HTMLElement>('button[data-date="2026-10-16"]')!, { detail: 1 });
    expect(document.querySelector<HTMLElement>(`button[data-date="${X}"]`)!.getAttribute('aria-disabled')).toBe('true');
  });
});
