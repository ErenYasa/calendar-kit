import { type CalendarDate } from '../date/calendarDate';
import type { DayAvailability, SelectionRules } from './types';

const maxOf = (a?: CalendarDate | null, b?: CalendarDate | null) => (a && b ? (a > b ? a : b) : (a ?? b ?? null));
const minOf = (a?: CalendarDate | null, b?: CalendarDate | null) => (a && b ? (a < b ? a : b) : (a ?? b ?? null));
const maxNum = (a?: number, b?: number) => (a != null && b != null ? Math.max(a, b) : (a ?? b));
const minNum = (a?: number, b?: number) => (a != null && b != null ? Math.min(a, b) : (a ?? b));
const intersect = <T,>(a?: readonly T[], b?: readonly T[]) => (a && b ? a.filter((x) => b.includes(x)) : (a ?? b));

/**
 * Combines several rule sets into one where every rule must pass
 * (bounds intersect, availability flags are AND-ed, validators run in order).
 * Scalar semantics (`rangeSemantics`, `allowSameDay`, `fixedLength`,
 * `unknownDataPolicy`) are taken from the last rule set that defines them.
 * Inputs are never mutated.
 */
export function combineRules<TContext = unknown>(
  ...sets: (SelectionRules<TContext> | null | undefined | false)[]
): SelectionRules<TContext> {
  return sets.reduce<SelectionRules<TContext>>((acc, next) => {
    if (!next) return acc;
    const a = acc.getDayAvailability;
    const b = next.getDayAvailability;
    const va = acc.validateSelection;
    const vb = next.validateSelection;
    const out: SelectionRules<TContext> = { ...acc, ...next };
    out.minDate = maxOf(acc.minDate, next.minDate);
    out.maxDate = minOf(acc.maxDate, next.maxDate);
    out.disablePast = !!(acc.disablePast || next.disablePast);
    out.disableFuture = !!(acc.disableFuture || next.disableFuture);
    out.minLength = maxNum(acc.minLength, next.minLength);
    out.maxLength = minNum(acc.maxLength, next.maxLength);
    out.maxSelections = minNum(acc.maxSelections, next.maxSelections);
    out.startWeekdays = intersect(acc.startWeekdays, next.startWeekdays);
    out.endWeekdays = intersect(acc.endWeekdays, next.endWeekdays);
    out.availableWeekdays = intersect(acc.availableWeekdays, next.availableWeekdays);
    out.requireReachableEnd = !!(acc.requireReachableEnd || next.requireReachableEnd);
    out.singleDayFirst = !!(acc.singleDayFirst || next.singleDayFirst);
    if (acc.getDataStatus && next.getDataStatus) {
      const da = acc.getDataStatus;
      const db = next.getDataStatus;
      const rank = { error: 3, loading: 2, unknown: 1, loaded: 0 } as const;
      out.getDataStatus = (m) => {
        const x = da(m);
        const y = db(m);
        return rank[x] >= rank[y] ? x : y;
      };
    }
    if (a && b) out.getDayAvailability = (date, ctx) => mergeAvailability(a(date, ctx) || undefined, b(date, ctx) || undefined);
    if (va && vb) out.validateSelection = (sel, ctx) => va(sel, ctx) || vb(sel, ctx) || null;
    return out;
  }, {});
}

/** AND-combines two availability results. The first restricting result supplies reason/message. */
export function mergeAvailability(a?: DayAvailability, b?: DayAvailability): DayAvailability | undefined {
  if (!a) return b;
  if (!b) return a;
  const closed = !!(a.closed || b.closed);
  const restricts = (x: DayAvailability) => x.closed || x.canStart === false || x.canEnd === false || x.canPassThrough === false;
  const source = restricts(a) ? a : b;
  return {
    closed,
    canStart: a.canStart !== false && b.canStart !== false,
    canEnd: a.canEnd !== false && b.canEnd !== false,
    canPassThrough: a.canPassThrough !== false && b.canPassThrough !== false,
    ...(source.reason ? { reason: source.reason } : {}),
    ...(source.message ? { message: source.message } : {}),
    // Schedule-only when every restricting side is schedule-only.
    ...((!restricts(a) || a.schedule) && (!restricts(b) || b.schedule) ? { schedule: true } : {}),
  };
}

export interface RelaxScheduleOptions {
  /** Ignore `startWeekdays`, `endWeekdays`, `availableWeekdays`. Default true. */
  weekdays?: boolean;
  /** Ignore `minLength`, `maxLength`, `fixedLength`. Default true. */
  length?: boolean;
}

/**
 * "Custom dates": drops schedule rules while keeping real availability
 * (closed days, bookings, data status), bounds, past/future and custom
 * validators. Availability results marked `schedule: true` are ignored.
 */
export function relaxRules<TContext>(rules: SelectionRules<TContext>, options: RelaxScheduleOptions = {}): SelectionRules<TContext> {
  const out: SelectionRules<TContext> = { ...rules };
  if (options.weekdays !== false) {
    delete out.startWeekdays;
    delete out.endWeekdays;
    delete out.availableWeekdays;
    const avail = rules.getDayAvailability;
    if (avail) out.getDayAvailability = (date, ctx) => {
      const a = avail(date, ctx);
      return a && a.schedule ? undefined : a;
    };
  }
  if (options.length !== false) {
    delete out.minLength;
    delete out.maxLength;
    delete out.fixedLength;
  }
  return out;
}
