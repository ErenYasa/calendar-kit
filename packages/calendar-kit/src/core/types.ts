import type { CalendarDate, CalendarMonth, Weekday } from '../date/calendarDate';

export type SelectionMode = 'single' | 'range' | 'multiple' | 'readonly';

/**
 * The two endpoints the user picked. The core attaches no meaning to `end`
 * (check-out, last included day, …) — that is decided by `rangeSemantics`.
 */
export interface DateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}

export interface SelectionValueByMode {
  single: CalendarDate | null;
  range: DateRange;
  multiple: readonly CalendarDate[];
  readonly: null;
}

export type Selection = {
  [M in SelectionMode]: { mode: M; value: SelectionValueByMode[M] };
}[SelectionMode];

export type RangeEndpoint = 'start' | 'end';

/**
 * - `empty`: nothing selected
 * - `start-selected`: range has a start and waits for an end
 * - `complete`: single date chosen / range has both ends / multiple has ≥1 date
 */
export type SelectionPhase = 'empty' | 'start-selected' | 'complete';

/** Loading state of externally provided availability data. */
export type DataStatus = 'unknown' | 'loading' | 'loaded' | 'error';

/**
 * - `inclusive`: `[start, end]` — every day from start to end is included
 *   (day events, multi-day tickets). 13–20 Nov = 8 days.
 * - `exclusive`: `[start, end)` — end is a boundary, not included
 *   (overnight stays). 13–20 Nov = 7 nights.
 */
export type RangeSemantics = 'inclusive' | 'exclusive';

/** Per-day selectability returned by consumer rules. Every field is optional. */
export interface DayAvailability {
  /** Nothing is possible on this day (not start, not end, not inside a range). */
  closed?: boolean;
  /** Can be a range start / single / multiple pick. Default: `!closed`. */
  canStart?: boolean;
  /** Can be a range end. Default: `!closed`. */
  canEnd?: boolean;
  /** Can be inside (not an endpoint of) a range. Default: `!closed`. */
  canPassThrough?: boolean;
  /** Consumer tag explaining why (e.g. `'check-out-only'`); copied to issues. */
  reason?: string;
  /** Optional ready-made message; used by default tooltips/announcements. */
  message?: string;
  /**
   * The restriction comes from the regular schedule (e.g. "boats sail
   * Saturday to Saturday") rather than real unavailability (bookings,
   * maintenance). Schedule restrictions are ignored when the calendar's
   * `relaxSchedule` is on.
   */
  schedule?: boolean;
}

export type ReasonCode =
  | 'invalid-date'
  | 'before-min'
  | 'after-max'
  | 'past'
  | 'future'
  | 'closed'
  | 'start-not-allowed'
  | 'end-not-allowed'
  | 'blocked-in-range'
  | 'weekday-start'
  | 'weekday-end'
  | 'min-length'
  | 'max-length'
  | 'fixed-length'
  | 'same-day'
  | 'end-before-start'
  | 'max-selections'
  | 'data-unknown'
  | 'data-loading'
  | 'data-error'
  | 'custom';

export type IssueParams = Record<string, string | number | boolean | null | undefined>;

export interface ValidationIssue {
  code: ReasonCode;
  /** The day that caused the issue, if any. */
  date?: CalendarDate;
  /** Values for message templates, e.g. `{ min: 2, actual: 1, unit: 'nights' }`. */
  params?: IssueParams;
  /** `DayAvailability.reason` of the offending day. */
  dayReason?: string;
  /** Custom message from availability or `validateSelection`. */
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  issue: ValidationIssue | null;
}

export interface RuleContext<TContext = unknown> {
  mode: SelectionMode;
  selection: Selection;
  activeEndpoint: RangeEndpoint;
  today: CalendarDate | null;
  /** Arbitrary consumer data (`ruleContext` prop) — e.g. chosen times or party size. */
  context: TContext;
}

export interface SelectionRules<TContext = unknown> {
  minDate?: CalendarDate | null;
  maxDate?: CalendarDate | null;
  /** Days before `today` cannot be picked. */
  disablePast?: boolean;
  /** Days after `today` cannot be picked. */
  disableFuture?: boolean;
  /** Default `'inclusive'` (validates every day between the endpoints). */
  rangeSemantics?: RangeSemantics;
  /** `start === end`. Default: `true` for inclusive, `false` for exclusive. */
  allowSameDay?: boolean;
  /**
   * Lengths are measured in the unit implied by `rangeSemantics`:
   * exclusive → `end - start` (nights), inclusive → `end - start + 1` (days).
   */
  minLength?: number;
  maxLength?: number;
  /** When set, one activation creates the whole range. */
  fixedLength?: number;
  /** Weekdays a range may start / end on (schedule rules). */
  startWeekdays?: readonly Weekday[];
  endWeekdays?: readonly Weekday[];
  /**
   * Weekdays the service operates on (schedule rule). Other weekdays are
   * closed with reason `out-of-schedule`, so ranges cannot cross them either.
   * Example: weekends only → `[6, 0]`.
   */
  availableWeekdays?: readonly Weekday[];
  /**
   * Inclusive ranges: the first click already selects that single day
   * (`start === end`); a later click on or after it extends the range, a
   * click on the same lone day clears it. Lets one calendar offer both
   * single-day and multi-day selection.
   */
  singleDayFirst?: boolean;
  getDayAvailability?: (date: CalendarDate, ctx: RuleContext<TContext>) => DayAvailability | null | undefined | void;
  /** Data status per month. When omitted, all data is treated as loaded. */
  getDataStatus?: (month: CalendarMonth) => DataStatus;
  /** What to do with days whose data is not `loaded`. Default `'block'`. */
  unknownDataPolicy?: 'block' | 'allow';
  validateSelection?: (selection: Selection, ctx: RuleContext<TContext>) => ValidationIssue | null | undefined | void;
  /** Multiple mode: maximum number of dates. */
  maxSelections?: number;
  /**
   * Range mode: reject a start when no valid end can follow it
   * (e.g. the next night is booked under a 2-night minimum).
   */
  requireReachableEnd?: boolean;
}

/** What activating a day would do in the current state. */
export type ActivationKind =
  | 'select' // single
  | 'start' // range: new start
  | 'complete' // range: end chosen (or fixed-length range)
  | 'toggle-on' // multiple
  | 'toggle-off' // multiple
  | 'clear' // range: click on lone start without same-day support
  | 'none' // no change (read-only or re-selecting the single value)
  | 'rejected';

export interface SelectionState {
  selection: Selection;
  activeEndpoint: RangeEndpoint;
}

export interface ActivationPlan {
  kind: ActivationKind;
  date: CalendarDate;
  next: SelectionState;
  issue: ValidationIssue | null;
}
