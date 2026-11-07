import { addDays, addMonths, addMonthsToMonth, clampDate, diffDays, diffMonths, eachDay, eachMonth, toCalendarDate, toCalendarMonth } from 'calendar-kit/core';

const jan31 = toCalendarDate('2026-01-31');

// Günler: düz tam sayı aritmetiği, yaz saatinden (DST) hiç etkilenmez.
export const nextDay = addDays(jan31, 1); // → "2026-02-01"
export const weekEarlier = addDays(jan31, -7); // → "2026-01-24"
export const acrossDst = diffDays(toCalendarDate('2026-03-28'), toCalendarDate('2026-03-30')); // → 2
export const backwards = diffDays(toCalendarDate('2026-11-20'), toCalendarDate('2026-11-13')); // → -7

// Bir tarihe ay ekleme: gün, hedef ayın uzunluğuna göre sınıra çekilir.
export const endOfFeb = addMonths(jan31, 1); // → "2026-02-28"
export const leapFeb = addMonths(toCalendarDate('2024-01-31'), 1); // → "2024-02-29"
export const notRestored = addMonths(addMonths(jan31, 1), 1); // → "2026-03-28"

// Bir aya ay ekleme: sınıra çekilecek gün yok.
export const nextYear = addMonthsToMonth(toCalendarMonth('2026-12'), 1); // → "2027-01"
export const lastMonth = addMonthsToMonth(toCalendarMonth('9999-12'), 1); // → "9999-12"
export const monthsBetween = diffMonths(toCalendarMonth('2026-11'), toCalendarMonth('2027-02')); // → 3

// Desteklenen yıllar 0001–9999: iki uçtan birinin ötesine geçen sonuçlar o uca çekilir.
export const lastDay = addDays(toCalendarDate('9999-12-30'), 5); // → "9999-12-31"
export const firstDay = addDays(toCalendarDate('0001-01-02'), -5); // → "0001-01-01"
export const lastDate = addMonths(toCalendarDate('9999-11-30'), 3); // → "9999-12-30"
// NaN miktarın en yakın sınırı yoktur: addDays(jan31, NaN) RangeError('Invalid amount') fırlatır.

// Listeler: eachDay’de iki uç da dahildir; eachMonth bir adet (count) alır.
export const days = eachDay(toCalendarDate('2026-11-13'), toCalendarDate('2026-11-15')); // → ["2026-11-13","2026-11-14","2026-11-15"]
export const reversed = eachDay(toCalendarDate('2026-11-15'), toCalendarDate('2026-11-13')); // → []
export const quarter = eachMonth(toCalendarMonth('2026-11'), 3); // → ["2026-11","2026-12","2027-01"]

// İsteğe bağlı sınırlara çekme (null veya undefined “sınır yok” demektir).
export const clamped = clampDate(toCalendarDate('2026-01-01'), toCalendarDate('2026-02-01'), null); // → "2026-02-01"
export const inside = clampDate(toCalendarDate('2026-02-10'), toCalendarDate('2026-02-01'), toCalendarDate('2026-02-28')); // → "2026-02-10"
