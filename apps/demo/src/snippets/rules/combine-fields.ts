import { type SelectionRules, combineRules, toCalendarDate } from 'calendar-kit/core';

const season: SelectionRules = {
  minDate: toCalendarDate('2026-11-01'),
  maxDate: toCalendarDate('2026-12-31'),
  disablePast: true,
  rangeSemantics: 'inclusive',
  fixedLength: 3,
  minLength: 2,
  maxLength: 14,
  startWeekdays: [5, 6, 0],
  availableWeekdays: [1, 2, 3, 4, 5, 6, 0],
};
const product: SelectionRules = {
  minDate: toCalendarDate('2026-11-10'),
  maxDate: toCalendarDate('2027-01-31'),
  disablePast: false,
  rangeSemantics: 'exclusive',
  fixedLength: undefined, // explicit undefined = "not set here"
  minLength: 3,
  maxLength: 7,
  startWeekdays: [6, 0, 1],
  endWeekdays: [0],
};
const rules = combineRules(season, product);

// Bounds intersect: the latest minDate and the earliest maxDate.
export const bounds = [rules.minDate, rules.maxDate]; // → ["2026-11-10", "2026-12-31"]
// Booleans are OR-ed: one set asking for it is enough.
export const disablePast = rules.disablePast; // → true
// Lengths: the largest minimum and the smallest maximum.
export const lengths = [rules.minLength, rules.maxLength]; // → [3, 7]
// Weekday lists intersect; a list defined by only one set is kept as is.
export const startWeekdays = rules.startWeekdays; // → [6, 0]
export const endWeekdays = rules.endWeekdays; // → [0]
// Scalars come from the last set that defines them (undefined does not count).
export const semantics = rules.rangeSemantics; // → "exclusive"
export const fixedLength = rules.fixedLength; // → 3
