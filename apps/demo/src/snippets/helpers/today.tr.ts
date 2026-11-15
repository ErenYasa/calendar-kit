import { fromJSDate, getToday, toUTCDate, toCalendarDate } from 'calendar-kit/core';

// Tek bir an, iki takvim günü: 7 Kasım 2026, 23:30 UTC.
const instant = Date.UTC(2026, 10, 7, 23, 30);
export const inIstanbul = getToday({ now: instant, timeZone: 'Europe/Istanbul' }); // → "2026-11-08"
export const inNewYork = getToday({ now: instant, timeZone: 'America/New_York' }); // → "2026-11-07"

// now olmadan: içinde bulunulan gün. timeZone olmadan: sunucunun/cihazın yerel saat dilimi.
export const todayHere = getToday();
export const todayInTokyo = getToday({ timeZone: 'Asia/Tokyo' });

// Var olan bir Date (ör. bir tarih seçiciden veya bir API zaman damgasından).
export const fromApi = fromJSDate(new Date('2026-01-01T02:00:00Z'), 'America/Los_Angeles'); // → "2025-12-31"

// Tekrar Date’e, UTC gece yarısında; ör. timeZone: 'UTC' ile Intl için.
export const asDate = toUTCDate(toCalendarDate('2026-11-13')); // → "2026-11-13T00:00:00.000Z"
