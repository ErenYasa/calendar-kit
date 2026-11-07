import { type SelectionRules, type Weekday, combineRules, createSelectionEngine, getWeekday, stayRules, toCalendarDate } from 'calendar-kit/core';

const check = (rules: SelectionRules, start: string, end: string) =>
  createSelectionEngine({ rules, state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' }, today: null })
    .validateRange(toCalendarDate(start), toCalendarDate(end)).issue ?? 'valid';

// Friday and Saturday nights only. 13 Nov 2026 is a Friday.
const weekendNights = stayRules({ availableWeekdays: [5, 6] });
export const oneNight = check(weekendNights, '2026-11-13', '2026-11-14'); // → "valid"
// The Sunday is closed as a whole, so it cannot be the check-out day either.
export const twoNights = check(weekendNights, '2026-11-13', '2026-11-15'); // → {"code": "closed", "date": "2026-11-15", "dayReason": "out-of-schedule"}

// To keep departures on the other days, restrict them yourself and mark it as schedule.
const service: readonly Weekday[] = [5, 6];
const departuresAllowed = combineRules(stayRules({}), {
  getDayAvailability: (date) =>
    service.includes(getWeekday(date)) ? undefined : { canStart: false, canPassThrough: false, reason: 'out-of-schedule', schedule: true },
});
export const twoNightsFixed = check(departuresAllowed, '2026-11-13', '2026-11-15'); // → "valid"
export const noSundayArrival = check(departuresAllowed, '2026-11-15', '2026-11-16'); // → {"code": "start-not-allowed", "date": "2026-11-15", "dayReason": "out-of-schedule"}
