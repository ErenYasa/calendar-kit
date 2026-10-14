import {
  type CalendarDate,
  addDays,
  diffDays,
  getMonth,
  getWeekday,
  parseDate,
  toEpochDay,
  fromEpochDay,
} from '../date/calendarDate';
import type {
  ActivationPlan,
  DataStatus,
  DateRange,
  DayAvailability,
  RangeEndpoint,
  RangeSemantics,
  RuleContext,
  Selection,
  SelectionPhase,
  SelectionRules,
  SelectionState,
  ValidationIssue,
  ValidationResult,
} from './types';

export interface ResolvedAvailability {
  closed: boolean;
  canStart: boolean;
  canEnd: boolean;
  canPassThrough: boolean;
  /** Restriction comes from the schedule (relaxable), not real unavailability. */
  schedule: boolean;
  reason?: string;
  message?: string;
}

export interface SelectionEngineInput<TContext = unknown> {
  rules: SelectionRules<TContext>;
  state: SelectionState;
  today: CalendarDate | null;
  context?: TContext;
}

export interface SelectionEngine {
  readonly semantics: RangeSemantics;
  readonly allowSameDay: boolean;
  availability(date: CalendarDate): ResolvedAvailability;
  dataStatus(date: CalendarDate): DataStatus;
  /** Bounds, past/future and data-status checks shared by every selectable day. */
  checkDay(date: CalendarDate): ValidationIssue | null;
  /** Can `date` be a single/multiple pick or a range start? */
  checkStart(date: CalendarDate): ValidationIssue | null;
  validateRange(start: CalendarDate, end: CalendarDate): ValidationResult;
  validate(selection: Selection): ValidationResult;
  /** What activating `date` would do. Click, keyboard, hover preview and disabled state all use this. */
  plan(date: CalendarDate): ActivationPlan;
}

const OK: ValidationResult = { valid: true, issue: null };
const fail = (issue: ValidationIssue): ValidationResult => ({ valid: false, issue });

export const EMPTY_RANGE: DateRange = Object.freeze({ start: null, end: null }) as DateRange;

export function emptySelection(mode: Selection['mode']): Selection {
  switch (mode) {
    case 'single':
      return { mode, value: null };
    case 'range':
      return { mode, value: EMPTY_RANGE };
    case 'multiple':
      return { mode, value: [] };
    default:
      return { mode: 'readonly', value: null };
  }
}

export function getSelectionPhase(selection: Selection): SelectionPhase {
  switch (selection.mode) {
    case 'single':
      return selection.value ? 'complete' : 'empty';
    case 'range':
      if (selection.value.start && selection.value.end) return 'complete';
      return selection.value.start ? 'start-selected' : 'empty';
    case 'multiple':
      return selection.value.length ? 'complete' : 'empty';
    default:
      return 'empty';
  }
}

/** Range length in the unit implied by the semantics (nights or days). */
export function getRangeLength(range: DateRange, semantics: RangeSemantics): number | null {
  if (!range.start || !range.end) return null;
  const d = diffDays(range.start, range.end);
  return semantics === 'exclusive' ? d : d + 1;
}

/** Nights in a stay `[start, end)` — 13→20 Nov = 7. */
export function countNights(range: DateRange): number | null {
  return getRangeLength(range, 'exclusive');
}

/** Included days in `[start, end]` — 13→20 Nov = 8. */
export function countDays(range: DateRange): number | null {
  return getRangeLength(range, 'inclusive');
}

/**
 * Days that count for the given semantics. Exclusive same-day ranges
 * (`start === end`) include the single day (day-use).
 */
export function getIncludedDays(range: DateRange, semantics: RangeSemantics): CalendarDate[] {
  if (!range.start || !range.end || range.end < range.start) return [];
  const last = semantics === 'exclusive' && range.end > range.start ? addDays(range.end, -1) : range.end;
  const out: CalendarDate[] = [];
  for (let d = toEpochDay(range.start), e = toEpochDay(last); d <= e; d++) out.push(fromEpochDay(d));
  return out;
}

function nextEndpoint(selection: Selection): RangeEndpoint {
  return selection.mode === 'range' && selection.value.start && !selection.value.end ? 'end' : 'start';
}

/**
 * Builds a pure evaluator for one snapshot of (rules, selection, today, context).
 * Results are memoised per day for the lifetime of the engine, so create a new
 * engine whenever any input changes (React does this once per render).
 */
