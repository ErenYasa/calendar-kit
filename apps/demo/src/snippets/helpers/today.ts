import { fromJSDate, getToday, toUTCDate, toCalendarDate } from 'calendar-kit/core';

// One instant, two calendar days: 23:30 UTC on 7 November 2026.
const instant = Date.UTC(2026, 10, 7, 23, 30);
export const inIstanbul = getToday({ now: instant, timeZone: 'Europe/Istanbul' }); // → "2026-11-08"
export const inNewYork = getToday({ now: instant, timeZone: 'America/New_York' }); // → "2026-11-07"

// Without now: the current day. Without timeZone: the host's local zone.
export const todayHere = getToday();
export const todayInTokyo = getToday({ timeZone: 'Asia/Tokyo' });

// An existing Date (e.g. from a date-picker or an API timestamp).
export const fromApi = fromJSDate(new Date('2026-01-01T02:00:00Z'), 'America/Los_Angeles'); // → "2025-12-31"

// Back to a Date at UTC midnight, e.g. for Intl with timeZone: 'UTC'.
export const asDate = toUTCDate(toCalendarDate('2026-11-13')); // → "2026-11-13T00:00:00.000Z"
