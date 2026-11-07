import { type SelectionRules, createSelectionEngine, relaxRules, stayRules, toCalendarDate } from 'calendar-kit/core';

const check = (rules: SelectionRules, start: string, end: string) =>
  createSelectionEngine({ rules, state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' }, today: null })
    .validateRange(toCalendarDate(start), toCalendarDate(end)).issue ?? 'valid';

// Friday and Saturday nights only. 13 Nov 2026 is a Friday.
const weekendNights = stayRules({ availableWeekdays: [5, 6] });
export const oneNight = check(weekendNights, '2026-11-13', '2026-11-14'); // → "valid"
// Only the nights are restricted: the Sunday morning is a valid check-out.
export const twoNights = check(weekendNights, '2026-11-13', '2026-11-15'); // → "valid"
// A Sunday night is still closed, inside a stay or as a check-in.
export const sundayNight = check(weekendNights, '2026-11-13', '2026-11-16'); // → {"code": "blocked-in-range", "date": "2026-11-15", "dayReason": "out-of-schedule"}
export const noSundayArrival = check(weekendNights, '2026-11-15', '2026-11-16'); // → {"code": "start-not-allowed", "date": "2026-11-15", "dayReason": "out-of-schedule"}
// It is a schedule rule: relaxRules (the relaxSchedule prop) removes it.
export const relaxed = check(relaxRules(weekendNights), '2026-11-15', '2026-11-16'); // → "valid"
