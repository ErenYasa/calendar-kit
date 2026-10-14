/**
 * Optional selection adapters. They translate product vocabulary
 * (nights, check-in-only, …) into the generic `SelectionRules` of the core.
 * The core itself never knows about stays, boats or events.
 */
import { type CalendarDate, type Weekday, addDays } from '../date/calendarDate';
import type { DayAvailability, RuleContext, SelectionRules } from '../core/types';

type BaseRules<TContext> = Pick<
  SelectionRules<TContext>,
  'minDate' | 'maxDate' | 'disablePast' | 'disableFuture' | 'getDataStatus' | 'unknownDataPolicy' | 'validateSelection'
>;

// ------------------------------------------------------------------ stays

/**
 * Status of the *night that starts* on a date (date → date + 1).
 * - `available`: free night
 * - `booked`: night taken; the morning is still free to check out
 * - `closed`: nothing possible that day (no arrival, no departure)
 * - `check-in-only`: arrivals allowed, departures not
 * - `check-out-only`: departures allowed, the night itself is not
 */
export type StayDayStatus = 'available' | 'booked' | 'closed' | 'check-in-only' | 'check-out-only';

export interface StayRulesOptions<TContext = unknown> extends BaseRules<TContext> {
  minNights?: number;
  maxNights?: number;
  fixedNights?: number;
  /** Allow `start === end` (day-use). Time rules stay in the consumer app. Default `false`. */
  allowSameDay?: boolean;
  checkInWeekdays?: readonly Weekday[];
  checkOutWeekdays?: readonly Weekday[];
  /** Weekdays with service; nights on other weekdays are closed (schedule rule). */
  availableWeekdays?: readonly Weekday[];
  getDayStatus?: (date: CalendarDate, ctx: RuleContext<TContext>) => StayDayStatus | null | undefined;
}

/** Reason tags produced by `stayRules` (found in `ValidationIssue.dayReason`). */
export type StayReason = 'booked' | 'closed' | 'check-in-only' | 'check-out-only';

/**
 * Overnight stays with `[start, end)` semantics: `end` is the check-out day and
 * is not included. 13 → 20 Nov = 7 nights. Every night in the stay is validated,
 * the check-out day only needs to allow departures.
 */
export function stayRules<TContext = unknown>(options: StayRulesOptions<TContext> = {}): SelectionRules<TContext> {
  const { getDayStatus, minNights, maxNights, fixedNights, allowSameDay, checkInWeekdays, checkOutWeekdays, availableWeekdays, ...base } = options;
  const rules: SelectionRules<TContext> = {
    ...base,
    rangeSemantics: 'exclusive',
    allowSameDay: allowSameDay ?? false,
    requireReachableEnd: true,
  };
  if (minNights != null) rules.minLength = minNights;
  if (maxNights != null) rules.maxLength = maxNights;
  if (fixedNights != null) rules.fixedLength = fixedNights;
  if (checkInWeekdays) rules.startWeekdays = checkInWeekdays;
  if (checkOutWeekdays) rules.endWeekdays = checkOutWeekdays;
  if (availableWeekdays) rules.availableWeekdays = availableWeekdays;
  if (getDayStatus) {
    rules.getDayAvailability = (date, ctx): DayAvailability | undefined => {
      const status = getDayStatus(date, ctx) ?? 'available';
      switch (status) {
        case 'closed':
          return { closed: true, reason: 'closed' };
        case 'check-in-only':
          return { canEnd: false, reason: 'check-in-only' };
        case 'check-out-only':
          return { canStart: false, canPassThrough: false, reason: 'check-out-only' };
        case 'booked': {
          // A departure only makes sense if the previous night could be ours.
          const prev = getDayStatus(addDays(date, -1), ctx) ?? 'available';
          if (prev === 'booked' || prev === 'closed' || prev === 'check-out-only') return { closed: true, reason: 'booked' };
          return { canStart: false, canPassThrough: false, reason: 'check-out-only' };
        }
        default:
          return undefined;
      }
    };
  }
  return rules;
}

// --------------------------------------------------------- inclusive days

/**
 * Status of a whole day for inclusive ranges.
 * - `start-only` / `end-only`: may only begin / finish a range there
 */
export type DayRangeStatus = 'available' | 'closed' | 'start-only' | 'end-only';

export interface DayRangeRulesOptions<TContext = unknown> extends BaseRules<TContext> {
  minDays?: number;
  maxDays?: number;
  fixedDays?: number;
  startWeekdays?: readonly Weekday[];
  endWeekdays?: readonly Weekday[];
  /** Weekdays with service, e.g. weekends only `[6, 0]` (schedule rule). */
  availableWeekdays?: readonly Weekday[];
  /** First click selects a single day; a second click extends it to a range. */
  singleDayFirst?: boolean;
  getDayStatus?: (date: CalendarDate, ctx: RuleContext<TContext>) => DayRangeStatus | null | undefined;
}

/**
 * Day-based bookings (boat days, multi-day events, rentals) with `[start, end]`
 * semantics: 13 → 20 Nov = 8 days. Picking the same day twice gives a 1-day range.
 */
export function dayRangeRules<TContext = unknown>(options: DayRangeRulesOptions<TContext> = {}): SelectionRules<TContext> {
  const { getDayStatus, minDays, maxDays, fixedDays, startWeekdays, endWeekdays, availableWeekdays, singleDayFirst, ...base } = options;
  const rules: SelectionRules<TContext> = { ...base, rangeSemantics: 'inclusive', allowSameDay: true, requireReachableEnd: true };
  if (minDays != null) rules.minLength = minDays;
  if (maxDays != null) rules.maxLength = maxDays;
  if (fixedDays != null) rules.fixedLength = fixedDays;
  if (startWeekdays) rules.startWeekdays = startWeekdays;
  if (endWeekdays) rules.endWeekdays = endWeekdays;
  if (availableWeekdays) rules.availableWeekdays = availableWeekdays;
  if (singleDayFirst) rules.singleDayFirst = true;
  if (getDayStatus) {
    rules.getDayAvailability = (date, ctx) => {
      switch (getDayStatus(date, ctx) ?? 'available') {
        case 'closed':
          return { closed: true, reason: 'closed' };
        case 'start-only':
          return { canEnd: false, canPassThrough: false, reason: 'start-only' };
        case 'end-only':
          return { canStart: false, canPassThrough: false, reason: 'end-only' };
        default:
          return undefined;
      }
    };
  }
  return rules;
}

// --------------------------------------------------------- simple helpers

/** Closes every date contained in the given iterable/set (O(1) lookups with a `Set`). */
export function closedDates<TContext = unknown>(dates: Iterable<CalendarDate>, reason = 'closed'): SelectionRules<TContext> {
  const set = dates instanceof Set ? (dates as Set<CalendarDate>) : new Set(dates);
  return { getDayAvailability: (date) => (set.has(date) ? { closed: true, reason } : undefined) };
}
