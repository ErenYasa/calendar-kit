import {
  type ForwardedRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type CalendarDate,
  type CalendarMonth,
  addDays,
  addMonths,
  addMonthsToMonth,
  clampDate,
  daysInMonth,
  diffMonths,
  eachMonth,
  firstDayOfMonth,
  getMonth,
  getMonthParts,
  getWeekday,
  parseDate,
  parseMonth,
} from '../date/calendarDate';
import { formatDate, formatMonth, getDefaultFirstDayOfWeek, getLocaleDirection, getWeekdayNames } from '../date/locale';
import { EMPTY_RANGE, createSelectionEngine, emptySelection, getSelectionPhase } from '../core/engine';
import { combineRules, relaxRules } from '../core/rules';
import type { DateRange, RangeEndpoint, Selection, SelectionRules, SelectionState, ValidationIssue, ValidationResult } from '../core/types';
import { type CalendarMessages, type MessageFormatHelpers, formatIssue, mergeMessages, messagesEn } from '../i18n/messages';
import { DayCell, type DayActions } from './Day';
import {
  DEFAULT_MAX_DAY_SIZE,
  DEFAULT_MIN_DAY_SIZE,
  DEFAULT_MONTH_GAP,
  MONTH_PADDING_INLINE,
  computeLayout,
  computeMonthWindow,
  layoutKey,
  sanitizeCount,
} from './layout';
import { Tooltip } from './Tooltip';
import type {
  CalendarController,
  CalendarEvent,
  CalendarLayout,
  CalendarProps,
  CalendarSnapshot,
  ChangeEvent,
  DayRenderContext,
  DayState,
  EventSource,
  GoToMonthOptions,
  GoToMonthResult,
  LoadDirection,
  LoadMoreEvent,
  LoadingSnapshot,
  SlotContext,
  TooltipContent,
  TooltipTrigger,
} from './types';
import { PREFIX, cx, prefersReducedMotion, shallowEqualArray, srOnlyStyle, useIsomorphicLayoutEffect, useLatest } from './utils';
import { useToday } from './useToday';

// ----------------------------------------------------------------- helpers

function selectionKey(s: Selection): string {
  switch (s.mode) {
    case 'single':
      return `s:${s.value ?? ''}`;
    case 'range':
      return `r:${s.value?.start ?? ''}~${s.value?.end ?? ''}`;
    case 'multiple':
      return `m:${s.value.join(',')}`;
    default:
      return 'ro';
  }
}

/** Next endpoint implied by a value alone (used when activeEndpoint is not controlled). */
function deriveEndpoint(s: Selection, singleDayFirst = false): RangeEndpoint {
  if (s.mode !== 'range' || !s.value.start) return 'start';
  return !s.value.end || (singleDayFirst && s.value.end === s.value.start) ? 'end' : 'start';
}

function selectionAnchorMonth(s: Selection): CalendarMonth | null {
  let d: CalendarDate | null = null;
  if (s.mode === 'single') d = parseDate(s.value);
  else if (s.mode === 'range') d = parseDate(s.value.start);
  else if (s.mode === 'multiple') d = s.value.map((v) => parseDate(v)).filter(Boolean).sort()[0] ?? null;
  return d ? getMonth(d) : null;
}

function toSelection(mode: Selection['mode'], value: unknown): Selection {
  if (mode === 'readonly') return { mode, value: null };
  if (value === undefined) return emptySelection(mode);
  if (mode === 'range') return { mode, value: (value as DateRange | null) ?? EMPTY_RANGE };
  if (mode === 'multiple') return { mode, value: (value as readonly CalendarDate[] | null) ?? [] };
  return { mode, value: (value as CalendarDate | null) ?? null };
}

const SILENT_TOOLTIP_CODES = new Set(['past', 'future', 'before-min', 'after-max', 'invalid-date', 'data-unknown', 'data-loading']);

function issueEquals(a: ValidationResult | null, b: ValidationResult): boolean {
  if (!a) return false;
  if (a.valid !== b.valid) return false;
  const x = a.issue;
  const y = b.issue;
  if (!x || !y) return x === y;
  return x.code === y.code && x.date === y.date && x.dayReason === y.dayReason && x.message === y.message && JSON.stringify(x.params) === JSON.stringify(y.params);
}

