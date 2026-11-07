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
