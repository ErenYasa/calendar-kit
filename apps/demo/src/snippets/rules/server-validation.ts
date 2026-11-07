// Server side (API route, server action, worker): re-check a booking request
// with the same rules the calendar used. No React involved.
import { type CalendarDate, createSelectionEngine, stayRules, toCalendarDate } from 'calendar-kit/core';

const booked = new Set(['2026-11-20', '2026-11-21']); // from your database
const rules = stayRules({
  minNights: 2,
  maxNights: 14,
  disablePast: true,
  getDayStatus: (date) => (booked.has(date) ? 'booked' : undefined),
});

export function validateBooking(request: { start: string; end: string }, today: CalendarDate) {
  const engine = createSelectionEngine({
    rules,
    today,
    state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' },
  });
  // validate() parses untrusted strings itself and reports invalid-date.
  return engine.validate({ mode: 'range', value: { start: request.start as CalendarDate, end: request.end as CalendarDate } });
}

const today = toCalendarDate('2026-11-07');

// Check-out on the morning of the first booked night is allowed.
export const ok = validateBooking({ start: '2026-11-13', end: '2026-11-20' }, today); // → {"valid": true, "issue": null}
export const tooShort = validateBooking({ start: '2026-11-13', end: '2026-11-14' }, today).issue; // → {"code": "min-length", "date": "2026-11-14", "params": {"min": 2, "actual": 1, "unit": "nights"}}
export const overlaps = validateBooking({ start: '2026-11-18', end: '2026-11-23' }, today).issue; // → {"code": "blocked-in-range", "date": "2026-11-20", "dayReason": "check-out-only"}
export const past = validateBooking({ start: '2026-11-01', end: '2026-11-04' }, today).issue; // → {"code": "past", "date": "2026-11-01", "params": {"today": "2026-11-07"}}
export const invalid = validateBooking({ start: '2026-02-30', end: '2026-03-02' }, today).issue; // → {"code": "invalid-date", "params": {"field": "start", "value": "2026-02-30"}}
