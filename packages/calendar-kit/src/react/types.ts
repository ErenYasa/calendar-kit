import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import type { CalendarDate, CalendarMonth, Weekday } from '../date/calendarDate';
import type {
  ActivationKind,
  DataStatus,
  DateRange,
  RangeEndpoint,
  Selection,
  SelectionMode,
  SelectionPhase,
  SelectionRules,
  ValidationIssue,
  ValidationResult,
} from '../core/types';
import type { CalendarMessagesInput } from '../i18n/messages';

// ------------------------------------------------------------------ events

/** Where a change came from. `prop` = a controlled prop changed (never echoed to onChange). */
export type EventSource = 'pointer' | 'keyboard' | 'navigation' | 'load-more' | 'programmatic' | 'prop' | 'resize' | 'scroll';

interface BaseEvent {
  instanceId: string;
}

export interface ReadyEvent extends BaseEvent {
  type: 'ready';
  layout: CalendarLayout;
}
export interface DateClickEvent extends BaseEvent {
  type: 'dateClick';
  date: CalendarDate;
  source: 'pointer' | 'keyboard';
  /** Whether the activation changed (or would change) the selection. */
  accepted: boolean;
  kind: ActivationKind;
  issue: ValidationIssue | null;
  day: DayState;
}
export interface ChangeEvent<V = unknown> extends BaseEvent {
  type: 'change';
  mode: SelectionMode;
  value: V;
  previous: V;
  source: EventSource;
  /** What produced the change (`start`, `complete`, `toggle-on`, `clear`, `reset`, …). */
  reason: ActivationKind | 'clear' | 'reset' | 'set';
  date: CalendarDate | null;
  phase: SelectionPhase;
  validation: ValidationResult;
}
export interface SelectionCompleteEvent<V = unknown> extends BaseEvent {
  type: 'selectionComplete';
  mode: SelectionMode;
  value: V;
  source: EventSource;
}
export interface SelectionClearEvent<V = unknown> extends BaseEvent {
  type: 'selectionClear';
  previous: V;
  source: EventSource;
}
export interface InvalidSelectionEvent extends BaseEvent {
  type: 'invalidSelection';
  date: CalendarDate;
  issue: ValidationIssue;
  message: string;
  source: EventSource;
}
export interface ValidationChangeEvent extends BaseEvent {
  type: 'validationChange';
  previous: ValidationResult | null;
  current: ValidationResult;
  selection: Selection;
  /** `initial`: first evaluation of a mount; `selection`: the value changed; `rules`: rules/data/today changed. */
  cause: 'initial' | 'selection' | 'rules';
}
export interface ActiveEndpointChangeEvent extends BaseEvent {
  type: 'activeEndpointChange';
  previous: RangeEndpoint;
  current: RangeEndpoint;
  source: EventSource;
}
export interface VisibleMonthChangeEvent extends BaseEvent {
  type: 'visibleMonthChange';
  previous: CalendarMonth | null;
  month: CalendarMonth;
  source: EventSource;
  reason: 'previous' | 'next' | 'jump' | 'keyboard';
  /** The request was outside min/max and was clamped. */
  clamped: boolean;
}
export interface VisibleMonthsChangeEvent extends BaseEvent {
  type: 'visibleMonthsChange';
  previous: readonly CalendarMonth[];
  months: readonly CalendarMonth[];
}
export interface RenderedMonthsChangeEvent extends BaseEvent {
  type: 'renderedMonthsChange';
  previous: readonly CalendarMonth[];
  months: readonly CalendarMonth[];
  added: readonly CalendarMonth[];
  removed: readonly CalendarMonth[];
}
export interface LoadMoreEvent extends BaseEvent {
  type: 'loadMore';
  direction: LoadDirection;
  months: readonly CalendarMonth[];
  source: EventSource;
  trigger: 'button' | 'auto' | 'manual' | 'keyboard';
}
export interface LoadingChangeEvent extends BaseEvent {
  type: 'loadingChange';
  previous: LoadingSnapshot;
  current: LoadingSnapshot;
}
export interface ResizeEvent extends BaseEvent {
  type: 'resize';
  previous: { width: number; height: number } | null;
  current: { width: number; height: number };
}
export interface LayoutChangeEvent extends BaseEvent {
  type: 'layoutChange';
  previous: CalendarLayout | null;
  current: CalendarLayout;
}
export interface DayFocusChangeEvent extends BaseEvent {
  type: 'dayFocusChange';
  previous: CalendarDate | null;
  date: CalendarDate | null;
  source: EventSource;
}
export interface TooltipOpenChangeEvent extends BaseEvent {
  type: 'tooltipOpenChange';
  date: CalendarDate | null;
  previous: CalendarDate | null;
  open: boolean;
  trigger: TooltipTrigger | null;
}
export interface OutsideClickEvent extends BaseEvent {
  type: 'outsideClick';
  nativeEvent: PointerEvent;
}
export interface ScrollEvent extends BaseEvent {
  type: 'scroll';
  scrollLeft: number;
  scrollTop: number;
}

