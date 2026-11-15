import { type CalendarDate, type CalendarMonth, getMonth, parseDate, toCalendarDate } from 'calendar-kit';

// CalendarDate tek bir gündür, CalendarMonth bütün bir ay. Çalışma zamanında ikisi de düz birer dizedir.
export const day = toCalendarDate('2026-11-13'); // → "2026-11-13"
export const month = getMonth(day); // → "2026-11"

// 1. Tip kontrolü (derleme zamanı): TypeScript düz bir dizeyi tarih ya da ay olarak kabul etmez.
// @ts-expect-error düz bir dize CalendarDate değildir
export const typedDay: CalendarDate = '2026-11-13';
// @ts-expect-error düz bir dize CalendarMonth değildir
export const typedMonth: CalendarMonth = '2026-11';
// Tip kontrolü günün gerçekten var olup olmadığını bilemez: '2026-02-30' de yalnızca bir dizedir.

// 2. Tarih kontrolü (çalışma zamanı): parseDate ve toCalendarDate günün gerçekten var olduğunu denetler.
export const valid = parseDate('2026-11-13'); // → "2026-11-13"
// Şubat 2026’da 30. gün yoktur:
export const invalid = parseDate('2026-02-30'); // → null

// toCalendarDate aynı denetimi yapar, ancak null döndürmek yerine RangeError fırlatır.
const attempt = (run: () => unknown) => {
  try {
    return run();
  } catch (error) {
    return String(error);
  }
};
export const thrown = attempt(() => toCalendarDate('2026-02-30')); // → "RangeError: Invalid calendar date \"2026-02-30\" (expected YYYY-MM-DD)"
