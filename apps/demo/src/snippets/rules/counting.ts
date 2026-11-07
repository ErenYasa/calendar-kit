import { countDays, countNights, getIncludedDays, toCalendarDate } from 'calendar-kit/core';

const range = { start: toCalendarDate('2026-11-13'), end: toCalendarDate('2026-11-20') };

// Exclusive (stayRules): 20 Nov is the check-out day, not a night.
export const nights = countNights(range); // → 7
// Inclusive (dayRangeRules): both endpoints are days of the booking.
export const days = countDays(range); // → 8
// The nights of the stay, named by the date each night starts.
export const lastNight = getIncludedDays(range, 'exclusive').slice(-1)[0]; // → "2026-11-19"
export const lastDay = getIncludedDays(range, 'inclusive').slice(-1)[0]; // → "2026-11-20"
