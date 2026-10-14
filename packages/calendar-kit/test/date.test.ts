import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  addMonthsToMonth,
  createDate,
  daysInMonth,
  diffDays,
  diffMonths,
  formatDate,
  getDefaultFirstDayOfWeek,
  getLocaleDirection,
  getToday,
  getWeekday,
  isCalendarDate,
  parseDate,
  parseMonth,
  toCalendarDate as d,
} from '../src';

describe('parse / validate', () => {
  it('accepts only real YYYY-MM-DD dates', () => {
    expect(parseDate('2026-11-13')).toBe('2026-11-13');
    for (const bad of ['2026-02-30', '2026-13-01', '2026-1-1', '2026-11-13T00:00', '', null, 20261113, '0000-01-01'])
      expect(parseDate(bad)).toBeNull();
    expect(isCalendarDate('2024-02-29')).toBe(true);
    expect(() => d('2025-02-29')).toThrow(RangeError);
  });

  it('handles leap years', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(parseDate('2100-02-29')).toBeNull();
  });

  it('parses months', () => {
    expect(parseMonth('2026-10')).toBe('2026-10');
    expect(parseMonth('2026-10-12')).toBe('2026-10');
    expect(parseMonth('2026-00')).toBeNull();
    expect(createDate(2026, 4, 31)).toBeNull();
  });
});

describe('arithmetic', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays(d('2026-12-31'), 1)).toBe('2027-01-01');
    expect(addDays(d('2024-03-01'), -1)).toBe('2024-02-29');
    expect(addDays(d('2026-01-01'), 365)).toBe('2027-01-01');
    expect(addMonthsToMonth(parseMonth('2026-11')!, 3)).toBe('2027-02');
    expect(diffMonths(parseMonth('2026-10')!, parseMonth('2027-03')!)).toBe(5);
    expect(addMonths(d('2026-01-31'), 1)).toBe('2026-02-28');
    expect(addMonths(d('2024-03-31'), -1)).toBe('2024-02-29');
  });

  it('counts calendar days independent of DST (TZ=America/New_York in test script)', () => {
    // Spring forward (23h day) and fall back (25h day) in New York.
    expect(diffDays(d('2026-03-07'), d('2026-03-09'))).toBe(2);
    expect(diffDays(d('2026-10-31'), d('2026-11-02'))).toBe(2);
    expect(diffDays(d('2026-11-13'), d('2026-11-20'))).toBe(7);
    // Naive millisecond math would be off on DST days with local dates.
    const naive = (new Date(2026, 2, 9).getTime() - new Date(2026, 2, 8).getTime()) / 864e5;
    expect(naive).not.toBe(1);
  });

  it('weekday of known dates', () => {
    expect(getWeekday(d('2026-11-13'))).toBe(5); // Friday
    expect(getWeekday(d('1970-01-01'))).toBe(4);
    expect(getWeekday(d('2000-02-29'))).toBe(2);
  });
});

describe('today and formatting', () => {
  it('computes today for an explicit time zone and instant', () => {
    const instant = Date.UTC(2026, 9, 12, 22, 30); // 22:30 UTC
    expect(getToday({ now: instant, timeZone: 'UTC' })).toBe('2026-10-12');
    expect(getToday({ now: instant, timeZone: 'Europe/Istanbul' })).toBe('2026-10-13');
    expect(getToday({ now: instant, timeZone: 'America/Los_Angeles' })).toBe('2026-10-12');
  });

  it('formats without zone shifts', () => {
    expect(formatDate(d('2026-11-13'), 'en-US', { month: 'short', day: 'numeric' })).toBe('Nov 13');
    expect(formatDate(d('2026-01-01'), 'tr-TR', { month: 'long', day: 'numeric' })).toBe('1 Ocak');
  });

  it('locale defaults are deterministic', () => {
    expect(getDefaultFirstDayOfWeek('tr-TR')).toBe(1);
    expect(getDefaultFirstDayOfWeek('en-US')).toBe(0);
    expect(getDefaultFirstDayOfWeek('en')).toBe(0);
    expect(getDefaultFirstDayOfWeek('en-GB')).toBe(1);
    expect(getDefaultFirstDayOfWeek('ar-EG')).toBe(6);
    expect(getLocaleDirection('ar')).toBe('rtl');
    expect(getLocaleDirection('he-IL')).toBe('rtl');
    expect(getLocaleDirection('de')).toBe('ltr');
  });
});
