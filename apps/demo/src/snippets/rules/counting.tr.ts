import { countDays, countNights, getIncludedDays, toCalendarDate } from 'calendar-kit/core';

const range = { start: toCalendarDate('2026-11-13'), end: toCalendarDate('2026-11-20') };

// Hariç bitiş (stayRules): 20 Kasım çıkış günüdür, gece değildir.
export const nights = countNights(range); // → 7
// Dahil bitiş (dayRangeRules): iki uç da rezervasyonun günüdür.
export const days = countDays(range); // → 8
// Konaklamanın geceleri, her gecenin başladığı tarihle adlandırılır.
export const lastNight = getIncludedDays(range, 'exclusive').slice(-1)[0]; // → "2026-11-19"
export const lastDay = getIncludedDays(range, 'inclusive').slice(-1)[0]; // → "2026-11-20"
