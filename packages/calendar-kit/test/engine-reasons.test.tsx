/**
 * Regression tests for the package issues found while documenting
 * (docs/verification-findings.md, F39–F51). Each failed before its fix.
 */
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Calendar,
  type SelectionRules,
  addDays,
  addMonths,
  addMonthsToMonth,
  createSelectionEngine,
  fromJSDate,
  getToday,
  mergeMessages,
  messagesEn,
  stayRules,
  toCalendarDate as d,
  toCalendarMonth,
} from '../src';

const TODAY = d('2026-11-02'); // a Monday
const engine = (rules: SelectionRules, start: string | null = null) =>
  createSelectionEngine({
    rules,
    today: TODAY,
    state: { selection: { mode: 'range', value: { start: start as never, end: null } }, activeEndpoint: start ? 'end' : 'start' },
  });
const range = (start: string, end: string) => ({ mode: 'range' as const, value: { start: d(start), end: d(end) } });

describe('F44 an unreachable start reports the real blocker, not the minimum', () => {
  it('no check-out day after the start → not "Minimum 2 nights"', () => {
    const rules = stayRules({ minNights: 2, maxNights: 30, getDayStatus: (x) => (x > '2026-11-10' ? 'check-in-only' : undefined) });
    const issue = engine(rules).checkStart(d('2026-11-12'));
    expect(issue).not.toBeNull();
    expect(issue!.code).not.toBe('min-length');
    expect(issue!.dayReason).toBe('check-in-only');
  });
  it('still reports min-length when only the minimum blocks the start', () => {
    const rules = stayRules({ minNights: 2, getDayStatus: (x) => (x === '2026-11-14' ? 'booked' : undefined) });
    expect(engine(rules).checkStart(d('2026-11-13'))).toMatchObject({ code: 'min-length' });
  });
});
describe('F45 endWeekdays apply to same-day ranges', () => {
  it('a Monday-only same-day range is rejected when ends are Friday only', () => {
    const rules: SelectionRules = { rangeSemantics: 'inclusive', startWeekdays: [1], endWeekdays: [5] };
    expect(engine(rules).validate(range('2026-11-02', '2026-11-02'))).toMatchObject({ valid: false, issue: { code: 'weekday-end' } });
  });
});
