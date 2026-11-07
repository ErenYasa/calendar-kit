import { type DayRangeStatus, createSelectionEngine, dayRangeRules, toCalendarDate } from 'calendar-kit/core';

// Bir durum günün tamamını tanımlar.
const statuses: Record<string, DayRangeStatus> = {
  '2026-11-10': 'start-only',
  '2026-11-11': 'end-only',
  '2026-11-12': 'closed',
};
const engine = createSelectionEngine({
  rules: dayRangeRules({ getDayStatus: (date) => statuses[date] }),
  state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' },
  today: null,
});

// [canStart, canEnd, canPassThrough, sebep]
const flags = (date: string) => {
  const a = engine.availability(toCalendarDate(date));
  return [a.canStart, a.canEnd, a.canPassThrough, a.reason ?? null];
};

export const available = flags('2026-11-13'); // → [true, true, true, null]
export const startOnly = flags('2026-11-10'); // → [true, false, false, "start-only"]
export const endOnly = flags('2026-11-11'); // → [false, true, false, "end-only"]
export const closed = flags('2026-11-12'); // → [false, false, false, "closed"]

// 10 → 11 geçerli bir 2 günlük aralıktır; tek başına bir start-only günü 1 günlük aralık olamaz.
export const twoDays = engine.validateRange(toCalendarDate('2026-11-10'), toCalendarDate('2026-11-11')).valid; // → true
export const startOnlyAlone = engine.validateRange(toCalendarDate('2026-11-10'), toCalendarDate('2026-11-10')).issue; // → {"code": "end-not-allowed", "date": "2026-11-10", "dayReason": "start-only"}
