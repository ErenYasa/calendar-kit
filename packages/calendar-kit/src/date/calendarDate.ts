/**
 * Time-zone independent calendar day arithmetic.
 *
 * Days are represented as validated `YYYY-MM-DD` strings (`CalendarDate`) and
 * months as `YYYY-MM` strings (`CalendarMonth`). All arithmetic goes through an
 * integer "epoch day" number computed with the proleptic Gregorian civil
 * calendar algorithm, so it is never affected by DST or the host time zone.
 * `new Date(string)` is never used for parsing.
 */

declare const dateBrand: unique symbol;
declare const monthBrand: unique symbol;

/** A validated Gregorian calendar day in `YYYY-MM-DD` form (no time, no zone). */
export type CalendarDate = string & { readonly [dateBrand]: true };
/** A validated Gregorian month in `YYYY-MM` form. */
export type CalendarMonth = string & { readonly [monthBrand]: true };

/** 0 = Sunday … 6 = Saturday (same numbering as `Date#getDay`). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DateParts {
  year: number;
  /** 1–12 */
  month: number;
  /** 1–31 */
  day: number;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_RE = /^(\d{4})-(\d{2})$/;

export const MIN_YEAR = 1;
export const MAX_YEAR = 9999;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

function validParts(year: number, month: number, day: number): boolean {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    year >= MIN_YEAR &&
    year <= MAX_YEAR &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

/** Builds a date from parts. Returns `null` for impossible dates (e.g. 2026-02-30). */
export function createDate(year: number, month: number, day: number): CalendarDate | null {
  if (!validParts(year, month, day)) return null;
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}` as CalendarDate;
}

/** Strictly parses `YYYY-MM-DD`. Returns `null` for anything else. */
export function parseDate(input: unknown): CalendarDate | null {
  if (typeof input !== 'string') return null;
  const m = DATE_RE.exec(input);
  if (!m) return null;
  return createDate(Number(m[1]), Number(m[2]), Number(m[3]));
}

/** Type guard: `true` only for a real `YYYY-MM-DD` Gregorian date. */
export function isCalendarDate(input: unknown): input is CalendarDate {
  return parseDate(input) !== null;
}

/** Like `parseDate` but throws a `RangeError` for invalid input. Handy for literals. */
export function toCalendarDate(input: string): CalendarDate {
  const d = parseDate(input);
  if (!d) throw new RangeError(`Invalid calendar date "${input}" (expected YYYY-MM-DD)`);
  return d;
}

export function getDateParts(date: CalendarDate): DateParts {
  return {
    year: Number(date.slice(0, 4)),
    month: Number(date.slice(5, 7)),
    day: Number(date.slice(8, 10)),
  };
}

// Days from 1970-01-01 (Howard Hinnant's days_from_civil). Pure integer math.
export function toEpochDay(date: CalendarDate): number {
  const { year, month, day } = getDateParts(date);
  const y = month <= 2 ? year - 1 : year;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const mp = (month + 9) % 12;
  const doy = Math.floor((153 * mp + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function fromEpochDay(epochDay: number): CalendarDate {
  const z = epochDay + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const day = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const month = mp < 10 ? mp + 3 : mp - 9;
  const year = yoe + era * 400 + (month <= 2 ? 1 : 0);
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}` as CalendarDate;
}

export function addDays(date: CalendarDate, amount: number): CalendarDate {
  return fromEpochDay(toEpochDay(date) + amount);
}

/** Calendar-day difference `b - a` (DST independent). */
export function diffDays(a: CalendarDate, b: CalendarDate): number {
  return toEpochDay(b) - toEpochDay(a);
}

export function compareDates(a: CalendarDate, b: CalendarDate): number {
  // Zero-padded ISO strings compare lexicographically in chronological order.
  return a < b ? -1 : a > b ? 1 : 0;
}

export const isBefore = (a: CalendarDate, b: CalendarDate): boolean => a < b;
export const isAfter = (a: CalendarDate, b: CalendarDate): boolean => a > b;
export const isSameDate = (a: CalendarDate | null | undefined, b: CalendarDate | null | undefined): boolean =>
  a != null && a === b;

export function minDate(a: CalendarDate, b: CalendarDate): CalendarDate {
  return a <= b ? a : b;
}
export function maxDate(a: CalendarDate, b: CalendarDate): CalendarDate {
  return a >= b ? a : b;
}

/** `true` when `date` is within `[start, end]` (inclusive). */
export function isWithin(date: CalendarDate, start: CalendarDate, end: CalendarDate): boolean {
  return date >= start && date <= end;
}

export function getWeekday(date: CalendarDate): Weekday {
  // 1970-01-01 was a Thursday (4).
  return ((((toEpochDay(date) + 4) % 7) + 7) % 7) as Weekday;
}