export type CalendarEvent =
  | ReadyEvent
  | DateClickEvent
  | ChangeEvent
  | SelectionCompleteEvent
  | SelectionClearEvent
  | InvalidSelectionEvent
  | ValidationChangeEvent
  | ActiveEndpointChangeEvent
  | VisibleMonthChangeEvent
  | VisibleMonthsChangeEvent
  | RenderedMonthsChangeEvent
  | LoadMoreEvent
  | LoadingChangeEvent
  | ResizeEvent
  | LayoutChangeEvent
  | DayFocusChangeEvent
  | TooltipOpenChangeEvent
  | OutsideClickEvent
  | ScrollEvent;

export type CalendarEventType = CalendarEvent['type'];

export interface CalendarEventHandlers {
  onReady?: (e: ReadyEvent) => void;
  onDateClick?: (e: DateClickEvent) => void;
  onSelectionComplete?: (e: SelectionCompleteEvent) => void;
  onSelectionClear?: (e: SelectionClearEvent) => void;
  onInvalidSelection?: (e: InvalidSelectionEvent) => void;
  onValidationChange?: (e: ValidationChangeEvent) => void;
  onActiveEndpointChange?: (endpoint: RangeEndpoint, e: ActiveEndpointChangeEvent) => void;
  onVisibleMonthChange?: (month: CalendarMonth, e: VisibleMonthChangeEvent) => void;
  onVisibleMonthsChange?: (e: VisibleMonthsChangeEvent) => void;
  onRenderedMonthsChange?: (e: RenderedMonthsChangeEvent) => void;
  onLoadMore?: (e: LoadMoreEvent) => void;
  onLoadingChange?: (e: LoadingChangeEvent) => void;
  onResize?: (e: ResizeEvent) => void;
  onLayoutChange?: (e: LayoutChangeEvent) => void;
  onDayFocusChange?: (e: DayFocusChangeEvent) => void;
  onTooltipOpenChange?: (e: TooltipOpenChangeEvent) => void;
  onOutsideClick?: (e: OutsideClickEvent) => void;
  /** Coalesced to one call per animation frame. */
  onScroll?: (e: ScrollEvent) => void;
  /** Every public event, after the specific callback. */
  onEvent?: (e: CalendarEvent) => void;
}

// ------------------------------------------------------------- selection

