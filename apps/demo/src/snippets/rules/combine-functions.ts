import { type SelectionRules, combineRules, createSelectionEngine, toCalendarDate, toCalendarMonth } from 'calendar-kit/core';

const calls: string[] = [];
const schedule: SelectionRules = {
  // Arrivals only on the 14th, as a schedule restriction.
  getDayAvailability: (date) => (date === '2026-11-14' ? { canEnd: false, reason: 'check-in-only', schedule: true } : undefined),
  getDataStatus: () => 'loading',
  validateSelection: () => {
    calls.push('schedule');
    return null;
  },
};
const maintenance: SelectionRules = {
  getDayAvailability: (date) => (date === '2026-11-14' ? { canStart: false, reason: 'maintenance' } : undefined),
  getDataStatus: (month) => (month === '2026-12' ? 'error' : 'loaded'),
  validateSelection: () => {
    calls.push('maintenance');
    return { code: 'custom', message: 'Fully booked' };
  },
};
const last: SelectionRules = {
  validateSelection: () => {
    calls.push('last');
    return { code: 'custom', message: 'Never reached' };
  },
};
const rules = combineRules(schedule, maintenance, last);
const engine = createSelectionEngine({
  rules: { ...rules, unknownDataPolicy: 'allow' },
  state: { selection: { mode: 'single', value: null }, activeEndpoint: 'start' },
  today: null,
});

// Availability: flags are AND-ed, the first restricting result supplies the reason,
// and the day is "schedule" only when every restricting side says so.
export const merged = engine.availability(toCalendarDate('2026-11-14')); // → {"closed": false, "canStart": false, "canEnd": false, "canPassThrough": true, "schedule": false, "reason": "check-in-only"}
// Data status: the worst status wins (error > loading > unknown > loaded).
export const november = rules.getDataStatus!(toCalendarMonth('2026-11')); // → "loading"
export const december = rules.getDataStatus!(toCalendarMonth('2026-12')); // → "error"
// Validators run in order; the first issue wins and later validators are not called.
export const issue = engine.validate({ mode: 'single', value: toCalendarDate('2026-11-20') }).issue; // → {"code": "custom", "message": "Fully booked"}
export const called = calls; // → ["schedule", "maintenance"]
