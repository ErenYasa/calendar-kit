import { type CalendarDate, type CalendarMonth, getMonth, parseDate, toCalendarDate } from 'calendar-kit';

// CalendarDate is one day, CalendarMonth a whole month. Both are plain strings at runtime.
export const day = toCalendarDate('2026-11-13'); // → "2026-11-13"
export const month = getMonth(day); // → "2026-11"

// 1. Type check (compile time): TypeScript does not accept a plain string as a date or month.
// @ts-expect-error a string is not a CalendarDate
export const typedDay: CalendarDate = '2026-11-13';
// @ts-expect-error a string is not a CalendarMonth
export const typedMonth: CalendarMonth = '2026-11';
// The type check cannot know whether the day exists: '2026-02-30' is still just a string.

// 2. Date check (runtime): parseDate and toCalendarDate check that the day really exists.
export const valid = parseDate('2026-11-13'); // → "2026-11-13"
// February 2026 has no 30th day:
export const invalid = parseDate('2026-02-30'); // → null

// toCalendarDate makes the same check, but throws a RangeError instead of returning null.
const attempt = (run: () => unknown) => {
  try {
    return run();
  } catch (error) {
    return String(error);
  }
};
export const thrown = attempt(() => toCalendarDate('2026-02-30')); // → "RangeError: Invalid calendar date \"2026-02-30\" (expected YYYY-MM-DD)"