export interface SingleSelectionProps {
  mode: 'single';
  value?: CalendarDate | null;
  /** Initial value only. Later changes are ignored (use `value` or `ref.reset()`). */
  defaultValue?: CalendarDate | null;
  onChange?: (value: CalendarDate | null, e: ChangeEvent<CalendarDate | null>) => void;
}
export interface RangeSelectionProps {
  mode: 'range';
  value?: DateRange;
  /** Initial value only. Later changes are ignored. */
  defaultValue?: DateRange;
  onChange?: (value: DateRange, e: ChangeEvent<DateRange>) => void;
  /** Which endpoint the next activation sets. Can be shared between calendars. */
  activeEndpoint?: RangeEndpoint;
  defaultActiveEndpoint?: RangeEndpoint;
}
export interface MultipleSelectionProps {
  mode: 'multiple';
  value?: readonly CalendarDate[];
  /** Initial value only. Later changes are ignored. */
  defaultValue?: readonly CalendarDate[];
  onChange?: (value: readonly CalendarDate[], e: ChangeEvent<readonly CalendarDate[]>) => void;
}
export interface ReadonlySelectionProps {
  mode: 'readonly';
}

export type SelectionProps = SingleSelectionProps | RangeSelectionProps | MultipleSelectionProps | ReadonlySelectionProps;

// ----------------------------------------------------------------- days

export interface DayState {
  date: CalendarDate;
  month: CalendarMonth;
  dayOfMonth: number;
  /** Day number formatted for the locale (e.g. Arabic-Indic digits). */
  dayText: string;
  weekday: Weekday;
  /** Column 0–6 inside the week row (logical, RTL-independent). */
  column: number;
  /** Full accessible date label, e.g. "Friday, 13 November 2026". */
  label: string;
  today: boolean;
  past: boolean;
  future: boolean;
  /** Activation is currently rejected (`reason` explains why). Still focusable. */
  disabled: boolean;
  /** Not selectable regardless of the current selection phase (closed, out of bounds, data missing). */
  unavailable: boolean;
  readOnly: boolean;
  selected: boolean;
  selectedSingle: boolean;
  selectedStart: boolean;
  selectedEnd: boolean;
  /** Strictly between start and end (drawn range interior). */
  inRange: boolean;
  /** Counts toward the selection per `rangeSemantics` (end excluded for stays). */
  included: boolean;
  inPreviewRange: boolean;
  previewStart: boolean;
  previewEnd: boolean;
  focused: boolean;
  hovered: boolean;
  /** What activating the day would do now. */
  action: ActivationKind;
  canStart: boolean;
  canEnd: boolean;
  canPassThrough: boolean;
  /** The day's restriction comes from the regular schedule (see `relaxSchedule`). */
  outOfSchedule: boolean;
  dataStatus: DataStatus;
  loading: boolean;
  reason: ValidationIssue | null;
  /** Localised text for `reason`. */
  reasonText: string | null;
  /** Consumer modifiers that evaluated to true. */
  modifiers: Readonly<Record<string, boolean>>;
  weekStart: boolean;
  weekEnd: boolean;
  monthStart: boolean;
  monthEnd: boolean;
}

export interface DayRenderContext<TDayData = unknown> {
  day: DayState;
  data: TDayData | undefined;
}

export type DayPropsInput = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref?: Ref<HTMLElement>;
  [dataAttr: `data-${string}`]: string | number | boolean | undefined;
};

/**
 * Props for a custom interactive day element. Your handlers run first; call
 * `event.preventDefault()` in `onClick`/`onKeyDown`/`onPointerEnter`/`onFocus`
 * to skip the calendar's own handling of that event.
 */
export type DayProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref: (el: HTMLElement | null) => void;
  type?: 'button';
  tabIndex: number;
  [dataAttr: `data-${string}`]: string | number | boolean | undefined;
};

export interface DayRenderProps<TDayData = unknown> extends DayRenderContext<TDayData> {
  getDayProps: (props?: DayPropsInput) => DayProps;
  /** Default content (day number + default data rendering). */
  defaultContent: ReactNode;
}

/** Shape understood by the default day content when `getDayData` returns it. */
export interface DefaultDayData {
  /** Short text under the number (e.g. a price — formatted by you). */
  label?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  /** Small markers (dots) — each is announced through `description`/`label`. */
  markers?: readonly { color?: string; label?: string; className?: string }[];
  /** Accessible description appended to the day's label. */
  description?: string;
}

