import { addDays, addMonths, addMonthsToMonth, clampDate, diffDays, diffMonths, eachDay, eachMonth, toCalendarDate, toCalendarMonth } from 'calendar-kit/core';

const jan31 = toCalendarDate('2026-01-31');

// Days: plain integer arithmetic, never affected by DST.
export const nextDay = addDays(jan31, 1); // → "2026-02-01"
export const weekEarlier = addDays(jan31, -7); // → "2026-01-24"
export const acrossDst = diffDays(toCalendarDate('2026-03-28'), toCalendarDate('2026-03-30')); // → 2
export const backwards = diffDays(toCalendarDate('2026-11-20'), toCalendarDate('2026-11-13')); // → -7

// Months on a date: the day is clamped to the target month's length.
export const endOfFeb = addMonths(jan31, 1); // → "2026-02-28"
export const leapFeb = addMonths(toCalendarDate('2024-01-31'), 1); // → "2024-02-29"
export const notRestored = addMonths(addMonths(jan31, 1), 1); // → "2026-03-28"

// Months on a month: no day to clamp.
export const nextYear = addMonthsToMonth(toCalendarMonth('2026-12'), 1); // → "2027-01"
export const lastMonth = addMonthsToMonth(toCalendarMonth('9999-12'), 1); // → "9999-12"
export const monthsBetween = diffMonths(toCalendarMonth('2026-11'), toCalendarMonth('2027-02')); // → 3

// The supported years are 0001–9999: results past either end are clamped to it.
export const lastDay = addDays(toCalendarDate('9999-12-30'), 5); // → "9999-12-31"
export const firstDay = addDays(toCalendarDate('0001-01-02'), -5); // → "0001-01-01"
export const lastDate = addMonths(toCalendarDate('9999-11-30'), 3); // → "9999-12-30"
// A NaN amount has no nearest bound: addDays(jan31, NaN) throws RangeError('Invalid amount').

// Lists: both ends of eachDay are included; eachMonth takes a count.
export const days = eachDay(toCalendarDate('2026-11-13'), toCalendarDate('2026-11-15')); // → ["2026-11-13","2026-11-14","2026-11-15"]
export const reversed = eachDay(toCalendarDate('2026-11-15'), toCalendarDate('2026-11-13')); // → []
export const quarter = eachMonth(toCalendarMonth('2026-11'), 3); // → ["2026-11","2026-12","2027-01"]

// Clamping into optional limits (null or undefined means "no limit").
export const clamped = clampDate(toCalendarDate('2026-01-01'), toCalendarDate('2026-02-01'), null); // → "2026-02-01"
export const inside = clampDate(toCalendarDate('2026-02-10'), toCalendarDate('2026-02-01'), toCalendarDate('2026-02-28')); // → "2026-02-10"
