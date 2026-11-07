import {
  daysInMonth,
  firstDayOfMonth,
  getDateParts,
  getMonth,
  getMonthParts,
  getWeekday,
  isLeapYear,
  lastDayOfMonth,
  toCalendarDate,
  toCalendarMonth,
} from 'calendar-kit/core';

const date = toCalendarDate('2026-11-07');

export const parts = getDateParts(date); // → {"year":2026,"month":11,"day":7}
export const weekday = getWeekday(date); // → 6
export const month = getMonth(date); // → "2026-11"
export const monthParts = getMonthParts(toCalendarMonth('2026-11')); // → {"year":2026,"month":11}

export const first = firstDayOfMonth(toCalendarMonth('2024-02')); // → "2024-02-01"
export const last = lastDayOfMonth(toCalendarMonth('2024-02')); // → "2024-02-29"
export const februaryLength = daysInMonth(2026, 2); // → 28
export const leap = [isLeapYear(2024), isLeapYear(1900), isLeapYear(2000)]; // → [true,false,true]