export type TooltipTrigger = 'hover' | 'focus' | 'touch' | 'persistent' | 'controlled';

export type TooltipContent = ReactNode | { content: ReactNode; /** Show without hover/focus. */ persistent?: boolean };

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
/**
 * - `calendar` (default): the tooltip stays inside the calendar's months area
 *   (never over the header/weekday row, never outside the calendar).
 * - `viewport`: it may extend beyond the calendar, staying inside the window.
 */
export type TooltipBoundary = 'calendar' | 'viewport';

export interface TooltipOptions {
  /** Preferred side; other sides are tried when it does not fit. Default `top`. */
  placement?: TooltipPlacement;
  boundary?: TooltipBoundary;
  /** Gap between day and tooltip in px. Default 8. */
  offset?: number;
  className?: string;
  /** Portal target. Default `document.body`. */
  container?: HTMLElement | null;
  /** Controlled open date (`null` = closed). `undefined` = uncontrolled. */
  openDate?: CalendarDate | null;
}

export interface DayTooltipRenderProps {
  day: DayState;
  content: ReactNode;
  trigger: TooltipTrigger;
  placement: TooltipPlacement;
}

// ---------------------------------------------------------------- layout

export type Orientation = 'horizontal' | 'vertical';
/** What to do when the requested months don't fit horizontally. */
export type OverflowStrategy = 'scroll' | 'wrap' | 'reduce-months';
/** `paged`: previous/next pages of N months. `continuous`: a growing list loaded with load-more. */
export type NavigationMode = 'paged' | 'continuous';
export type LoadMoreMode = 'button' | 'auto' | 'manual';
export type LoadDirection = 'next' | 'previous';

export interface CalendarLayout {
  orientation: Orientation;
  navigation: NavigationMode;
  requestedMonths: number;
  effectiveMonths: number;
  columns: number;
  requestedMonthPosition: number;
  effectiveMonthPosition: number;
  overflow: OverflowStrategy;
  /** What actually happens now: `none`, the strategy, or `scroll` as the last-resort fallback. */
  activeOverflow: 'none' | OverflowStrategy;
  /** Day cells are at `minDaySize` (cannot shrink further). */
  atMinDaySize: boolean;
  containerWidth: number | null;
  minMonthWidth: number;
  direction: 'ltr' | 'rtl';
}

export interface LoadingSnapshot {
  initial: boolean;
  loadingMonths: readonly CalendarMonth[];
  errorMonths: readonly CalendarMonth[];
  busy: boolean;
}

export type LoadingScope = 'initial' | 'month' | 'load-more';

export interface LoadingRenderProps {
  scope: LoadingScope;
  months: readonly CalendarMonth[];
  status: DataStatus;
  messages: { loading: string };
}

export interface ErrorRenderProps {
  months: readonly CalendarMonth[];
  retry: () => void;
  messages: { error: string; retry: string };
}

export interface LoadMoreRenderProps {
  direction: LoadDirection;
  canLoad: boolean;
  loading: boolean;
  loadMore: () => void;
  /** `loadMoreLabels[direction]` or the localised default text. */
  label: ReactNode;
}

export interface NavigationRenderProps {
  canPrevious: boolean;
  canNext: boolean;
  previous: () => void;
  next: () => void;
  months: readonly CalendarMonth[];
  labels: { previous: string; next: string };
}

export interface MonthHeaderRenderProps {
  month: CalendarMonth;
  title: string;
  index: number;
  /** Default arrows for this header position (may be null). */
  navigation: ReactNode;
  status: DataStatus;
}

// ----------------------------------------------------------- controller

export interface GoToMonthOptions {
  /** Move keyboard focus to the first day of the month. */
  focus?: boolean;
  /** Scroll behaviour; `auto` respects `prefers-reduced-motion`. */
  behavior?: 'auto' | 'smooth' | 'instant';
}

