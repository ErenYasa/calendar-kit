import { formatDate, formatMonth, getDefaultFirstDayOfWeek, getLocaleDirection, getWeekdayNames, toCalendarDate, toCalendarMonth } from 'calendar-kit/core';

const date = toCalendarDate('2026-11-13');

// Her türlü Intl.DateTimeFormat seçeneği; gün, sunucunun/cihazın saat dilimiyle asla kaymaz.
export const medium = formatDate(date, 'en-US', { dateStyle: 'medium' }); // → "Nov 13, 2026"
export const german = formatDate(date, 'de-DE', { day: 'numeric', month: 'long', year: 'numeric' }); // → "13. November 2026"

// Ay başlıkları: seçenek vermezseniz “ay yıl”.
export const title = formatMonth(toCalendarMonth('2026-11'), 'en-US'); // → "November 2026"
export const turkish = formatMonth(toCalendarMonth('2026-11'), 'tr-TR'); // → "Kasım 2026"
export const short = formatMonth(toCalendarMonth('2026-11'), 'en-US', { month: 'short' }); // → "Nov"

// Hafta günü başlık hücreleri, pazartesiden (1) başlayarak.
export const header = getWeekdayNames('en-US', 1).map((w) => w.short); // → ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
export const firstCell = getWeekdayNames('en-US', 1)[0]; // → {"weekday":1,"short":"Mon","long":"Monday"}
export const narrow = getWeekdayNames('de-DE', 1, 'narrow').map((w) => w.short); // → ["M","D","M","D","F","S","S"]

// Sabit bölge tabloları: 0 = pazar, 1 = pazartesi, 6 = cumartesi.
export const firstDays = ['en-US', 'en-GB', 'de', 'ar-EG', 'he'].map(getDefaultFirstDayOfWeek); // → [0,1,1,6,0]
export const noLocale = getDefaultFirstDayOfWeek(undefined); // → 0
export const directions = ['en-US', 'ar-EG', 'he', 'fa-IR'].map(getLocaleDirection); // → ["ltr","rtl","rtl","rtl"]
