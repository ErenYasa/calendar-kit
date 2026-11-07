import { type StayDayStatus, createSelectionEngine, stayRules, toCalendarDate } from 'calendar-kit/core';

// Bir durum, o tarihte başlayan geceyi tanımlar (tarih → tarih + 1).
const statuses: Record<string, StayDayStatus> = {
  '2026-11-10': 'check-in-only',
  '2026-11-11': 'check-out-only',
  '2026-11-12': 'closed',
  '2026-11-14': 'booked', // önceki gece (13’ü) boş
  '2026-11-15': 'booked', // önceki gece de dolu
};
const rules = stayRules({ getDayStatus: (date) => statuses[date] });
const engine = createSelectionEngine({
  rules,
  state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' },
  today: null,
});

// [canStart (giriş), canEnd (çıkış), canPassThrough (konaklama içindeki gece), sebep]
const flags = (date: string) => {
  const a = engine.availability(toCalendarDate(date));
  return [a.canStart, a.canEnd, a.canPassThrough, a.reason ?? null];
};

export const available = flags('2026-11-13'); // → [true, true, true, null]
export const checkInOnly = flags('2026-11-10'); // → [true, false, true, "check-in-only"]
export const checkOutOnly = flags('2026-11-11'); // → [false, true, false, "check-out-only"]
export const closed = flags('2026-11-12'); // → [false, false, false, "closed"]
export const firstBooked = flags('2026-11-14'); // → [false, true, false, "check-out-only"]
export const laterBooked = flags('2026-11-15'); // → [false, false, false, "booked"]

// İlk dolu gecenin sabahında çıkış: geçerli.
export const checkOutOnBooked = engine.validateRange(toCalendarDate('2026-11-13'), toCalendarDate('2026-11-14')); // → {"valid": true, "issue": null}
// Dolu geceyi kapsayan konaklama: dolu gece aralığı engeller.
export const acrossBooked = engine.validateRange(toCalendarDate('2026-11-13'), toCalendarDate('2026-11-17')).issue; // → {"code": "blocked-in-range", "date": "2026-11-14", "dayReason": "check-out-only"}