export interface GoToMonthResult {
  month: CalendarMonth;
  /** Target was outside min/max and was clamped to the nearest allowed month. */
  clamped: boolean;
}

export interface CalendarController {
  readonly instanceId: string;
  /** Accepts `YYYY-MM` or a `YYYY-MM-DD` (its month). Never changes the selection. */
  goToMonth(month: CalendarMonth | CalendarDate | string, options?: GoToMonthOptions): GoToMonthResult | null;
  next(): void;
  previous(): void;
  loadMore(direction?: LoadDirection): void;
  /** Clears the selection (emits change + selectionClear). */
  clear(): void;
  /** Restores `defaultValue` (or empty). */
  reset(): void;
  /** Proposes a value as if chosen programmatically (validated, emits change). */
  select(value: CalendarDate | DateRange | readonly CalendarDate[] | null): ValidationResult;
  setActiveEndpoint(endpoint: RangeEndpoint): void;
  focusDate(date: CalendarDate): void;
  getSnapshot(): CalendarSnapshot;
}

export interface CalendarSnapshot {
  selection: Selection;
  activeEndpoint: RangeEndpoint;
  phase: SelectionPhase;
  validation: ValidationResult;
  referenceMonth: CalendarMonth | null;
  visibleMonths: readonly CalendarMonth[];
  renderedMonths: readonly CalendarMonth[];
  layout: CalendarLayout;
  focusedDate: CalendarDate | null;
  today: CalendarDate | null;
}

export interface SlotContext extends CalendarSnapshot {
  instanceId: string;
  actions: CalendarController;
  messages: import('../i18n/messages').CalendarMessages;
  locale: string;
  formatDate: (date: CalendarDate, options?: Intl.DateTimeFormatOptions) => string;
}

// ---------------------------------------------------------------- styling

export type CalendarPart =
  | 'root'
  | 'header'
  | 'footer'
  | 'viewport'
  | 'months'
  | 'month'
  | 'monthHeader'
  | 'monthTitle'
  | 'navigation'
  | 'navButton'
  | 'weekdays'
  | 'weekday'
  | 'grid'
  | 'week'
  | 'dayCell'
  | 'dayButton'
  | 'dayContent'
  | 'rangeBackground'
  | 'tooltip'
  | 'loadMore'
  | 'loading'
  | 'error'
  | 'liveRegion'
  | 'readOnlyNotice';

export type ClassNameValue = string | ((day: DayState) => string | undefined);

export type CalendarClassNames = Partial<Record<Exclude<CalendarPart, 'dayCell' | 'dayButton' | 'dayContent'>, string>> & {
  dayCell?: ClassNameValue;
  dayButton?: ClassNameValue;
  dayContent?: ClassNameValue;
};

// -------------------------------------------------------------- the props

export interface CalendarBaseProps<TDayData = unknown, TContext = unknown> extends CalendarEventHandlers {
  id?: string;
  className?: string;
  style?: CSSProperties;
  classNames?: CalendarClassNames;
  /** Drop all default class names (bring your own styles through `classNames`). */
  unstyled?: boolean;
  'aria-label'?: string;

  // i18n
  locale?: string;
  direction?: 'ltr' | 'rtl';
  firstDayOfWeek?: Weekday;
  messages?: CalendarMessagesInput;
  monthTitleFormat?: Intl.DateTimeFormatOptions;
  weekdayFormat?: 'narrow' | 'short' | 'long';
  formatMonthTitle?: (month: CalendarMonth, locale: string) => string;
  formatWeekday?: (weekday: Weekday, locale: string) => ReactNode;
  formatDayLabel?: (date: CalendarDate, locale: string) => string;

  // time
  /** Explicit "today" (recommended for SSR). */
  today?: CalendarDate;
  /** IANA zone used to compute today when `today` is not given. */
  timeZone?: string;
  /**
   * Show today's marker (thin circle + "Today" tooltip). Default `true`.
   * `day.today` and the "today" part of the aria-label are kept either way.
   */
  highlightToday?: boolean;

