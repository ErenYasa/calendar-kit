import { countDays, countNights, getIncludedDays, getRangeLength, getSelectionPhase, toCalendarDate, type DateRange } from 'calendar-kit/core';

const stay: DateRange = { start: toCalendarDate('2026-11-13'), end: toCalendarDate('2026-11-16') };
const open: DateRange = { start: toCalendarDate('2026-11-13'), end: null };
const sameDay: DateRange = { start: toCalendarDate('2026-11-13'), end: toCalendarDate('2026-11-13') };

// Geceler: [start, end) — bitiş, çıkış günüdür.
export const nights = countNights(stay); // → 3
export const nightsSameDay = countNights(sameDay); // → 0
// Günler: [start, end] — iki uç da dahildir.
export const days = countDays(stay); // → 4
export const daysSameDay = countDays(sameDay); // → 1
// Tamamlanmamış aralık: 0 değil, null.
export const unfinished = countNights(open); // → null
// Aynısı, birimi bir RangeSemantics değeriyle seçerek.
export const generic = getRangeLength(stay, 'exclusive'); // → 3

export const nightDates = getIncludedDays(stay, 'exclusive'); // → ["2026-11-13","2026-11-14","2026-11-15"]
export const dayDates = getIncludedDays(stay, 'inclusive'); // → ["2026-11-13","2026-11-14","2026-11-15","2026-11-16"]
export const dayUse = getIncludedDays(sameDay, 'exclusive'); // → ["2026-11-13"]

export const phases = [
  getSelectionPhase({ mode: 'range', value: { start: null, end: null } }),
  getSelectionPhase({ mode: 'range', value: open }),
  getSelectionPhase({ mode: 'range', value: stay }),
  getSelectionPhase({ mode: 'multiple', value: [] }),
]; // → ["empty","start-selected","complete","empty"]
