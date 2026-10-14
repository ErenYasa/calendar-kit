import { type CalendarDate, type CalendarMonth, type Weekday, firstDayOfMonth, toUTCDate } from './calendarDate';

/**
 * Locale helpers built on `Intl.DateTimeFormat`. Dates are always formatted
 * from a UTC-midnight `Date` with `timeZone: 'UTC'`, so the host zone can never
 * shift the day. Formatter instances are memoised per (locale, options); this
 * cache is the only module-level state and is never observable by consumers.
 */

const cache = new Map<string, Intl.DateTimeFormat>();

export function getFormatter(locale: string | undefined, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale ?? ''}|${JSON.stringify(options)}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' });
    cache.set(key, f);
  }
  return f;
}

export function formatDate(date: CalendarDate, locale: string | undefined, options: Intl.DateTimeFormatOptions): string {
  return getFormatter(locale, options).format(toUTCDate(date));
}

export function formatMonth(
  month: CalendarMonth,
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' },
): string {
  return formatDate(firstDayOfMonth(month), locale, options);
}

/** Weekday names ordered starting at `firstDayOfWeek`. */
export function getWeekdayNames(
  locale: string | undefined,
  firstDayOfWeek: Weekday,
  format: Intl.DateTimeFormatOptions['weekday'] = 'short',
): { weekday: Weekday; short: string; long: string }[] {
  const out: { weekday: Weekday; short: string; long: string }[] = [];
  // 2023-01-01 was a Sunday.
  for (let i = 0; i < 7; i++) {
    const weekday = ((firstDayOfWeek + i) % 7) as Weekday;
    const date = `2023-01-0${1 + weekday}` as CalendarDate;
    out.push({
      weekday,
      short: formatDate(date, locale, { weekday: format }),
      long: formatDate(date, locale, { weekday: 'long' }),
    });
  }
  return out;
}

// Static, deterministic tables (no runtime `Intl.Locale#weekInfo`, which is not
// available everywhere and could differ between server and browser).
const SUNDAY_REGIONS = new Set([
  'US', 'CA', 'MX', 'BR', 'JP', 'KR', 'TW', 'HK', 'IL', 'PH', 'IN', 'ZA', 'AU', 'SA', 'PE', 'CO', 'VE', 'GT', 'PR', 'TH', 'ID',
]);
const SATURDAY_REGIONS = new Set(['AE', 'AF', 'BH', 'DJ', 'DZ', 'EG', 'IQ', 'IR', 'JO', 'KW', 'LY', 'OM', 'QA', 'SD', 'SY']);
const LANGUAGE_DEFAULT_REGION: Record<string, string> = { en: 'US', ja: 'JP', ko: 'KR', he: 'IL', ar: 'EG', fa: 'IR', pt: 'BR', hi: 'IN', th: 'TH', id: 'ID', zh: 'CN' };
const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'yi', 'dv', 'ckb', 'sd', 'ug']);

function splitLocale(locale: string | undefined): { language: string; region?: string } {
  const parts = (locale ?? 'en-US').replace(/_/g, '-').split('-');
  const language = (parts[0] ?? 'en').toLowerCase();
  const region = parts.slice(1).find((p) => /^[A-Za-z]{2}$|^\d{3}$/.test(p))?.toUpperCase();
  return region ? { language, region } : { language };
}

/** Default first day of week for a locale (0 = Sunday, 1 = Monday, 6 = Saturday). */
export function getDefaultFirstDayOfWeek(locale: string | undefined): Weekday {
  const { language, region } = splitLocale(locale);
  const r = region ?? LANGUAGE_DEFAULT_REGION[language];
  if (!r) return 1;
  if (SUNDAY_REGIONS.has(r)) return 0;
  if (SATURDAY_REGIONS.has(r)) return 6;
  return 1;
}

export function getLocaleDirection(locale: string | undefined): 'ltr' | 'rtl' {
  return RTL_LANGUAGES.has(splitLocale(locale).language) ? 'rtl' : 'ltr';
}