  // rules
  rules?: SelectionRules<TContext> | readonly (SelectionRules<TContext> | null | undefined | false)[];
  minDate?: CalendarDate | null;
  maxDate?: CalendarDate | null;
  disablePast?: boolean;
  disableFuture?: boolean;
  /** Passed to every rule callback as `ctx.context`. A change triggers revalidation. */
  ruleContext?: TContext;
  /**
   * "Custom dates": ignore schedule rules (allowed weekdays, start/end weekdays,
   * min/max/fixed length, availability marked `schedule: true`) while real
   * availability, bounds and validators still apply. `true` relaxes both groups.
   */
  relaxSchedule?: boolean | import('../core/rules').RelaxScheduleOptions;

  // data
  getDayData?: (date: CalendarDate) => TDayData | undefined;
  /** Month data status (also feeds the rules, see `unknownDataPolicy`). */
  getDataStatus?: (month: CalendarMonth) => DataStatus;
  /** Calendar-wide initial loading flag. */
  loading?: boolean;
  onRetry?: (months: readonly CalendarMonth[]) => void;
  modifiers?: Record<string, (day: DayState) => boolean>;

  // rendering
  renderDay?: (props: DayRenderProps<TDayData>) => ReactNode;
  renderDayContent?: (ctx: DayRenderContext<TDayData>) => ReactNode;
  getDayTooltip?: (ctx: DayRenderContext<TDayData>) => TooltipContent | null | undefined;
  renderDayTooltip?: (props: DayTooltipRenderProps) => ReactNode;
  tooltip?: TooltipOptions;
  renderHeader?: (ctx: SlotContext) => ReactNode;
  renderFooter?: (ctx: SlotContext) => ReactNode;
  renderMonthHeader?: (props: MonthHeaderRenderProps, ctx: SlotContext) => ReactNode;
  renderNavigation?: (props: NavigationRenderProps, ctx: SlotContext) => ReactNode;
  renderLoading?: (props: LoadingRenderProps, ctx: SlotContext) => ReactNode;
  renderError?: (props: ErrorRenderProps, ctx: SlotContext) => ReactNode;
  renderLoadMore?: (props: LoadMoreRenderProps, ctx: SlotContext) => ReactNode;

  // layout
  orientation?: Orientation;
  numberOfMonths?: number;
  /** 1-based position of the reference month inside the visible window. Default 1. */
  monthPosition?: number;
  overflow?: OverflowStrategy;
  /** Minimum interactive day size (px). Default 40. Number or separate width/height. */
  minDaySize?: number | { width: number; height: number };
  /** Maximum day cell height (px). Default 56. */
  maxDaySize?: number;
  /** Gap between months (px). Default 32. */
  monthGap?: number;
  /** Always render 6 week rows. */
  fixedWeeks?: boolean;
  /** Max block size of the months viewport (enables internal vertical scroll). */
  maxBlockSize?: number | string;
  navigation?: NavigationMode;
  /** Months moved by previous/next in paged mode. Default 1. */
  stepMonths?: number;
  loadMore?: LoadMoreMode;
  /** Content of the default load-more buttons (keeps the button, its behaviour and a11y). */
  loadMoreLabels?: Partial<Record<LoadDirection, ReactNode>>;
  loadDirections?: 'next' | 'previous' | 'both';
  monthsPerLoad?: number;
  /** Continuous mode DOM bound. Default 24. */
  maxRenderedMonths?: number;
  /** Consumer notification throttle for onResize (px). Does not delay layout. */
  resizeThreshold?: number;

  // navigation state
  visibleMonth?: CalendarMonth;
  defaultVisibleMonth?: CalendarMonth;
}

export type CalendarProps<TDayData = unknown, TContext = unknown> = CalendarBaseProps<TDayData, TContext> & SelectionProps;
