import { type SelectionRules, combineRules, createSelectionEngine, dayRangeRules, relaxRules, toCalendarDate } from 'calendar-kit/core';

// Boats sail Saturday → Saturday (8 days); the 18th is under maintenance (real).
const boat = dayRangeRules({
  startWeekdays: [6],
  endWeekdays: [6],
  minDays: 8,
  getDayStatus: (date) => (date === '2026-11-18' ? 'closed' : undefined),
});
// Your own schedule restriction: no departures on the 11th.
const noWednesday: SelectionRules = {
  getDayAvailability: (date) => (date === '2026-11-11' ? { closed: true, reason: 'out-of-schedule', schedule: true } : undefined),
};
const rules = combineRules(boat, noWednesday);
const relaxed = relaxRules(rules);
const lengthOnly = relaxRules(rules, { weekdays: false });

const check = (r: SelectionRules, start: string, end: string) =>
  createSelectionEngine({ rules: r, state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' }, today: null })
    .validateRange(toCalendarDate(start), toCalendarDate(end)).issue?.code ?? 'valid';

// Tuesday 10th → Thursday 12th: blocked by the schedule, fine once relaxed.
export const strict = check(rules, '2026-11-10', '2026-11-12'); // → "weekday-start"
export const custom = check(relaxed, '2026-11-10', '2026-11-12'); // → "valid"
// Real unavailability stays: the 18th is still closed.
export const maintenance = check(relaxed, '2026-11-16', '2026-11-20'); // → "blocked-in-range"
// { weekdays: false } relaxes only the length rules.
export const weekdaysKept = check(lengthOnly, '2026-11-10', '2026-11-12'); // → "weekday-start"
export const lengthDropped = [relaxed.minLength ?? null, lengthOnly.minLength ?? null, lengthOnly.startWeekdays]; // → [null, null, [6]]