export function createSelectionEngine<TContext = unknown>(input: SelectionEngineInput<TContext>): SelectionEngine {
  const { rules, state, today } = input;
  const semantics: RangeSemantics = rules.rangeSemantics ?? 'inclusive';
  const allowSameDay = rules.allowSameDay ?? semantics === 'inclusive';
  const unit = semantics === 'exclusive' ? 'nights' : 'days';
  const ctx: RuleContext<TContext> = {
    mode: state.selection.mode,
    selection: state.selection,
    activeEndpoint: state.activeEndpoint,
    today,
    context: input.context as TContext,
  };

  const availCache = new Map<string, ResolvedAvailability>();
  const dayIssueCache = new Map<string, ValidationIssue | null>();
  const startIssueCache = new Map<string, ValidationIssue | null>();

  function availability(date: CalendarDate): ResolvedAvailability {
    let a = availCache.get(date);
    if (!a) {
      let raw: DayAvailability = (rules.getDayAvailability?.(date, ctx) as DayAvailability | undefined) ?? {};
      if (rules.availableWeekdays && !rules.availableWeekdays.includes(getWeekday(date)) && !raw.closed)
        raw = { closed: true, reason: 'out-of-schedule', schedule: true };
      const closed = !!raw.closed;
      a = {
        closed,
        canStart: !closed && raw.canStart !== false,
        canEnd: !closed && raw.canEnd !== false,
        canPassThrough: !closed && raw.canPassThrough !== false,
        schedule: !!raw.schedule,
        reason: raw.reason,
        message: raw.message,
      };
      availCache.set(date, a);
    }
    return a;
  }

  function dataStatus(date: CalendarDate): DataStatus {
    return rules.getDataStatus ? rules.getDataStatus(getMonth(date)) : 'loaded';
  }

  function dayIssue(date: CalendarDate, code: ValidationIssue['code'], params?: ValidationIssue['params']): ValidationIssue {
    const a = availability(date);
    const issue: ValidationIssue = { code, date };
    if (params) issue.params = params;
    if (a.reason) issue.dayReason = a.reason;
    if (a.message) issue.message = a.message;
    return issue;
  }

  function checkDay(date: CalendarDate): ValidationIssue | null {
    if (dayIssueCache.has(date)) return dayIssueCache.get(date)!;
    let issue: ValidationIssue | null = null;
    if (rules.minDate && date < rules.minDate) issue = { code: 'before-min', date, params: { min: rules.minDate } };
    else if (rules.maxDate && date > rules.maxDate) issue = { code: 'after-max', date, params: { max: rules.maxDate } };
    else if (rules.disablePast && today && date < today) issue = { code: 'past', date, params: { today } };
    else if (rules.disableFuture && today && date > today) issue = { code: 'future', date, params: { today } };
    else if ((rules.unknownDataPolicy ?? 'block') === 'block') {
      const st = dataStatus(date);
      if (st !== 'loaded') issue = { code: st === 'loading' ? 'data-loading' : st === 'error' ? 'data-error' : 'data-unknown', date };
    }
    dayIssueCache.set(date, issue);
    return issue;
  }

  function checkStartBasic(date: CalendarDate): ValidationIssue | null {
    const base = checkDay(date);
    if (base) return base;
    const a = availability(date);
    if (a.closed) return dayIssue(date, 'closed');
    if (!a.canStart) return dayIssue(date, 'start-not-allowed');
    if (rules.startWeekdays && !rules.startWeekdays.includes(getWeekday(date)))
      return dayIssue(date, 'weekday-start', { weekday: getWeekday(date) });
    return null;
  }

  function checkEnd(date: CalendarDate): ValidationIssue | null {
    const base = checkDay(date);
    if (base) return base;
    const a = availability(date);
    if (a.closed) return dayIssue(date, 'closed');
    if (!a.canEnd) return dayIssue(date, 'end-not-allowed');
    if (rules.endWeekdays && !rules.endWeekdays.includes(getWeekday(date)))
      return dayIssue(date, 'weekday-end', { weekday: getWeekday(date) });
    return null;
  }

  function interiorIssue(date: CalendarDate): ValidationIssue | null {
    const base = checkDay(date);
    if (base) return base.code.startsWith('data-') ? base : dayIssue(date, 'blocked-in-range');
    const a = availability(date);
    if (!a.canPassThrough) return dayIssue(date, 'blocked-in-range');
    return null;
  }

  // Incremental forward scan from a start: remembers the first blocking interior day.
  const scans = new Map<string, { frontier: number; first: ValidationIssue | null }>();
  function firstInteriorIssue(start: CalendarDate, end: CalendarDate): ValidationIssue | null {
    const s = toEpochDay(start);
    const e = toEpochDay(end);
    let scan = scans.get(start);
    if (!scan) {
      scan = { frontier: s, first: null };
      scans.set(start, scan);
    }
    if (scan.first) return scan.first.date! < end ? scan.first : null;
    while (scan.frontier < e - 1) {
      scan.frontier++;
      const issue = interiorIssue(fromEpochDay(scan.frontier));
      if (issue) {
        scan.first = issue;
        return issue;
      }
    }
    return null;
  }

  function lengthIssue(start: CalendarDate, end: CalendarDate): ValidationIssue | null {
    const len = getRangeLength({ start, end }, semantics)!;
    if (rules.fixedLength != null && len !== rules.fixedLength)
      return { code: 'fixed-length', date: end, params: { length: rules.fixedLength, actual: len, unit } };
    if (rules.minLength != null && len < rules.minLength)
      return { code: 'min-length', date: end, params: { min: rules.minLength, actual: len, unit } };
    if (rules.maxLength != null && len > rules.maxLength)
      return { code: 'max-length', date: end, params: { max: rules.maxLength, actual: len, unit } };
    return null;
  }

  function validateRangeBuiltIn(start: CalendarDate, end: CalendarDate): ValidationIssue | null {
    if (end < start) return { code: 'end-before-start', date: end, params: { start } };
    const startIssue = checkStartBasic(start);
    if (startIssue) return startIssue;
    if (start === end && !allowSameDay) return { code: 'same-day', date: end };
    const endIssue = start === end ? null : checkEnd(end);
    if (endIssue) return endIssue;
    if (start === end) {
      const a = availability(end);
      if (!a.canEnd) return dayIssue(end, 'end-not-allowed');
    }
    return lengthIssue(start, end) ?? firstInteriorIssue(start, end);
  }

  function custom(selection: Selection): ValidationIssue | null {
    const issue = rules.validateSelection?.(selection, ctx);
    return issue ? { ...issue, code: issue.code ?? 'custom' } : null;
  }

  function validateRange(start: CalendarDate, end: CalendarDate): ValidationResult {
    const issue = validateRangeBuiltIn(start, end) ?? custom({ mode: 'range', value: { start, end } });
    return issue ? fail(issue) : OK;
  }

  function reachableEndIssue(start: CalendarDate): ValidationIssue | null {
    if (!rules.requireReachableEnd || rules.fixedLength != null) return null;
    const minLen = Math.max(rules.minLength ?? 0, allowSameDay ? 0 : 1);
    const firstEndOffset = semantics === 'exclusive' ? minLen : Math.max(0, minLen - 1);
    const maxLen = rules.maxLength ?? minLen + 62;
    const lastEndOffset = semantics === 'exclusive' ? maxLen : maxLen - 1;
    let lastIssue: ValidationIssue | null = null;
    for (let off = firstEndOffset; off <= Math.min(lastEndOffset, firstEndOffset + 62); off++) {
      const issue = validateRangeBuiltIn(start, addDays(start, off));
      if (!issue) return null;
      lastIssue = issue;
      // Once the interior is blocked, no later end can work.
      if (issue.code === 'blocked-in-range' || issue.code.startsWith('data-')) break;
    }
    if (lastIssue?.code.startsWith('data-')) return lastIssue;
    if (rules.minLength != null && minLen > 0)
      return { code: 'min-length', date: start, params: { min: rules.minLength, unit }, ...(lastIssue?.dayReason ? { dayReason: lastIssue.dayReason } : {}) };
    return lastIssue;
  }

  function checkStart(date: CalendarDate): ValidationIssue | null {
    if (startIssueCache.has(date)) return startIssueCache.get(date)!;
    const issue = checkStartBasic(date) ?? (state.selection.mode === 'range' ? reachableEndIssue(date) : null);
    startIssueCache.set(date, issue);
    return issue;
  }

  function validate(selection: Selection): ValidationResult {
    let issue: ValidationIssue | null = null;
    switch (selection.mode) {
      case 'single': {
        if (selection.value == null) break;
        const d = parseDate(selection.value);
        issue = d ? checkStartBasic(d) : { code: 'invalid-date', params: { value: String(selection.value) } };
        break;
      }
      case 'range': {
        const { start, end } = selection.value;
        if (start == null && end == null) break;
        const s = parseDate(start);
        const e = end == null ? null : parseDate(end);
        if (!s) issue = { code: 'invalid-date', params: { field: 'start', value: String(start) } };
        else if (end != null && !e) issue = { code: 'invalid-date', params: { field: 'end', value: String(end) } };
        else issue = e ? validateRangeBuiltIn(s, e) : checkStartBasic(s);
        break;
      }
      case 'multiple': {
        const seen = new Set<string>();
        for (const v of selection.value) {
          const d = parseDate(v);
          if (!d) {
            issue = { code: 'invalid-date', params: { value: String(v) } };
            break;
          }
          if (seen.has(d)) continue;
          seen.add(d);
          issue = checkStartBasic(d);
          if (issue) break;
        }
        if (!issue && rules.maxSelections != null && seen.size > rules.maxSelections)
          issue = { code: 'max-selections', params: { max: rules.maxSelections, actual: seen.size } };
        break;
      }
      default:
        break;
    }
    issue = issue ?? custom(selection);
    return issue ? fail(issue) : OK;
  }

  function planned(
    kind: ActivationPlan['kind'],
    date: CalendarDate,
    selection: Selection,
    issue: ValidationIssue | null = null,
    endpoint: RangeEndpoint = nextEndpoint(selection),
  ): ActivationPlan {
    if (issue) return { kind: 'rejected', date, issue, next: state };
    const customIssue = kind === 'none' || kind === 'clear' || kind === 'toggle-off' ? null : custom(selection);
    if (customIssue) return { kind: 'rejected', date, issue: customIssue, next: state };
    return { kind, date, issue: null, next: { selection, activeEndpoint: endpoint } };
  }

  const singleDayFirst = !!rules.singleDayFirst && allowSameDay && rules.fixedLength == null;

  function planRangeFromStart(date: CalendarDate): ActivationPlan {
    if (rules.fixedLength != null) {
      const end = addDays(date, semantics === 'exclusive' ? rules.fixedLength : rules.fixedLength - 1);
      const issue = validateRangeBuiltIn(date, end);
      return planned('complete', date, { mode: 'range', value: { start: date, end } }, issue);
    }
    if (singleDayFirst) {
      // A valid single day completes immediately; the next click may extend it.
      const single = validateRangeBuiltIn(date, date);
      if (!single) return planned('complete', date, { mode: 'range', value: { start: date, end: date } }, null, 'end');
    }
    return planned('start', date, { mode: 'range', value: { start: date, end: null } }, checkStart(date));
  }

  function plan(date: CalendarDate): ActivationPlan {
    const sel = state.selection;
    switch (sel.mode) {
      case 'readonly':
        return { kind: 'none', date, issue: null, next: state };
      case 'single':
        if (sel.value === date) return { kind: 'none', date, issue: null, next: state };
        return planned('select', date, { mode: 'single', value: date }, checkStartBasic(date));
      case 'multiple': {
        if (sel.value.includes(date))
          return planned('toggle-off', date, { mode: 'multiple', value: sel.value.filter((d) => d !== date) });
        const issue =
          checkStartBasic(date) ??
          (rules.maxSelections != null && sel.value.length >= rules.maxSelections
            ? { code: 'max-selections' as const, date, params: { max: rules.maxSelections, actual: sel.value.length + 1 } }
            : null);
        return planned('toggle-on', date, { mode: 'multiple', value: [...sel.value, date] }, issue);
      }
      case 'range': {
        const start = parseDate(sel.value.start);
        const hasEnd = sel.value.end != null;
        const choosingEnd = start && state.activeEndpoint === 'end' && rules.fixedLength == null;
        if (!choosingEnd || !start) return planRangeFromStart(date);
        if (date < start) return planRangeFromStart(date);
        if (singleDayFirst && date === start && sel.value.end === start)
          return planned('clear', date, { mode: 'range', value: EMPTY_RANGE });
        if (date === start && !allowSameDay) {
          return hasEnd
            ? planned('rejected', date, sel, { code: 'same-day', date })
            : planned('clear', date, { mode: 'range', value: EMPTY_RANGE });
        }
        const issue = validateRangeBuiltIn(start, date);
        return planned('complete', date, { mode: 'range', value: { start, end: date } }, issue);
      }
    }
  }

  return { semantics, allowSameDay, availability, dataStatus, checkDay, checkStart, validateRange, validate, plan };
}
