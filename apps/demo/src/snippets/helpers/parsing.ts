import { createDate, createMonth, isCalendarDate, parseDate, parseMonth, toCalendarDate, toCalendarMonth } from 'calendar-kit/core';

// parseDate: untrusted input (URL, form, JSON) → CalendarDate or null.
export const fromQuery = parseDate('2026-11-13'); // → "2026-11-13"
export const impossibleDay = parseDate('2026-02-30'); // → null
export const notPadded = parseDate('2026-1-5'); // → null
export const withTime = parseDate('2026-11-13T10:00:00Z'); // → null
export const notAString = parseDate(20261113); // → null

// isCalendarDate: the same check as a type guard.
export const valid = isCalendarDate('2024-02-29'); // → true
export const notLeap = isCalendarDate('2026-02-29'); // → false

// toCalendarDate: a literal you know is valid; throws a RangeError otherwise.
export const opening = toCalendarDate('2026-12-01'); // → "2026-12-01"
export const typo = (() => { try { return toCalendarDate('2026-12-32'); } catch (e) { return (e as Error).name; } })(); // → "RangeError"

// createDate: numbers (month is 1–12) → CalendarDate or null.
export const leapDay = createDate(2024, 2, 29); // → "2024-02-29"
export const noLeapDay = createDate(2026, 2, 29); // → null
export const yearZero = createDate(0, 1, 1); // → null

// Months: YYYY-MM, and parseMonth also accepts a full date.
export const month = parseMonth('2026-11'); // → "2026-11"
export const monthOfDate = parseMonth('2026-11-13'); // → "2026-11"
export const badMonth = parseMonth('2026-13'); // → null
export const built = createMonth(2026, 1); // → "2026-01"
export const literalMonth = toCalendarMonth('2027-03'); // → "2027-03"
