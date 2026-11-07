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
  fixedLength: undefined, // açıkça undefined = "burada tanımlı değil"
  minLength: 3,
  maxLength: 7,
  startWeekdays: [6, 0, 1],
  endWeekdays: [0],
};
const rules = combineRules(season, product);

// Sınırlar kesişir: en geç minDate ve en erken maxDate.
export const bounds = [rules.minDate, rules.maxDate]; // → ["2026-11-10", "2026-12-31"]
// Boolean’lar VEYA ile birleşir: bir setin istemesi yeterlidir.
export const disablePast = rules.disablePast; // → true
// Uzunluklar: en büyük minimum ve en küçük maksimum.
export const lengths = [rules.minLength, rules.maxLength]; // → [3, 7]
// Hafta günü listeleri kesişir; yalnızca tek bir setin tanımladığı liste olduğu gibi kalır.
export const startWeekdays = rules.startWeekdays; // → [6, 0]
export const endWeekdays = rules.endWeekdays; // → [0]
// Tekil değerler, onu tanımlayan son setten gelir (undefined sayılmaz).
export const semantics = rules.rangeSemantics; // → "exclusive"
export const fixedLength = rules.fixedLength; // → 3
