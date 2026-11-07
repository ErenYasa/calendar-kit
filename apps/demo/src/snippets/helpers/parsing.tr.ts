import { createDate, createMonth, isCalendarDate, parseDate, parseMonth, toCalendarDate, toCalendarMonth } from 'calendar-kit/core';

// parseDate: güvenilmeyen girdi (URL, form, JSON) → CalendarDate veya null.
export const fromQuery = parseDate('2026-11-13'); // → "2026-11-13"
export const impossibleDay = parseDate('2026-02-30'); // → null
export const notPadded = parseDate('2026-1-5'); // → null
export const withTime = parseDate('2026-11-13T10:00:00Z'); // → null
export const notAString = parseDate(20261113); // → null

// isCalendarDate: aynı kontrol, tür koruyucu (type guard) olarak.
export const valid = isCalendarDate('2024-02-29'); // → true
export const notLeap = isCalendarDate('2026-02-29'); // → false

// toCalendarDate: geçerli olduğunu bildiğiniz bir sabit değer; değilse RangeError fırlatır.
export const opening = toCalendarDate('2026-12-01'); // → "2026-12-01"
export const typo = (() => { try { return toCalendarDate('2026-12-32'); } catch (e) { return (e as Error).name; } })(); // → "RangeError"

// createDate: sayılar (ay 1–12) → CalendarDate veya null.
export const leapDay = createDate(2024, 2, 29); // → "2024-02-29"
export const noLeapDay = createDate(2026, 2, 29); // → null
export const yearZero = createDate(0, 1, 1); // → null

// Aylar: YYYY-MM; parseMonth tam bir tarihi de kabul eder.
export const month = parseMonth('2026-11'); // → "2026-11"
export const monthOfDate = parseMonth('2026-11-13'); // → "2026-11"
export const badMonth = parseMonth('2026-13'); // → null
export const built = createMonth(2026, 1); // → "2026-01"
export const literalMonth = toCalendarMonth('2027-03'); // → "2027-03"
