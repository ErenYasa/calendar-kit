import { formatDate, formatMonth, getDefaultFirstDayOfWeek, getLocaleDirection, getWeekdayNames, toCalendarDate, toCalendarMonth } from 'calendar-kit/core';

const date = toCalendarDate('2026-11-13');

// Any Intl.DateTimeFormat options; the day never shifts with the host zone.
export const medium = formatDate(date, 'en-US', { dateStyle: 'medium' }); // → "Nov 13, 2026"
export const german = formatDate(date, 'de-DE', { day: 'numeric', month: 'long', year: 'numeric' }); // → "13. November 2026"

// Month titles: "month year" unless you pass options.
export const title = formatMonth(toCalendarMonth('2026-11'), 'en-US'); // → "November 2026"
export const turkish = formatMonth(toCalendarMonth('2026-11'), 'tr-TR'); // → "Kasım 2026"
export const short = formatMonth(toCalendarMonth('2026-11'), 'en-US', { month: 'short' }); // → "Nov"

// Weekday header cells, starting at Monday (1).
export const header = getWeekdayNames('en-US', 1).map((w) => w.short); // → ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
export const firstCell = getWeekdayNames('en-US', 1)[0]; // → {"weekday":1,"short":"Mon","long":"Monday"}
export const narrow = getWeekdayNames('de-DE', 1, 'narrow').map((w) => w.short); // → ["M","D","M","D","F","S","S"]

// Static region tables: 0 = Sunday, 1 = Monday, 6 = Saturday.
export const firstDays = ['en-US', 'en-GB', 'de', 'ar-EG', 'he'].map(getDefaultFirstDayOfWeek); // → [0,1,1,6,0]
export const noLocale = getDefaultFirstDayOfWeek(undefined); // → 0
export const directions = ['en-US', 'ar-EG', 'he', 'fa-IR'].map(getLocaleDirection); // → ["ltr","rtl","rtl","rtl"]
