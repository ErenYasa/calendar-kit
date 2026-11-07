import { compareDates, isAfter, isBefore, isSameDate, isWithin, toCalendarDate } from 'calendar-kit/core';

const a = toCalendarDate('2026-11-13');
const b = toCalendarDate('2026-11-20');

export const sorted = [b, a].sort(compareDates); // → ["2026-11-13","2026-11-20"]
export const order = [compareDates(a, b), compareDates(b, a), compareDates(a, a)]; // → [-1,1,0]
export const before = isBefore(a, b); // → true
export const after = isAfter(a, a); // → false
export const same = isSameDate(a, toCalendarDate('2026-11-13')); // → true
export const nothingSelected = isSameDate(null, null); // → false

// isWithin includes both bounds.
export const onStart = isWithin(a, a, b); // → true
export const onEnd = isWithin(b, a, b); // → true
export const outside = isWithin(toCalendarDate('2026-11-21'), a, b); // → false
