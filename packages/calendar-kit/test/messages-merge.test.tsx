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

describe('F41 mergeMessages ignores explicit undefined', () => {
  it('keeps the base text for keys set to undefined', () => {
    const merged = mergeMessages(messagesEn, { today: undefined, reasons: { past: undefined }, dayReasons: { booked: undefined } } as never);
    expect(merged.today).toBe(messagesEn.today);
    expect(merged.reasons.past).toBe(messagesEn.reasons.past);
    expect(merged.dayReasons.booked).toBe(messagesEn.dayReasons.booked);
  });
});
