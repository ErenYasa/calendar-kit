import { type StayDayStatus, createSelectionEngine, stayRules, toCalendarDate } from 'calendar-kit/core';

// A status describes the night that starts on the date (date → date + 1).
const statuses: Record<string, StayDayStatus> = {
  '2026-11-10': 'check-in-only',
  '2026-11-11': 'check-out-only',
  '2026-11-12': 'closed',
  '2026-11-14': 'booked', // the night before (13th) is free
  '2026-11-15': 'booked', // the night before is booked too
};
const rules = stayRules({ getDayStatus: (date) => statuses[date] });
const engine = createSelectionEngine({
  rules,
  state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' },
  today: null,
});

// [canStart (check-in), canEnd (check-out), canPassThrough (night inside a stay), reason]
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

// Check out on the morning of the first booked night: valid.
export const checkOutOnBooked = engine.validateRange(toCalendarDate('2026-11-13'), toCalendarDate('2026-11-14')); // → {"valid": true, "issue": null}
// Stay across it: the booked night blocks the range.
export const acrossBooked = engine.validateRange(toCalendarDate('2026-11-13'), toCalendarDate('2026-11-17')).issue; // → {"code": "blocked-in-range", "date": "2026-11-14", "dayReason": "check-out-only"}
