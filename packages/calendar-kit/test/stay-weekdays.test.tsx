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

describe('F43 stayRules availableWeekdays restricts nights, not the check-out morning', () => {
  const weekends = stayRules({ availableWeekdays: [5, 6] }); // Friday and Saturday nights
  it('accepts Friday → Sunday (two nights on available weekdays)', () => {
    expect(engine(weekends).validate(range('2026-11-06', '2026-11-08')).valid).toBe(true);
    expect(engine(weekends, '2026-11-06').plan(d('2026-11-08')).kind).toBe('complete');
  });
  it('still rejects a night on another weekday and a start on it', () => {
    expect(engine(weekends).validate(range('2026-11-06', '2026-11-09')).valid).toBe(false); // Sunday night
    expect(engine(weekends).checkStart(d('2026-11-08'))).not.toBeNull(); // check-in on Sunday
  });
  it('is a schedule rule: relaxSchedule removes it', async () => {
    const { relaxRules } = await import('../src');
    expect(engine(relaxRules(weekends)).validate(range('2026-11-08', '2026-11-10')).valid).toBe(true);
  });
  it('inclusive day ranges keep closing the whole day', async () => {
    const { dayRangeRules } = await import('../src');
    expect(engine(dayRangeRules({ availableWeekdays: [5, 6] })).validate(range('2026-11-06', '2026-11-08')).valid).toBe(false);
  });
});
