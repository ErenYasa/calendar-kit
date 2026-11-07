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

describe('F39 date arithmetic with fractional amounts', () => {
  it('truncates toward zero instead of producing an invalid date string', () => {
    expect(addDays(d('2026-01-01'), 1.5)).toBe('2026-01-02');
    expect(addDays(d('2026-01-03'), -1.5)).toBe('2026-01-02');
    expect(addMonths(d('2026-01-31'), 1.5)).toBe('2026-02-28');
    expect(addMonthsToMonth(toCalendarMonth('2026-01'), 2.9)).toBe('2026-03');
  });
});
describe('F40 invalid instants', () => {
  it('getToday/fromJSDate throw RangeError with and without a time zone (never return null)', () => {
    expect(() => getToday({ now: Number.NaN })).toThrow(RangeError);
    expect(() => getToday({ now: Number.NaN, timeZone: 'UTC' })).toThrow(RangeError);
    expect(() => fromJSDate(new Date('not a date'))).toThrow(RangeError);
  });
});
describe('F39 results outside 0001-01-01…9999-12-31', () => {
  it('addDays clamps to the nearest supported bound, like addMonths', () => {
    expect(addDays(d('9999-12-30'), 5)).toBe('9999-12-31');
    expect(addDays(d('0001-01-02'), -5)).toBe('0001-01-01');
    expect(addDays(d('2026-01-01'), Number.POSITIVE_INFINITY)).toBe('9999-12-31');
    expect(addDays(d('2026-01-01'), -1e12)).toBe('0001-01-01');
    expect(addDays(d('9999-12-31'), 0)).toBe('9999-12-31');
    expect(addMonths(d('9999-11-30'), 5)).toBe('9999-12-30');
    expect(addMonths(d('0001-02-10'), -5)).toBe('0001-01-10');
  });
  it('a NaN amount throws RangeError in addDays and addMonths (there is no nearest bound)', () => {
    expect(() => addDays(d('2026-01-01'), Number.NaN)).toThrow(RangeError);
    expect(() => addMonths(d('2026-01-01'), Number.NaN)).toThrow(RangeError);
    expect(() => addMonthsToMonth(toCalendarMonth('2026-01'), Number.NaN)).toThrow(RangeError);
  });
});
