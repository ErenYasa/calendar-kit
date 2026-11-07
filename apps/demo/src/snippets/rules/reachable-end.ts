import { type SelectionRules, createSelectionEngine, stayRules, toCalendarDate } from 'calendar-kit/core';

// No check-out is possible before February (every day is check-in-only).
const getDayStatus = (date: string) => (date < '2027-02-01' ? 'check-in-only' : undefined);

const checkStart = (rules: SelectionRules) =>
  createSelectionEngine({ rules, state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' }, today: null })
    .checkStart(toCalendarDate('2026-11-13'));

// Without a maximum the 63 candidates (15 Nov … 16 Jan) run out before a
// valid end is found. "Not found" is not "none": the start stays selectable.
export const unbounded = checkStart(stayRules({ getDayStatus })); // → null
// With maxNights: 30 every possible end was checked: the start is rejected.
export const bounded = checkStart(stayRules({ getDayStatus, maxNights: 30 })); // → {"code": "end-not-allowed", "date": "2026-12-13", "dayReason": "check-in-only"}
// A configured minimum above 1 night is reported as min-length instead.
export const withMinimum = checkStart(stayRules({ getDayStatus, maxNights: 30, minNights: 2 })); // → {"code": "min-length", "date": "2026-11-13", "params": {"min": 2, "unit": "nights"}, "dayReason": "check-in-only"}