/** Every date from `start` to `end`, both inclusive. Empty when end < start. */
export function eachDay(start: CalendarDate, end: CalendarDate): CalendarDate[] {
  const out: CalendarDate[] = [];
  const s = toEpochDay(start);
  const e = toEpochDay(end);
  for (let d = s; d <= e; d++) out.push(fromEpochDay(d));
  return out;
}

// ---------------------------------------------------------------- months

export function createMonth(year: number, month: number): CalendarMonth | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || year < MIN_YEAR || year > MAX_YEAR) return null;
  if (month < 1 || month > 12) return null;
  return `${pad(year, 4)}-${pad(month, 2)}` as CalendarMonth;
}

/** Accepts `YYYY-MM` or a full `YYYY-MM-DD` (day is dropped). */
export function parseMonth(input: unknown): CalendarMonth | null {
  if (typeof input !== 'string') return null;
  const d = parseDate(input);
  if (d) return d.slice(0, 7) as CalendarMonth;
  const m = MONTH_RE.exec(input);
  return m ? createMonth(Number(m[1]), Number(m[2])) : null;
}

export function toCalendarMonth(input: string): CalendarMonth {
  const m = parseMonth(input);
  if (!m) throw new RangeError(`Invalid calendar month "${input}" (expected YYYY-MM)`);
  return m;
}

export function getMonth(date: CalendarDate): CalendarMonth {
  return date.slice(0, 7) as CalendarMonth;
}

export function getMonthParts(month: CalendarMonth): { year: number; month: number } {
  return { year: Number(month.slice(0, 4)), month: Number(month.slice(5, 7)) };
}

function monthIndex(month: CalendarMonth): number {
  const p = getMonthParts(month);
  return p.year * 12 + (p.month - 1);
}

function monthFromIndex(index: number): CalendarMonth {
  const year = Math.floor(index / 12);
  const m = index - year * 12 + 1;
  const clampedYear = Math.min(MAX_YEAR, Math.max(MIN_YEAR, year));
  return `${pad(clampedYear, 4)}-${pad(clampedYear === year ? m : clampedYear === MIN_YEAR ? 1 : 12, 2)}` as CalendarMonth;
}

export function addMonthsToMonth(month: CalendarMonth, amount: number): CalendarMonth {
  return monthFromIndex(monthIndex(month) + amount);
}

/** Number of months from `a` to `b` (`b - a`). */
export function diffMonths(a: CalendarMonth, b: CalendarMonth): number {
  return monthIndex(b) - monthIndex(a);
}

export function firstDayOfMonth(month: CalendarMonth): CalendarDate {
  return `${month}-01` as CalendarDate;
}

export function lastDayOfMonth(month: CalendarMonth): CalendarDate {
  const { year, month: m } = getMonthParts(month);
  return `${month}-${pad(daysInMonth(year, m), 2)}` as CalendarDate;
}

/** Adds months to a date, clamping the day (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(date: CalendarDate, amount: number): CalendarDate {
  const target = addMonthsToMonth(getMonth(date), amount);
  const { year, month } = getMonthParts(target);
  const day = Math.min(getDateParts(date).day, daysInMonth(year, month));
  return `${target}-${pad(day, 2)}` as CalendarDate;
}

export function clampDate(date: CalendarDate, min?: CalendarDate | null, max?: CalendarDate | null): CalendarDate {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

export function clampMonth(month: CalendarMonth, min?: CalendarMonth | null, max?: CalendarMonth | null): CalendarMonth {
  if (min && month < min) return min;
  if (max && month > max) return max;
  return month;
}

export function eachMonth(start: CalendarMonth, count: number): CalendarMonth[] {
  const out: CalendarMonth[] = [];
  for (let i = 0; i < count; i++) out.push(addMonthsToMonth(start, i));
  return out;
}

// ---------------------------------------------------------------- "today"

/**
 * Returns the calendar day of `now` as observed in `timeZone` (IANA name).
 * Without a time zone the host's local zone is used. Both arguments are
 * explicit so the result is deterministic and testable.
 */
export function getToday(options: { timeZone?: string; now?: Date | number } = {}): CalendarDate {
  const now = options.now === undefined ? new Date() : new Date(options.now);
  if (!options.timeZone) {
    return createDate(now.getFullYear(), now.getMonth() + 1, now.getDate()) as CalendarDate;
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: options.timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return createDate(get('year'), get('month'), get('day')) as CalendarDate;
}

/** Converts a JS Date to the calendar day it represents in `timeZone` (default: local). */
export function fromJSDate(date: Date, timeZone?: string): CalendarDate {
  return getToday({ now: date, timeZone });
}

/**
 * A `Date` at UTC midnight of the day. Pair with `timeZone: 'UTC'` when
 * formatting with `Intl.DateTimeFormat` to avoid any zone shift.
 */
export function toUTCDate(date: CalendarDate): Date {
  const { year, month, day } = getDateParts(date);
  const d = new Date(Date.UTC(2000, month - 1, day));
  d.setUTCFullYear(year);
  return d;
}