const ChevronIcon = ({ direction }: { direction: 'previous' | 'next' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
    <path
      d={direction === 'previous' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Handlers = Record<string, ((...args: never[]) => void) | undefined>;

const HANDLER_BY_TYPE: Record<CalendarEvent['type'], string> = {
  ready: 'onReady',
  dateClick: 'onDateClick',
  change: 'onChange',
  selectionComplete: 'onSelectionComplete',
  selectionClear: 'onSelectionClear',
  invalidSelection: 'onInvalidSelection',
  validationChange: 'onValidationChange',
  activeEndpointChange: 'onActiveEndpointChange',
  visibleMonthChange: 'onVisibleMonthChange',
  visibleMonthsChange: 'onVisibleMonthsChange',
  renderedMonthsChange: 'onRenderedMonthsChange',
  loadMore: 'onLoadMore',
  loadingChange: 'onLoadingChange',
  resize: 'onResize',
  layoutChange: 'onLayoutChange',
  dayFocusChange: 'onDayFocusChange',
  tooltipOpenChange: 'onTooltipOpenChange',
  outsideClick: 'onOutsideClick',
  scroll: 'onScroll',
};

// --------------------------------------------------------------- component

function CalendarInner<TDayData, TContext>(props: CalendarProps<TDayData, TContext>, ref: ForwardedRef<CalendarController>) {
  const reactId = useId();
  const instanceId = props.id ?? `cal${reactId.replace(/[^\w-]/g, '')}`;
  const locale = props.locale ?? 'en-US';
  const direction = props.direction ?? getLocaleDirection(locale);
  const firstDayOfWeek = props.firstDayOfWeek ?? getDefaultFirstDayOfWeek(locale);
  const messages: CalendarMessages = useMemo(() => mergeMessages(messagesEn, props.messages), [props.messages]);
  const today = useToday(props.today, props.timeZone);
  const unstyled = !!props.unstyled;
  const highlightToday = props.highlightToday !== false;
  const cn = props.classNames;
  const p = (s: string) => (unstyled ? undefined : `${PREFIX}-${s}`);

  const latestProps = useLatest(props);
  const emit = useCallback(
    (event: CalendarEvent) => {
      const handlers = latestProps.current as unknown as Handlers;
      const fn = handlers[HANDLER_BY_TYPE[event.type]] as ((...a: unknown[]) => void) | undefined;
      if (event.type === 'change') fn?.(event.value, event);
      else if (event.type === 'visibleMonthChange') fn?.(event.month, event);
      else if (event.type === 'activeEndpointChange') fn?.(event.current, event);
      else fn?.(event);
      (handlers.onEvent as ((e: CalendarEvent) => void) | undefined)?.(event);
    },
    [latestProps],
  );

  // ------------------------------------------------------------- rules
  const { minDate: minDateProp, maxDate: maxDateProp, disablePast, disableFuture, getDataStatus } = props;
  const rules: SelectionRules<TContext> = useMemo(() => {
    const list = Array.isArray(props.rules) ? props.rules : [props.rules as SelectionRules<TContext> | undefined];
    const base: SelectionRules<TContext> = {};
    if (minDateProp) base.minDate = minDateProp;
    if (maxDateProp) base.maxDate = maxDateProp;
    if (disablePast) base.disablePast = true;
    if (disableFuture) base.disableFuture = true;
    if (getDataStatus) base.getDataStatus = getDataStatus;
    const combined = combineRules<TContext>(...list, base);
    const relax = props.relaxSchedule;
    return relax ? relaxRules(combined, relax === true ? {} : relax) : combined;
  }, [props.rules, minDateProp, maxDateProp, disablePast, disableFuture, getDataStatus, props.relaxSchedule]);

  const minMonth = rules.minDate ? getMonth(rules.minDate) : null;
  const maxMonth = rules.maxDate ? getMonth(rules.maxDate) : null;

  // --------------------------------------------------------- selection
  const mode = props.mode;
  const valueProp = mode === 'readonly' ? undefined : (props as { value?: unknown }).value;
  const controlled = valueProp !== undefined;
  const defaultSelectionRef = useRef<Selection | null>(null);
  if (!defaultSelectionRef.current) defaultSelectionRef.current = toSelection(mode, (props as { defaultValue?: unknown }).defaultValue);
  const [internal, setInternal] = useState<Selection>(() => defaultSelectionRef.current!);
  const selection: Selection = controlled ? toSelection(mode, valueProp) : internal.mode === mode ? internal : emptySelection(mode);
  const selKey = selectionKey(selection);

  const endpointProp = mode === 'range' ? props.activeEndpoint : undefined;
  const [internalEndpoint, setInternalEndpoint] = useState(() => ({
    value: (mode === 'range' && props.defaultActiveEndpoint) || deriveEndpoint(defaultSelectionRef.current!, !!rules.singleDayFirst),
    key: selectionKey(defaultSelectionRef.current!),
  }));
  const activeEndpoint: RangeEndpoint =
    endpointProp ?? (internalEndpoint.key === selKey ? internalEndpoint.value : deriveEndpoint(selection, !!rules.singleDayFirst));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableSelection = useMemo(() => selection, [selKey]);
  const engine = useMemo(
    () => createSelectionEngine<TContext>({ rules, state: { selection: stableSelection, activeEndpoint }, today, context: props.ruleContext as TContext }),
    [rules, stableSelection, activeEndpoint, today, props.ruleContext],
  );
  const validation = useMemo(() => engine.validate(stableSelection), [engine, stableSelection]);
  const phase = getSelectionPhase(selection);

  // ------------------------------------------------------------ layout
  const orientation = props.orientation ?? 'horizontal';
  const navigation = props.navigation ?? 'paged';
  const requestedMonths = sanitizeCount(props.numberOfMonths, 1);
  const monthPosition = props.monthPosition ?? 1;
  const overflow = props.overflow ?? 'wrap';
  const minDay =
    typeof props.minDaySize === 'object'
      ? props.minDaySize
      : { width: props.minDaySize ?? DEFAULT_MIN_DAY_SIZE, height: props.minDaySize ?? DEFAULT_MIN_DAY_SIZE };
  const maxDaySize = Math.max(props.maxDaySize ?? DEFAULT_MAX_DAY_SIZE, minDay.height);
  const monthGap = props.monthGap ?? DEFAULT_MONTH_GAP;
  const layoutBase = { orientation, navigation, requestedMonths, monthPosition, overflow, minDayWidth: minDay.width, monthGap, direction } as const;
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const [measured, setMeasured] = useState(false);
  const widthRef = useRef<number | null>(null);
  const layout: CalendarLayout = useMemo(
    () => computeLayout({ ...layoutBase, containerWidth: measuredWidth }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orientation, navigation, requestedMonths, monthPosition, overflow, minDay.width, monthGap, direction, measuredWidth],
  );
  const layoutBaseRef = useLatest(layoutBase);
  const currentLayoutKey = layoutKey(layout);

  // ------------------------------------------------------------ months
  const [anchorState, setAnchorState] = useState<CalendarMonth | null>(
    () => parseMonth(props.defaultVisibleMonth) ?? selectionAnchorMonth(selection),
  );
  const anchorProp = props.visibleMonth ? parseMonth(props.visibleMonth) : null;
  const referenceMonth: CalendarMonth | null = anchorProp ?? anchorState ?? (today ? getMonth(today) : null);

  const pagedWindow = referenceMonth
    ? computeMonthWindow(referenceMonth, layout.effectiveMonths, layout.effectiveMonthPosition, minMonth, maxMonth)
    : null;

  const monthsPerLoad = sanitizeCount(props.monthsPerLoad, Math.max(1, requestedMonths));
  const maxRenderedMonths = Math.max(sanitizeCount(props.maxRenderedMonths, 24), requestedMonths);
  const listKey = `${referenceMonth}|${requestedMonths}|${layout.effectiveMonthPosition}|${minMonth}|${maxMonth}`;
  const [list, setList] = useState<{ key: string; first: CalendarMonth; last: CalendarMonth } | null>(null);
  if (navigation === 'continuous' && list && list.key !== listKey) {
    // Derived-state reset: keep the loaded list when the new reference is already rendered.
    if (referenceMonth && referenceMonth >= list.first && referenceMonth <= list.last) setList({ ...list, key: listKey });
    else setList(null);
  }
  let renderedMonths: CalendarMonth[] = [];
  if (referenceMonth) {
    if (navigation === 'continuous') {
      if (list && list.key === listKey) renderedMonths = eachMonth(list.first, diffMonths(list.first, list.last) + 1);
      else renderedMonths = computeMonthWindow(referenceMonth, requestedMonths, layout.effectiveMonthPosition, minMonth, maxMonth).months;
    } else renderedMonths = pagedWindow!.months;
  }
  const renderedKey = renderedMonths.join(',');
  const firstRendered = renderedMonths[0] ?? null;
  const lastRendered = renderedMonths[renderedMonths.length - 1] ?? null;
  const [observedVisible, setObservedVisible] = useState<CalendarMonth[] | null>(null);
  const visibleMonths: CalendarMonth[] =
    navigation === 'continuous' && observedVisible && observedVisible.every((m) => renderedMonths.includes(m)) && observedVisible.length
      ? observedVisible
      : navigation === 'continuous'
        ? renderedMonths.slice(0, requestedMonths)
        : renderedMonths;

  // ------------------------------------------------- focus/hover/tooltip
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [hovered, setHovered] = useState<CalendarDate | null>(null);
  const [touchTip, setTouchTip] = useState<CalendarDate | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const modalityRef = useRef<'keyboard' | 'pointer'>('pointer');
  const pointerTypeRef = useRef('mouse');
  const insideEventRef = useRef(false);
  const dayRefs = useRef(new Map<CalendarDate, HTMLElement>());
  const monthRefs = useRef(new Map<CalendarMonth, HTMLElement>());
  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const tooltipElRef = useRef<HTMLDivElement | null>(null);
  const pendingFocusRef = useRef<CalendarDate | null>(null);
  const pendingScrollRef = useRef<{ month: CalendarMonth; behavior: ScrollBehavior } | null>(null);
  const preserveRef = useRef<{ month: CalendarMonth; top: number } | null>(null);
  const lastLoadRef = useRef<{ direction: LoadDirection; months: CalendarMonth[] } | null>(null);

  const announce = useCallback((text: string) => {
    setAnnouncement((prev) => (prev === text ? `${text} ` : text));
  }, []);

  const helpers: MessageFormatHelpers = useMemo(
    () => ({
      locale,
      date: (v: unknown) => {
        const d = parseDate(v);
        return d ? formatDate(d, locale, { day: 'numeric', month: 'long', year: 'numeric' }) : String(v ?? '');
      },
    }),
    [locale],
  );
  const shortDate = useCallback((d: CalendarDate) => formatDate(d, locale, { day: 'numeric', month: 'long', year: 'numeric' }), [locale]);
  const dayTexts = useMemo(() => {
    const nf = new Intl.NumberFormat(locale, { useGrouping: false });
    return Array.from({ length: 31 }, (_, i) => nf.format(i + 1));
  }, [locale]);
  const dayLabel = (d: CalendarDate) =>
    props.formatDayLabel ? props.formatDayLabel(d, locale) : formatDate(d, locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // ------------------------------------------------------ day states
  const range = selection.mode === 'range' ? selection.value : null;
  const rStart = range ? parseDate(range.start) : null;
  const rEnd = range ? parseDate(range.end) : null;
  const multiSet = selection.mode === 'multiple' ? new Set(selection.value) : null;
  const previewSource = hovered ?? (hasFocus && focusVisible ? focusedDate : null);
  let preview: DateRange | null = null;
  if (selection.mode === 'range' && previewSource) {
    const plan = engine.plan(previewSource);
    if (plan.kind === 'complete' && plan.next.selection.mode === 'range') {
      const v = plan.next.selection.value;
      // Only a multi-day range is previewed (a would-be single day draws nothing).
      if (v.start !== v.end && (v.start !== rStart || v.end !== rEnd)) preview = v;
    }
  }
  // One band per render: the preview while it exists, otherwise the selected range.
  const band: DateRange | null = preview ?? (rStart && rEnd && rStart !== rEnd ? { start: rStart, end: rEnd } : null);

  const tooltipFn = props.getDayTooltip;
  const dayStates = new Map<CalendarDate, DayState>();
  const dayData = new Map<CalendarDate, TDayData | undefined>();
  const dayKeys = new Map<CalendarDate, string>();
  const bands = new Map<CalendarDate, 'start' | 'mid' | 'end' | null>();
  const tooltips = new Map<CalendarDate, { content: ReactNode; persistent: boolean }>();
  const monthStatus = new Map<CalendarMonth, ReturnType<typeof engine.dataStatus>>();
  const modifiers = props.modifiers;

  for (const month of renderedMonths) {
    const { year, month: m } = getMonthParts(month);
    const count = daysInMonth(year, m);
    const first = firstDayOfMonth(month);
    const lead = (getWeekday(first) - firstDayOfWeek + 7) % 7;
    const status = rules.getDataStatus ? rules.getDataStatus(month) : 'loaded';
    monthStatus.set(month, status);
    for (let i = 0; i < count; i++) {
      const date = addDays(first, i);
      const column = (lead + i) % 7;
      const plan = engine.plan(date);
      const avail = engine.availability(date);
      const dayIssue = engine.checkDay(date);
      const unavailable = !!dayIssue || avail.closed || (!avail.canStart && !avail.canEnd);
      const readOnly = mode === 'readonly';
      let reason: ValidationIssue | null = plan.issue;
      if (!reason && (unavailable || readOnly)) {
        reason = dayIssue ?? (avail.closed ? { code: 'closed', date, ...(avail.reason ? { dayReason: avail.reason } : {}) } : null);
        if (!reason && unavailable) reason = { code: 'closed', date, ...(avail.reason ? { dayReason: avail.reason } : {}) };
      }
      const selectedSingle = selection.mode === 'single' ? selection.value === date : multiSet ? multiSet.has(date) : false;
      const selectedStart = rStart === date;
      const selectedEnd = rEnd === date;
      const inRange = !!(rStart && rEnd && date > rStart && date < rEnd);
      const included = !!(
        rStart &&
        rEnd &&
        date >= rStart &&
        (engine.semantics === 'inclusive' ? date <= rEnd : rStart === rEnd ? date === rStart : date < rEnd)
      );
      const pS = preview?.start ?? null;
      const pE = preview?.end ?? null;
      const inPreviewRange = !!(pS && pE && date > pS && date < pE);
      const previewStart = pS === date;
      const previewEnd = pE === date;
      const base: DayState = {
        date,
        month,
        dayOfMonth: i + 1,
        dayText: dayTexts[i]!,
        weekday: getWeekday(date),
        column,
        label: dayLabel(date),
        today: today === date,
        past: !!today && date < today,
        future: !!today && date > today,
        disabled: plan.kind === 'rejected',
        unavailable,
        readOnly,
        selected: selectedSingle || selectedStart || selectedEnd,
        selectedSingle,
        selectedStart,
        selectedEnd,
        inRange,
        included,
        inPreviewRange,
        previewStart,
        previewEnd,
        focused: hasFocus && focusedDate === date,
        hovered: hovered === date,
        action: plan.kind,
        canStart: avail.canStart,
        canEnd: avail.canEnd,
        canPassThrough: avail.canPassThrough,
        outOfSchedule: avail.schedule && (avail.closed || !avail.canStart || !avail.canEnd || !avail.canPassThrough),
        dataStatus: status,
        loading: status === 'loading' || !!props.loading,
        reason,
        reasonText: reason ? formatIssue(reason, messages, helpers) : null,
        modifiers: {},
        weekStart: column === 0,
        weekEnd: column === 6,
        monthStart: i === 0,
        monthEnd: i === count - 1,
      };
      if (modifiers) {
        const mods: Record<string, boolean> = {};
        for (const k in modifiers) if (modifiers[k]!(base)) mods[k] = true;
        base.modifiers = mods;
      }
      dayStates.set(date, base);
      bands.set(
        date,
        band && date >= band.start! && date <= band.end! ? (date === band.start ? 'start' : date === band.end ? 'end' : 'mid') : null,
      );
      let key = '';
      for (const f of ['today', 'past', 'disabled', 'unavailable', 'selected', 'selectedStart', 'selectedEnd', 'inRange', 'included', 'inPreviewRange', 'previewStart', 'previewEnd', 'focused', 'hovered', 'loading', 'readOnly', 'outOfSchedule'] as const)
        key += base[f] ? '1' : '0';
      key += `|${plan.kind}|${base.reasonText ?? ''}|${status}|${Object.keys(base.modifiers).join(',')}|${base.label}`;
      dayKeys.set(date, key);
      const data = props.getDayData?.(date);
      dayData.set(date, data);
      const ctx: DayRenderContext<TDayData> = { day: base, data };
      // Days drawn as a skeleton (loading/unknown data or calendar-wide loading)
      // show no tooltip at all — neither default nor consumer ones.
      const skeleton = status === 'loading' || status === 'unknown' || !!props.loading;
      const raw: TooltipContent | null | undefined = skeleton
        ? null
        : tooltipFn
        ? tooltipFn(ctx)
        : (base.disabled || base.unavailable) && base.reasonText && reason && !SILENT_TOOLTIP_CODES.has(reason.code) && !readOnly
          ? base.reasonText
          : readOnly && base.reasonText && reason && !SILENT_TOOLTIP_CODES.has(reason.code)
            ? base.reasonText
            : base.today && highlightToday
              ? messages.todayLabel
              : null;
      if (raw != null && raw !== false && raw !== '') {
        if (typeof raw === 'object' && raw !== null && 'content' in (raw as object) && !('$$typeof' in (raw as object)))
          tooltips.set(date, { content: (raw as { content: ReactNode }).content, persistent: !!(raw as { persistent?: boolean }).persistent });
        else tooltips.set(date, { content: raw as ReactNode, persistent: false });
      }
    }
  }

  // Roving tabindex target.
  const isRendered = (d: CalendarDate | null): d is CalendarDate => !!d && dayStates.has(d);
  const selectionFocus =
    selection.mode === 'single' ? parseDate(selection.value) : selection.mode === 'range' ? rStart : selection.mode === 'multiple' ? parseDate(selection.value[0]) : null;
  const tabbableDate: CalendarDate | null = isRendered(focusedDate)
    ? focusedDate
    : isRendered(selectionFocus) && visibleMonths.includes(getMonth(selectionFocus))
      ? selectionFocus
      : isRendered(today) && visibleMonths.includes(getMonth(today))
        ? today
        : referenceMonth && dayStates.has(firstDayOfMonth(visibleMonths[0] ?? referenceMonth))
          ? firstDayOfMonth(visibleMonths[0] ?? referenceMonth)
          : firstRendered
            ? firstDayOfMonth(firstRendered)
            : null;

  // Tooltip resolution: controlled → touch → hover → keyboard focus → persistent.
  const tooltipOpts = props.tooltip ?? {};
  let openTip: { date: CalendarDate; trigger: TooltipTrigger } | null = null;
  if (tooltipOpts.openDate !== undefined) openTip = tooltipOpts.openDate && tooltips.has(tooltipOpts.openDate) ? { date: tooltipOpts.openDate, trigger: 'controlled' } : null;
  else if (touchTip && tooltips.has(touchTip)) openTip = { date: touchTip, trigger: 'touch' };
  else if (hovered && tooltips.has(hovered)) openTip = { date: hovered, trigger: 'hover' };
  else if (hasFocus && focusVisible && focusedDate && tooltips.has(focusedDate)) openTip = { date: focusedDate, trigger: 'focus' };
  else {
    for (const [d, t] of tooltips)
      if (t.persistent) {
        openTip = { date: d, trigger: 'persistent' };
        break;
      }
  }
  const tooltipId = `${instanceId}-tooltip`;
  const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null);
  useIsomorphicLayoutEffect(() => {
    // Compare before calling setState: an unconditional call in an effect without
    // deps can loop whenever React cannot bail out eagerly.
    const el = openTip ? (dayRefs.current.get(openTip.date) ?? null) : null;
    if (el !== tooltipAnchor) setTooltipAnchor(el);
  });

  // ---------------------------------------------------- loading state
  const loadingMonths = renderedMonths.filter((m) => monthStatus.get(m) === 'loading');
  const errorMonths = renderedMonths.filter((m) => monthStatus.get(m) === 'error');
  const loadingSnapshot: LoadingSnapshot = {
    initial: !!props.loading,
    loadingMonths,
    errorMonths,
    busy: !!props.loading || loadingMonths.length > 0,
  };
  const loadingKey = `${loadingSnapshot.initial}|${loadingMonths.join(',')}|${errorMonths.join(',')}`;

  // ------------------------------------------------------------ actions
  const getSnapshot = (): CalendarSnapshot => ({
    selection,
    activeEndpoint,
    phase,
    validation,
    referenceMonth,
    visibleMonths,
    renderedMonths,
    layout: { ...layout, containerWidth: widthRef.current ?? layout.containerWidth },
    focusedDate,
    today,
  });

  function commit(next: SelectionState, reason: ChangeEvent['reason'], date: CalendarDate | null, source: EventSource) {
    const prevSel = selection;
    const prevEndpoint = activeEndpoint;
    if (!controlled) setInternal(next.selection);
    setInternalEndpoint({ value: next.activeEndpoint, key: selectionKey(next.selection) });
    const nextValidation = createSelectionEngine<TContext>({ rules, state: next, today, context: props.ruleContext as TContext }).validate(next.selection);
    const nextPhase = getSelectionPhase(next.selection);
    emit({
      type: 'change',
      instanceId,
      mode,
      value: next.selection.value,
      previous: prevSel.value,
      source,
      reason,
      date,
      phase: nextPhase,
      validation: nextValidation,
    });
    if (mode === 'range' && next.activeEndpoint !== prevEndpoint)
      emit({ type: 'activeEndpointChange', instanceId, previous: prevEndpoint, current: next.activeEndpoint, source });
    const completes =
      (reason === 'select' || reason === 'complete' || reason === 'set') && nextPhase === 'complete'
        ? true
        : reason === 'toggle-on' && next.selection.mode === 'multiple' && rules.maxSelections != null && next.selection.value.length === rules.maxSelections;
    if (completes && nextValidation.valid) emit({ type: 'selectionComplete', instanceId, mode, value: next.selection.value, source });
    if (nextPhase === 'empty' && getSelectionPhase(prevSel) !== 'empty') emit({ type: 'selectionClear', instanceId, previous: prevSel.value, source });

    // Announcement
    const s = next.selection;
    if (s.mode === 'range') {
      if (s.value.start && s.value.end) announce(messages.announceRange(shortDate(s.value.start), shortDate(s.value.end)));
      else if (s.value.start) announce(messages.announceStart(shortDate(s.value.start)));
      else announce(messages.announceCleared);
    } else if (s.mode === 'single') announce(s.value ? messages.announceSingle(shortDate(s.value)) : messages.announceCleared);
    else if (s.mode === 'multiple' && date) {
      announce(reason === 'toggle-off' ? messages.announceRemoved(shortDate(date), s.value.length) : messages.announceAdded(shortDate(date), s.value.length));
    }
  }

  function navigateTo(month: CalendarMonth, source: EventSource, reason: 'previous' | 'next' | 'jump' | 'keyboard', options?: GoToMonthOptions): GoToMonthResult {
    let target = month;
    if (minMonth && target < minMonth) target = minMonth;
    if (maxMonth && target > maxMonth) target = maxMonth;
    const clamped = target !== month;
    if (navigation === 'continuous') {
      const behavior: ScrollBehavior = options?.behavior === 'smooth' && !prefersReducedMotion() ? 'smooth' : 'auto';
      pendingScrollRef.current = { month: target, behavior };
    }
    if (!anchorProp) setAnchorState(target);
    if (target !== referenceMonth || clamped)
      emit({ type: 'visibleMonthChange', instanceId, previous: referenceMonth, month: target, source, reason, clamped });
    return { month: target, clamped };
  }

  function pageBy(delta: number, source: EventSource) {
    if (!pagedWindow && navigation === 'paged') return;
    if (navigation === 'continuous') {
      if (referenceMonth) navigateTo(addMonthsToMonth(referenceMonth, delta), source, delta < 0 ? 'previous' : 'next');
      return;
    }
    const newStart = addMonthsToMonth(pagedWindow!.start, delta);
    navigateTo(addMonthsToMonth(newStart, layout.effectiveMonthPosition - 1), source, delta < 0 ? 'previous' : 'next');
  }

  const step = sanitizeCount(props.stepMonths, 1);
  const canPrevious = navigation === 'paged' && !!firstRendered && (!minMonth || firstRendered > minMonth);
  const canNext = navigation === 'paged' && !!lastRendered && (!maxMonth || lastRendered < maxMonth);
  const loadDirections = props.loadDirections ?? 'next';
  const canLoad = (dir: LoadDirection) =>
    navigation === 'continuous' &&
    (loadDirections === 'both' || loadDirections === dir) &&
    (dir === 'next' ? !!lastRendered && (!maxMonth || lastRendered < maxMonth) : !!firstRendered && (!minMonth || firstRendered > minMonth));

  function loadMore(dir: LoadDirection, trigger: LoadMoreEvent['trigger'], control?: HTMLElement | null) {
    if (!firstRendered || !lastRendered || navigation !== 'continuous') return;
    if (!(dir === 'next' ? lastRendered < (maxMonth ?? '9999-12') : firstRendered > (minMonth ?? '0001-01'))) return;
    let first = firstRendered;
    let last = lastRendered;
    if (dir === 'next') {
      last = addMonthsToMonth(last, monthsPerLoad);
      if (maxMonth && last > maxMonth) last = maxMonth;
    } else {
      first = addMonthsToMonth(first, -monthsPerLoad);
      if (minMonth && first < minMonth) first = minMonth;
    }
    const added = dir === 'next' ? eachMonth(addMonthsToMonth(lastRendered, 1), diffMonths(lastRendered, last)) : eachMonth(first, diffMonths(first, firstRendered));
    // Bound the DOM: drop months from the opposite end, never the focused one.
    const total = diffMonths(first, last) + 1;
    if (total > maxRenderedMonths) {
      const excess = total - maxRenderedMonths;
      const focusMonth = focusedDate ? getMonth(focusedDate) : null;
      if (dir === 'next') {
        const nf = addMonthsToMonth(first, excess);
        if (!focusMonth || focusMonth >= nf) first = nf;
      } else {
        const nl = addMonthsToMonth(last, -excess);
        if (!focusMonth || focusMonth <= nl) last = nl;
      }
    }
    // Remember a month that stays rendered so its position can be preserved.
    const keep = dir === 'previous' ? firstRendered : first;
    const keepEl = monthRefs.current.get(keep);
    if (keepEl) preserveRef.current = { month: keep, top: keepEl.getBoundingClientRect().top };
    lastLoadRef.current = { direction: dir, months: added };
    setList({ key: listKey, first, last });
    // The default control disappears at the min/max boundary; keep focus in the grid.
    const exhausted = dir === 'next' ? !!maxMonth && last >= maxMonth : !!minMonth && first <= minMonth;
    if (exhausted && control && control === document.activeElement && added[0]) {
      const target = clampDate(firstDayOfMonth(added[0]), rules.minDate, rules.maxDate);
      setFocusedDate(target);
      pendingFocusRef.current = target;
    }
    emit({ type: 'loadMore', instanceId, direction: dir, months: added, source: 'load-more', trigger });
  }

  function moveFocus(date: CalendarDate, source: EventSource) {
    const target = clampDate(date, rules.minDate, rules.maxDate);
    const prev = focusedDate;
    setFocusedDate(target);
    pendingFocusRef.current = target;
    if (prev !== target) emit({ type: 'dayFocusChange', instanceId, previous: prev, date: target, source });
    const tm = getMonth(target);
    if (renderedMonths.includes(tm) || !firstRendered || !lastRendered) return;
    if (navigation === 'paged') {
      const eff = layout.effectiveMonths;
      const newStart = tm > lastRendered ? addMonthsToMonth(tm, -(eff - 1)) : tm;
      navigateTo(addMonthsToMonth(newStart, layout.effectiveMonthPosition - 1), source, 'keyboard');
    } else {
      const extendNext = tm > lastRendered && diffMonths(lastRendered, tm) <= monthsPerLoad;
      const extendPrev = tm < firstRendered && diffMonths(tm, firstRendered) <= monthsPerLoad;
      if (extendNext || extendPrev) {
        let first = extendPrev ? tm : firstRendered;
        let last = extendNext ? tm : lastRendered;
        const total = diffMonths(first, last) + 1;
        if (total > maxRenderedMonths) {
          if (extendNext) first = addMonthsToMonth(first, total - maxRenderedMonths);
          else last = addMonthsToMonth(last, -(total - maxRenderedMonths));
        }
        setList({ key: listKey, first, last });
      } else navigateTo(tm, source, 'keyboard');
    }
  }

  function activate(date: CalendarDate, source: 'pointer' | 'keyboard') {
    const plan = engine.plan(date);
    const day = dayStates.get(date);
    const accepted = plan.kind !== 'rejected' && plan.kind !== 'none';
    if (day) emit({ type: 'dateClick', instanceId, date, source, accepted, kind: plan.kind, issue: plan.issue, day });
    if (focusedDate !== date) {
      emit({ type: 'dayFocusChange', instanceId, previous: focusedDate, date, source });
      setFocusedDate(date);
    }
    if (plan.kind === 'rejected') {
      const message = plan.issue ? formatIssue(plan.issue, messages, helpers) : '';
      if (plan.issue) emit({ type: 'invalidSelection', instanceId, date, issue: plan.issue, message, source });
      announce(messages.announceRejected(shortDate(date), message));
      return;
    }
    if (plan.kind === 'none') return;
    commit(plan.next, plan.kind, date, source);
  }

  function keyDown(e: KeyboardEvent<HTMLElement>, date: CalendarDate) {
    const rtl = direction === 'rtl';
    const day = dayStates.get(date);
    let next: CalendarDate | null = null;
    switch (e.key) {
      case 'ArrowLeft':
        next = addDays(date, rtl ? 1 : -1);
        break;
      case 'ArrowRight':
        next = addDays(date, rtl ? -1 : 1);
        break;
      case 'ArrowUp':
        next = addDays(date, -7);
        break;
      case 'ArrowDown':
        next = addDays(date, 7);
        break;
      case 'Home':
        next = addDays(date, -(day?.column ?? 0));
        break;
      case 'End':
        next = addDays(date, 6 - (day?.column ?? 6));
        break;
      case 'PageUp':
        next = addMonths(date, e.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = addMonths(date, e.shiftKey ? 12 : 1);
        break;
      case 'Escape':
        if (touchTip || hovered) {
          setTouchTip(null);
          setHovered(null);
        }
        return;
      case 'Enter':
      case ' ':
        // Native buttons fire click themselves; custom elements need this.
        if (e.currentTarget.tagName !== 'BUTTON') {
          e.preventDefault();
          activate(date, 'keyboard');
        }
        return;
      default:
        return;
    }
    e.preventDefault();
    modalityRef.current = 'keyboard';
    setFocusVisible(true);
    moveFocus(next, 'keyboard');
  }

  function goToMonth(input: CalendarMonth | CalendarDate | string, options?: GoToMonthOptions): GoToMonthResult | null {
    const month = parseMonth(input);
    if (!month) return null;
    const result = navigateTo(month, 'programmatic', 'jump', options);
    if (options?.focus) {
      const d = clampDate(firstDayOfMonth(result.month), rules.minDate, rules.maxDate);
      if (focusedDate !== d) emit({ type: 'dayFocusChange', instanceId, previous: focusedDate, date: d, source: 'programmatic' });
      setFocusedDate(d);
      pendingFocusRef.current = d;
    }
    return result;
  }

  function select(value: CalendarDate | DateRange | readonly CalendarDate[] | null): ValidationResult {
    if (mode === 'readonly') return { valid: false, issue: { code: 'custom', message: 'read-only' } };
    const nextSel = toSelection(mode, value);
    const nextState: SelectionState = { selection: nextSel, activeEndpoint: deriveEndpoint(nextSel, !!rules.singleDayFirst) };
    const result = createSelectionEngine<TContext>({ rules, state: nextState, today, context: props.ruleContext as TContext }).validate(nextSel);
    if (!result.valid && result.issue) {
      const message = formatIssue(result.issue, messages, helpers);
      emit({ type: 'invalidSelection', instanceId, date: result.issue.date ?? ('' as CalendarDate), issue: result.issue, message, source: 'programmatic' });
      return result;
    }
    commit(nextState, 'set', null, 'programmatic');
    return result;
  }

  const live = useLatest({
    activate,
    keyDown,
    moveFocus,
    goToMonth,
    loadMore,
    pageBy,
    select,
    commit,
    getSnapshot,
    mode,
    step,
    singleDayFirst: !!rules.singleDayFirst,
    focusedDate,
    hasFocus,
    tooltips,
    selection,
    emit,
    setActiveEndpoint(endpoint: RangeEndpoint) {
      if (mode !== 'range' || endpoint === activeEndpoint) return;
      setInternalEndpoint({ value: endpoint, key: selKey });
      emit({ type: 'activeEndpointChange', instanceId, previous: activeEndpoint, current: endpoint, source: 'programmatic' });
    },
  });

  const actions: DayActions = useMemo(
    () => ({
      activate: (d, source) => live.current.activate(d, source),
      keyDown: (e, d) => live.current.keyDown(e, d),
      hover: (d) => setHovered(d),
      focus: (d) => {
        setHasFocus(true);
        setFocusVisible(modalityRef.current === 'keyboard');
        const cur = live.current;
        if (cur.focusedDate !== d) {
          cur.emit({ type: 'dayFocusChange', instanceId, previous: cur.focusedDate, date: d, source: modalityRef.current === 'keyboard' ? 'keyboard' : 'pointer' });
          setFocusedDate(d);
        }
      },
      blur: () => setHasFocus(false),
      pointerDown: (d, type) => {
        pointerTypeRef.current = type;
        if (type === 'touch') setTouchTip(live.current.tooltips.has(d) ? d : null);
        else setTouchTip(null);
      },
      registerRef: (d, el) => {
        if (el) dayRefs.current.set(d, el);
        else dayRefs.current.delete(d);
      },
    }),
    [live, instanceId],
  );

  const controller: CalendarController = useMemo(
    () => ({
      instanceId,
      goToMonth: (m, o) => live.current.goToMonth(m, o),
      next: () => live.current.pageBy(live.current.step, 'programmatic'),
      previous: () => live.current.pageBy(-live.current.step, 'programmatic'),
      loadMore: (dir = 'next') => live.current.loadMore(dir, 'manual'),
      clear: () => {
        const cur = live.current;
        if (cur.mode === 'readonly') return;
        const empty = emptySelection(cur.mode);
        if (selectionKey(empty) === selectionKey(cur.selection)) return;
        cur.commit({ selection: empty, activeEndpoint: 'start' }, 'clear', null, 'programmatic');
      },
      reset: () => {
        const cur = live.current;
        if (cur.mode === 'readonly') return;
        const def = defaultSelectionRef.current!.mode === cur.mode ? defaultSelectionRef.current! : emptySelection(cur.mode);
        cur.commit({ selection: def, activeEndpoint: deriveEndpoint(def, !!cur.singleDayFirst) }, 'reset', null, 'programmatic');
      },
      select: (v) => live.current.select(v),
      setActiveEndpoint: (e) => live.current.setActiveEndpoint(e),
      focusDate: (d) => live.current.moveFocus(d, 'programmatic'),
      getSnapshot: () => live.current.getSnapshot(),
    }),
    [live, instanceId],
  );
  useImperativeHandle(ref, () => controller, [controller]);

  // ------------------------------------------------------- measurement
  const measure = useCallback(
    (el: HTMLElement) => {
      const vp = viewportRef.current;
      let width = (vp ?? el).clientWidth;
      if (vp && typeof getComputedStyle !== 'undefined') {
        const cs = getComputedStyle(vp);
        width -= (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      }
      widthRef.current = width > 0 ? width : null;
      const cur = computeLayout({ ...layoutBaseRef.current, containerWidth: widthRef.current });
      setMeasuredWidth((prev) =>
        layoutKey(computeLayout({ ...layoutBaseRef.current, containerWidth: prev })) === layoutKey(cur) ? prev : widthRef.current,
      );
    },
    [layoutBaseRef],
  );

  // Re-sync when props change while the stored width is structurally stale.
  useIsomorphicLayoutEffect(() => {
    if (widthRef.current == null) return;
    const actual = computeLayout({ ...layoutBase, containerWidth: widthRef.current });
    if (widthRef.current !== measuredWidth && layoutKey(actual) !== currentLayoutKey) setMeasuredWidth(widthRef.current);
  });

  const lastResizeRef = useRef<{ width: number; height: number } | null>(null);
  useIsomorphicLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const report = () => {
      const r = el.getBoundingClientRect();
      const size = { width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100 };
      const prev = lastResizeRef.current;
      const threshold = latestProps.current.resizeThreshold ?? 0;
      if (prev && Math.abs(prev.width - size.width) <= threshold && Math.abs(prev.height - size.height) <= threshold) return;
      if (prev && prev.width === size.width && prev.height === size.height) return;
      lastResizeRef.current = size;
      emit({ type: 'resize', instanceId, previous: prev, current: size });
    };
    measure(el);
    setMeasured(true);
    if (typeof ResizeObserver === 'undefined') {
      report();
      return;
    }
    let frame = 0;
    const ro = new ResizeObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure(el);
        report();
      });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measure, emit, instanceId, latestProps]);

  // ------------------------------------------------------ DOM effects
  // Move focus after keyboard navigation / month changes.
  useIsomorphicLayoutEffect(() => {
    const d = pendingFocusRef.current;
    if (!d) return;
    const el = dayRefs.current.get(d);
    if (!el) return;
    pendingFocusRef.current = null;
    el.focus({ preventScroll: true });
    const vp = viewportRef.current;
    if (vp) {
      const er = el.getBoundingClientRect();
      const vr = vp.getBoundingClientRect();
      const pad = 4;
      if (vp.scrollWidth > vp.clientWidth) {
        if (er.left < vr.left + pad) vp.scrollLeft += er.left - vr.left - pad;
        else if (er.right > vr.left + vp.clientWidth - pad) vp.scrollLeft += er.right - (vr.left + vp.clientWidth) + pad;
      }
      if (vp.scrollHeight > vp.clientHeight) {
        if (er.top < vr.top + pad) vp.scrollTop += er.top - vr.top - pad;
        else if (er.bottom > vr.top + vp.clientHeight - pad) vp.scrollTop += er.bottom - (vr.top + vp.clientHeight) + pad;
      }
    }
    const r = el.getBoundingClientRect();
    if (typeof window !== 'undefined' && (r.top < 0 || r.bottom > window.innerHeight || r.left < 0 || r.right > window.innerWidth))
      el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  });

  // Preserve scroll position when months are added before / removed above.
  useIsomorphicLayoutEffect(() => {
    const keep = preserveRef.current;
    if (!keep) return;
    preserveRef.current = null;
    const el = monthRefs.current.get(keep.month);
    if (!el) return;
    const delta = el.getBoundingClientRect().top - keep.top;
    if (!delta) return;
    const vp = viewportRef.current;
    if (vp && vp.scrollHeight > vp.clientHeight) vp.scrollTop += delta;
    else window.scrollBy(0, delta);
  }, [renderedKey]);

  // Continuous mode: scroll to a programmatic target.
  useIsomorphicLayoutEffect(() => {
    const target = pendingScrollRef.current;
    if (!target) return;
    const el = monthRefs.current.get(target.month);
    if (!el) return;
    pendingScrollRef.current = null;
    const vp = viewportRef.current;
    if (vp && vp.scrollHeight > vp.clientHeight) {
      const delta = el.getBoundingClientRect().top - vp.getBoundingClientRect().top;
      vp.scrollTo?.({ top: vp.scrollTop + delta, behavior: target.behavior });
    } else el.scrollIntoView?.({ block: 'start', behavior: target.behavior });
  });

  // Auto load-more and visible-month tracking (continuous mode).
  const sentinelNext = useRef<HTMLDivElement | null>(null);
  const sentinelPrev = useRef<HTMLDivElement | null>(null);
  const loadMode = props.loadMore ?? 'button';
  useEffect(() => {
    if (navigation !== 'continuous' || typeof IntersectionObserver === 'undefined') return;
    const vp = viewportRef.current;
    const root = vp && props.maxBlockSize != null ? vp : null;
    const observers: IntersectionObserver[] = [];
    if (loadMode === 'auto') {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            live.current.loadMore(e.target === sentinelPrev.current ? 'previous' : 'next', 'auto');
          }
        },
        { root, rootMargin: '200px' },
      );
      if (sentinelNext.current) io.observe(sentinelNext.current);
      if (sentinelPrev.current) io.observe(sentinelPrev.current);
      observers.push(io);
    }
    const visible = new Set<CalendarMonth>();
    let frame = 0;
    const vis = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const m = (e.target as HTMLElement).dataset.month as CalendarMonth;
          if (e.isIntersecting) visible.add(m);
          else visible.delete(m);
        }
        if (!frame)
          frame = requestAnimationFrame(() => {
            frame = 0;
            const next = [...visible].sort();
            setObservedVisible((prev) => (prev && shallowEqualArray(prev, next) ? prev : next));
          });
      },
      { root },
    );
    for (const el of monthRefs.current.values()) vis.observe(el);
    observers.push(vis);
    return () => {
      observers.forEach((o) => o.disconnect());
      if (frame) cancelAnimationFrame(frame);
    };
  }, [navigation, loadMode, renderedKey, props.maxBlockSize, live]);

  // Outside click: React's synthetic capture marks events from inside the tree
  // (including portals such as the tooltip or slot popovers) before the
  // document listener sees them.
  const wantsOutside = !!props.onOutsideClick || !!props.onEvent;
  useEffect(() => {
    if (!wantsOutside) return;
    const onDown = (e: PointerEvent) => {
      const inside = insideEventRef.current;
      insideEventRef.current = false;
      if (inside) return;
      const t = e.target as Node | null;
      if (t && (rootRef.current?.contains(t) || tooltipElRef.current?.contains(t))) return;
      emit({ type: 'outsideClick', instanceId, nativeEvent: e });
      setTouchTip(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [wantsOutside, emit, instanceId]);

  // ------------------------------------------------ state-change events
  // Each effect compares against the previously reported value; React
  // re-renders and callback identity changes never re-emit.
  const readyRef = useRef(false);
  useEffect(() => {
    if (!measured || readyRef.current) return;
    readyRef.current = true;
    emit({ type: 'ready', instanceId, layout: live.current.getSnapshot().layout });
    return () => {
      readyRef.current = false;
    };
  }, [measured, emit, instanceId, live]);

  const prevLayoutRef = useRef<CalendarLayout | null>(null);
  useEffect(() => {
    const prev = prevLayoutRef.current;
    prevLayoutRef.current = layout;
    if (!measured || !prev || layoutKey(prev) === currentLayoutKey) return;
    emit({ type: 'layoutChange', instanceId, previous: prev, current: layout });
  }, [currentLayoutKey, measured]); // eslint-disable-line react-hooks/exhaustive-deps

  const prevValidationRef = useRef<{ result: ValidationResult; selKey: string } | null>(null);
  useEffect(() => {
    const prev = prevValidationRef.current;
    if (prev && issueEquals(prev.result, validation)) {
      prevValidationRef.current = { result: validation, selKey };
      return;
    }
    prevValidationRef.current = { result: validation, selKey };
    emit({
      type: 'validationChange',
      instanceId,
      previous: prev?.result ?? null,
      current: validation,
      selection,
      cause: !prev ? 'initial' : prev.selKey !== selKey ? 'selection' : 'rules',
    });
  }, [validation]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleKey = visibleMonths.join(',');
  const prevVisibleRef = useRef<CalendarMonth[] | null>(null);
  useEffect(() => {
    const prev = prevVisibleRef.current ?? [];
    if (prevVisibleRef.current && shallowEqualArray(prev, visibleMonths)) return;
    prevVisibleRef.current = visibleMonths;
    emit({ type: 'visibleMonthsChange', instanceId, previous: prev, months: visibleMonths });
  }, [visibleKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const prevRenderedRef = useRef<CalendarMonth[] | null>(null);
  useEffect(() => {
    const prev = prevRenderedRef.current ?? [];
    if (prevRenderedRef.current && shallowEqualArray(prev, renderedMonths)) return;
    prevRenderedRef.current = renderedMonths;
    emit({
      type: 'renderedMonthsChange',
      instanceId,
      previous: prev,
      months: renderedMonths,
      added: renderedMonths.filter((m) => !prev.includes(m)),
      removed: prev.filter((m) => !renderedMonths.includes(m)),
    });
  }, [renderedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const prevLoadingRef = useRef<{ key: string; snap: LoadingSnapshot } | null>(null);
  useEffect(() => {
    const prev = prevLoadingRef.current;
    prevLoadingRef.current = { key: loadingKey, snap: loadingSnapshot };
    if (!prev || prev.key === loadingKey) return;
    emit({ type: 'loadingChange', instanceId, previous: prev.snap, current: loadingSnapshot });
    if (loadingSnapshot.busy && !prev.snap.busy) announce(messages.loading);
    else if (loadingSnapshot.errorMonths.length > prev.snap.errorMonths.length) announce(messages.error);
  }, [loadingKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const openKey = openTip ? `${openTip.date}|${openTip.trigger}` : '';
  const prevTipRef = useRef<{ date: CalendarDate; trigger: TooltipTrigger } | null>(null);
  const tipInitRef = useRef(false);
  useEffect(() => {
    const prev = prevTipRef.current;
    if (!tipInitRef.current) {
      tipInitRef.current = true;
      prevTipRef.current = openTip;
      if (!openTip) return;
    } else {
      if ((prev?.date ?? null) === (openTip?.date ?? null)) {
        prevTipRef.current = openTip;
        return;
      }
      prevTipRef.current = openTip;
    }
    emit({
      type: 'tooltipOpenChange',
      instanceId,
      date: openTip?.date ?? null,
      previous: prev?.date ?? null,
      open: !!openTip,
      trigger: openTip?.trigger ?? null,
    });
  }, [openKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll events, coalesced per frame.
  const scrollFrame = useRef(0);
  const onViewportScroll = () => {
    if (!latestProps.current.onScroll && !latestProps.current.onEvent) return;
    if (scrollFrame.current) return;
    scrollFrame.current = requestAnimationFrame(() => {
      scrollFrame.current = 0;
      const vp = viewportRef.current;
      if (vp) emit({ type: 'scroll', instanceId, scrollLeft: vp.scrollLeft, scrollTop: vp.scrollTop });
    });
  };
  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), []);

  // ----------------------------------------------------------- render
  const slotCtx: SlotContext = {
    ...getSnapshot(),
    instanceId,
    actions: controller,
    messages,
    locale,
    formatDate: (d, o) => formatDate(d, locale, o ?? { day: 'numeric', month: 'long', year: 'numeric' }),
  };

  const weekdays = useMemo(() => getWeekdayNames(locale, firstDayOfWeek, props.weekdayFormat ?? 'short'), [locale, firstDayOfWeek, props.weekdayFormat]);
  const sharedWeekdays = navigation === 'continuous' && layout.columns === 1;
  const renderWeekdayRow = (asGridRow: boolean) => (
    <div role={asGridRow ? 'row' : 'presentation'} className={cx(p('weekdays'), cn?.weekdays)} aria-hidden={asGridRow ? undefined : true}>
      {weekdays.map((w) => (
        <span key={w.weekday} role={asGridRow ? 'columnheader' : undefined} aria-label={w.long} className={cx(p('weekday'), cn?.weekday)} title={w.long}>
          {props.formatWeekday ? props.formatWeekday(w.weekday, locale) : w.short}
        </span>
      ))}
    </div>
  );

  const navButton = (dir: 'previous' | 'next') => (
    <button
      type="button"
      className={cx(p('nav-button'), cn?.navButton)}
      data-direction={dir}
      aria-label={dir === 'previous' ? messages.previousMonth : messages.nextMonth}
      aria-controls={`${instanceId}-months`}
      disabled={dir === 'previous' ? !canPrevious : !canNext}
      onClick={() => pageBy(dir === 'previous' ? -step : step, 'navigation')}
    >
      <ChevronIcon direction={dir} />
    </button>
  );
  const defaultNav = navigation === 'paged' && !props.renderNavigation;
  const nextHeaderIndex = orientation === 'vertical' ? 0 : Math.min(layout.columns, renderedMonths.length) - 1;

  const renderMonth = (month: CalendarMonth, index: number) => {
    const { year, month: m } = getMonthParts(month);
    const first = firstDayOfMonth(month);
    const lead = (getWeekday(first) - firstDayOfWeek + 7) % 7;
    const count = daysInMonth(year, m);
    const cells: (CalendarDate | null)[] = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let i = 0; i < count; i++) cells.push(addDays(first, i));
    const rows = props.fixedWeeks ? 6 : Math.ceil(cells.length / 7);
    while (cells.length < rows * 7) cells.push(null);
    const title = props.formatMonthTitle ? props.formatMonthTitle(month, locale) : formatMonth(month, locale, props.monthTitleFormat);
    const titleId = `${instanceId}-title-${month}`;
    const status = monthStatus.get(month) ?? 'loaded';
    const navNode = defaultNav ? (
      <>
        {index === 0 && navButton('previous')}
        {index === nextHeaderIndex && navButton('next')}
      </>
    ) : null;
    const header = props.renderMonthHeader ? (
      props.renderMonthHeader({ month, title, index, navigation: navNode, status }, slotCtx)
    ) : (
      <div className={cx(p('month-header'), cn?.monthHeader)}>
        {defaultNav && index === 0 && navButton('previous')}
        <h2 id={titleId} className={cx(p('month-title'), cn?.monthTitle)} aria-live={navigation === 'paged' && index === 0 ? 'polite' : undefined}>
          {title}
        </h2>
        {defaultNav && index === nextHeaderIndex && navButton('next')}
      </div>
    );
    const weeks: ReactElement[] = [];
    for (let r = 0; r < rows; r++) {
      const row = cells.slice(r * 7, r * 7 + 7);
      weeks.push(
        <div role="row" key={r} className={cx(p('week'), cn?.week)}>
          {row.map((d, c) => {
            if (!d) return <div key={`e${c}`} role="gridcell" aria-hidden="true" className={p('day-empty')} />;
            const day = dayStates.get(d)!;
            const data = dayData.get(d);
            const description = data && typeof data === 'object' && 'description' in data && typeof (data as { description?: unknown }).description === 'string' ? (data as { description: string }).description : '';
            const ariaLabel = [
              day.label,
              day.today && messages.today,
              day.selectedStart && messages.rangeStart,
              day.selectedEnd && messages.rangeEnd,
              day.selectedSingle && messages.selected,
              day.inRange && messages.inRange,
              (day.disabled || day.unavailable) && (day.reasonText ?? messages.unavailable),
            ]
              .filter(Boolean)
              .join(', ');
            return (
              <DayCell<TDayData>
                key={d}
                day={day}
                stateKey={dayKeys.get(d)!}
                data={data}
                instanceId={instanceId}
                tabbable={d === tabbableDate}
                tooltipId={openTip?.date === d ? tooltipId : null}
                actions={actions}
                classNames={cn}
                unstyled={unstyled}
                description={description}
                ariaLabel={ariaLabel}
                band={bands.get(d) ?? null}
                bandPreview={!!preview && !!bands.get(d)}
                renderDay={props.renderDay}
                renderDayContent={props.renderDayContent}
              />
            );
          })}
        </div>,
      );
    }
    return (
      <section
        key={month}
        ref={(el) => {
          if (el) monthRefs.current.set(month, el);
          else monthRefs.current.delete(month);
        }}
        data-month={month}
        data-status={status === 'loaded' ? undefined : status}
        className={cx(p('month'), cn?.month)}
        aria-labelledby={props.renderMonthHeader ? undefined : titleId}
        aria-label={props.renderMonthHeader ? title : undefined}
        aria-busy={status === 'loading' || undefined}
      >
        {header}
        <div
          role="grid"
          aria-labelledby={props.renderMonthHeader ? undefined : titleId}
          aria-label={props.renderMonthHeader ? title : undefined}
          aria-readonly={mode === 'readonly' || undefined}
          aria-multiselectable={mode === 'multiple' || mode === 'range' || undefined}
          className={cx(p('grid'), cn?.grid)}
        >
          {!sharedWeekdays && renderWeekdayRow(true)}
          {weeks}
        </div>
        {/* Default month loading UI is the day skeleton; text only for assistive tech. */}
        {status === 'loading' &&
          (props.renderLoading ? (
            props.renderLoading({ scope: 'month', months: [month], status, messages: { loading: messages.loading } }, slotCtx)
          ) : (
            <span role="status" style={srOnlyStyle}>
              {title}: {messages.loading}
            </span>
          ))}
        {status === 'error' &&
          (props.renderError ? (
            props.renderError({ months: [month], retry: () => latestProps.current.onRetry?.([month]), messages: { error: messages.error, retry: messages.retry } }, slotCtx)
          ) : (
            <div className={cx(p('error'), cn?.error)} role="alert">
              <span>{messages.error}</span>
              {props.onRetry && (
                <button type="button" className={p('retry')} onClick={() => latestProps.current.onRetry?.([month])}>
                  {messages.retry}
                </button>
              )}
            </div>
          ))}
      </section>
    );
  };

  const loadMoreControl = (dir: LoadDirection) => {
    if (navigation !== 'continuous' || loadMode === 'manual') return null;
    if (!(loadDirections === 'both' || loadDirections === dir)) return null;
    const enabled = canLoad(dir);
    const loadingAdded = !!lastLoadRef.current && lastLoadRef.current.direction === dir && lastLoadRef.current.months.some((mm) => monthStatus.get(mm) === 'loading');
    const label = props.loadMoreLabels?.[dir] ?? (dir === 'next' ? messages.loadNext : messages.loadPrevious);
    const sentinel = loadMode === 'auto' ? <div ref={dir === 'next' ? sentinelNext : sentinelPrev} aria-hidden="true" style={{ height: 1 }} /> : null;
    // Added months show the day skeleton; a separate indicator only when customised.
    const loadingNode =
      loadingAdded &&
      props.renderLoading?.({ scope: 'load-more', months: lastLoadRef.current!.months, status: 'loading', messages: { loading: messages.loading } }, slotCtx);
    const ctl =
      loadMode === 'button' && enabled
        ? props.renderLoadMore
          ? props.renderLoadMore({ direction: dir, canLoad: enabled, loading: loadingAdded, loadMore: () => loadMore(dir, 'button'), label }, slotCtx)
          : (
              <button type="button" className={cx(p('load-more'), cn?.loadMore)} data-direction={dir} onClick={(e) => loadMore(dir, 'button', e.currentTarget)}>
                {label}
              </button>
            )
        : null;
    return (
      <div className={p('load-more-area')} data-direction={dir}>
        {dir === 'previous' && sentinel}
        {dir === 'next' && loadingNode}
        {ctl}
        {dir === 'previous' && loadingNode}
        {dir === 'next' && enabled && sentinel}
      </div>
    );
  };

  const rootStyle = {
    ...props.style,
    ['--cal-day-min-w' as string]: `${minDay.width}px`,
    ['--cal-day-min-h' as string]: `${minDay.height}px`,
    ['--cal-day-max' as string]: `${maxDaySize}px`,
    ['--cal-month-gap' as string]: `${monthGap}px`,
    ['--cal-month-padding' as string]: `${MONTH_PADDING_INLINE}px`,
    ['--cal-month-min' as string]: `${layout.minMonthWidth}px`,
    ['--cal-columns' as string]: String(layout.columns),
  };

  const header = props.renderHeader?.(slotCtx);
  const footer = props.renderFooter?.(slotCtx);
  const openTooltip = openTip ? tooltips.get(openTip.date) : null;

  return (
    <div
      ref={rootRef}
      id={instanceId}
      dir={direction}
      role="group"
      aria-label={props['aria-label'] ?? messages.calendar}
      aria-busy={loadingSnapshot.busy || undefined}
      className={cx(p('root'), cn?.root, props.className)}
      style={rootStyle}
      data-mode={mode}
      data-highlight-today={highlightToday ? '' : undefined}
      data-phase={phase}
      data-orientation={orientation}
      data-navigation={navigation}
      data-overflow={layout.activeOverflow}
      data-at-min-size={layout.atMinDaySize ? '' : undefined}
      data-measured={measured ? '' : undefined}
      onPointerDownCapture={() => {
        insideEventRef.current = true;
        modalityRef.current = 'pointer';
      }}
      onKeyDownCapture={() => {
        modalityRef.current = 'keyboard';
      }}
      onPointerLeave={() => setHovered(null)}
    >
      {mode === 'readonly' && messages.readOnlyNotice && (
        <p className={cx(p('readonly-notice'), cn?.readOnlyNotice)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
            <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          {messages.readOnlyNotice}
        </p>
      )}
      {header != null && header !== false && <div className={cx(p('header'), cn?.header)}>{header}</div>}
      {props.renderNavigation && navigation === 'paged' && (
        <div className={cx(p('navigation'), cn?.navigation)}>
          {props.renderNavigation(
            {
              canPrevious,
              canNext,
              previous: () => pageBy(-step, 'navigation'),
              next: () => pageBy(step, 'navigation'),
              months: renderedMonths,
              labels: { previous: messages.previousMonth, next: messages.nextMonth },
            },
            slotCtx,
          )}
        </div>
      )}
      {sharedWeekdays && renderWeekdayRow(false)}
      <div
        ref={viewportRef}
        className={cx(p('viewport'), cn?.viewport)}
        style={{
          overflowX: 'auto',
          ...(props.maxBlockSize != null ? { maxBlockSize: props.maxBlockSize, overflowY: 'auto' } : null),
        }}
        onScroll={onViewportScroll}
      >
        {loadMoreControl('previous')}
        <div
          id={`${instanceId}-months`}
          className={cx(p('months'), cn?.months)}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layout.columns}, minmax(${layout.minMonthWidth}px, 1fr))`,
          }}
        >
          {renderedMonths.length
            ? renderedMonths.map(renderMonth)
            : (
                <div className={cx(p('loading'), cn?.loading)} data-scope="initial" role="status">
                  <span className={p('spinner')} aria-hidden="true" />
                  <span>{messages.loading}</span>
                </div>
              )}
        </div>
        {loadMoreControl('next')}
      </div>
      {props.loading &&
        (props.renderLoading ? (
          props.renderLoading({ scope: 'initial', months: renderedMonths, status: 'loading', messages: { loading: messages.loading } }, slotCtx)
        ) : (
          <div className={cx(p('loading'), cn?.loading)} data-scope="initial" role="status">
            <span className={p('spinner')} aria-hidden="true" />
            <span>{messages.loading}</span>
          </div>
        ))}
      {footer != null && footer !== false && <div className={cx(p('footer'), cn?.footer)}>{footer}</div>}
      <div className={cx(p('live'), cn?.liveRegion)} aria-live="polite" aria-atomic="true" style={srOnlyStyle}>
        {announcement}
      </div>
      {openTip && openTooltip && tooltipAnchor && (
        <Tooltip
          id={tooltipId}
          anchor={tooltipAnchor}
          clipElement={viewportRef.current}
          boundary={tooltipOpts.boundary ?? 'calendar'}
          placement={tooltipOpts.placement ?? 'top'}
          offset={tooltipOpts.offset ?? 8}
          className={cx(p('tooltip'), cn?.tooltip, tooltipOpts.className) ?? ''}
          arrowClassName={p('tooltip-arrow') ?? ''}
          container={tooltipOpts.container}
          tooltipRef={tooltipElRef}
        >
          {(placement) =>
            props.renderDayTooltip
              ? props.renderDayTooltip({ day: dayStates.get(openTip!.date)!, content: openTooltip.content, trigger: openTip!.trigger, placement })
              : openTooltip.content
          }
        </Tooltip>
      )}
    </div>
  );
}

/**
 * Inline, responsive, accessible date picker.
 * Pass a `ref` to get a {@link CalendarController}.
 */
export const Calendar = forwardRef(CalendarInner) as <TDayData = unknown, TContext = unknown>(
  props: CalendarProps<TDayData, TContext> & RefAttributes<CalendarController>,
) => ReactElement | null;
