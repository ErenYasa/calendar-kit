import { Page, PropsTable, Section } from '../ui';

export function PropsReference() {
  return (
    <Page title="Calendar props" lead="All props of <Calendar>, grouped. Every prop is optional except mode. Controlled props and their uncontrolled counterparts are listed together.">
      <Section title="Selection">
        <PropsTable
          rows={[
            { name: 'mode', type: "'single' | 'range' | 'multiple' | 'readonly'", required: true, description: 'Decides the value type.' },
            { name: 'value', type: 'CalendarDate | null · DateRange · readonly CalendarDate[]', description: 'Controlled value. Uncontrolled counterpart: defaultValue.' },
            { name: 'defaultValue', type: 'same as value', description: 'Initial value, read once on mount.' },
            { name: 'onChange', type: '(value, e: ChangeEvent) => void', description: 'User and controller changes; never echoes prop changes.' },
            { name: 'activeEndpoint', type: "'start' | 'end'", description: 'Range: which end the next click sets (controlled). Uncontrolled: defaultActiveEndpoint.' },
            { name: 'defaultActiveEndpoint', type: "'start' | 'end'", description: 'Initial endpoint; otherwise derived from the value.' },
          ]}
        />
      </Section>
      <Section title="Rules and time">
        <PropsTable
          rows={[
            { name: 'rules', type: 'SelectionRules | (SelectionRules | null | undefined | false)[]', description: 'Rule sets; arrays are combined (see Rules).' },
            { name: 'minDate / maxDate', type: 'CalendarDate | null', description: 'Inclusive limits; also limit navigation.' },
            { name: 'disablePast / disableFuture', type: 'boolean', default: 'false', description: 'Relative to today.' },
            { name: 'ruleContext', type: 'TContext', description: 'Passed to rule callbacks as ctx.context; a change revalidates.' },
            { name: 'relaxSchedule', type: 'boolean | { weekdays?: boolean; length?: boolean }', default: 'false', description: 'Ignore schedule rules (weekdays, lengths, availability marked schedule).' },
            { name: 'today', type: 'CalendarDate', description: 'Explicit today (SSR, tests).' },
            { name: 'timeZone', type: 'string', description: 'IANA zone for today when today is not given.' },
            { name: 'highlightToday', type: 'boolean', default: 'true', description: 'Today circle and “Today” tooltip (the aria text stays).' },
          ]}
        />
      </Section>
      <Section title="Data">
        <PropsTable
          rows={[
            { name: 'getDayData', type: '(date) => TDayData | undefined', description: 'Per-day data; DefaultDayData is drawn by the default content.' },
            { name: 'getDataStatus', type: "(month) => 'unknown' | 'loading' | 'loaded' | 'error'", description: 'Month data status; also feeds the rules.' },
            { name: 'loading', type: 'boolean', description: 'Calendar-wide: initial load (skeleton) or later background refresh.' },
            { name: 'onRetry', type: '(months) => void', description: 'Retry from the default error UI.' },
            { name: 'modifiers', type: 'Record<string, (day: DayState) => boolean>', description: 'Custom flags → day.modifiers and data-mod-* attributes.' },
          ]}
        />
      </Section>
      <Section title="Layout and navigation">
        <PropsTable
          rows={[
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Month layout.' },
            { name: 'numberOfMonths', type: 'number', default: '1', description: 'Months in the window.' },
            { name: 'monthPosition', type: 'number', default: '1', description: '1-based position of the reference month.' },
            { name: 'overflow', type: "'wrap' | 'scroll' | 'reduce-months'", default: "'wrap'", description: 'When months do not fit the container.' },
            { name: 'minDaySize', type: 'number | { width; height }', default: '40', description: 'Minimum interactive day size in px.' },
            { name: 'maxDaySize', type: 'number', default: '56', description: 'Maximum cell height in px.' },
            { name: 'monthGap', type: 'number', default: '32', description: 'Gap between months in px.' },
            { name: 'fixedWeeks', type: 'boolean', default: 'false', description: 'Always 6 week rows.' },
            { name: 'maxBlockSize', type: 'number | string', description: 'Max height of the months area (inner vertical scroll).' },
            { name: 'navigation', type: "'paged' | 'continuous'", default: "'paged'", description: 'Pages or a growing list.' },
            { name: 'stepMonths', type: 'number', default: '1', description: 'Paged: months per previous/next.' },
            { name: 'loadMore', type: "'button' | 'auto' | 'manual'", default: "'button'", description: 'Continuous: how months are added (auto: when the end of the list scrolls into view).' },
            { name: 'loadDirections', type: "'next' | 'previous' | 'both'", default: "'next'", description: 'Continuous: where months can be added.' },
            { name: 'monthsPerLoad', type: 'number', default: 'numberOfMonths', description: 'Months per load.' },
            { name: 'maxRenderedMonths', type: 'number', default: '24', description: 'Continuous DOM bound.' },
            { name: 'loadMoreLabels', type: '{ previous?, next?: ReactNode }', description: 'Content of the default load-more buttons.' },
            { name: 'visibleMonth', type: 'CalendarMonth', description: 'Controlled reference month (pair with onVisibleMonthChange). Uncontrolled: defaultVisibleMonth.' },
            { name: 'defaultVisibleMonth', type: 'CalendarMonth', description: 'Initial reference month.' },
            { name: 'resizeThreshold', type: 'number', description: 'Minimum size change (px) before onResize is called; layout is not delayed.' },
          ]}
        />
      </Section>
      <Section title="Localisation">
        <PropsTable
          rows={[
            { name: 'locale', type: 'string', default: "'en-US'", description: 'Intl locale.' },
            { name: 'messages', type: 'CalendarMessagesInput', default: 'messagesEn', description: 'Partial overrides of the calendar texts.' },
            { name: 'direction', type: "'ltr' | 'rtl'", default: 'from locale', description: 'Layout direction.' },
            { name: 'firstDayOfWeek', type: 'Weekday (0–6)', default: 'from locale', description: '0 = Sunday.' },
            { name: 'weekdayFormat', type: "'narrow' | 'short' | 'long'", default: "'short'", description: 'Weekday names.' },
            { name: 'monthTitleFormat', type: 'Intl.DateTimeFormatOptions', description: 'Month title format.' },
            { name: 'formatMonthTitle', type: '(month, locale) => string', description: 'Custom month title.' },
            { name: 'formatWeekday', type: '(weekday, locale) => ReactNode', description: 'Custom weekday header.' },
            { name: 'formatDayLabel', type: '(date, locale) => string', description: 'Custom accessible day label.' },
          ]}
        />
      </Section>
      <Section title="Rendering and slots">
        <PropsTable
          rows={[
            { name: 'renderDay', type: '({ day, data, getDayProps, defaultContent }) => ReactNode', description: 'Render the day element yourself.' },
            { name: 'renderDayContent', type: '({ day, data }) => ReactNode', description: 'Replace the inside of the default day button.' },
            { name: 'getDayTooltip', type: '({ day, data }) => ReactNode | { content, persistent? } | null', description: 'Tooltip per day.' },
            { name: 'renderDayTooltip', type: '({ day, content, trigger, placement }) => ReactNode', description: 'Tooltip content.' },
            { name: 'tooltip', type: '{ placement?, boundary?, offset?, className?, container?, openDate? }', description: 'Tooltip options.' },
            { name: 'renderHeader / renderFooter', type: '(ctx: SlotContext) => ReactNode', description: 'Above / below the months.' },
            { name: 'renderMonthHeader', type: '(props, ctx) => ReactNode', description: 'A month’s title row.' },
            { name: 'renderNavigation', type: '(props, ctx) => ReactNode', description: 'Previous/next controls (paged).' },
            { name: 'renderLoading', type: '(props, ctx) => ReactNode', description: 'Extra loading indicator.' },
            { name: 'renderError', type: '(props, ctx) => ReactNode', description: 'Error UI.' },
            { name: 'renderLoadMore', type: '(props, ctx) => ReactNode', description: 'Load-more control.' },
          ]}
        />
      </Section>
      <Section title="Styling and identity">
        <PropsTable
          rows={[
            { name: 'className / style', type: 'string / CSSProperties', description: 'On the root element (CSS variables go here).' },
            { name: 'classNames', type: 'CalendarClassNames', description: 'Classes per part; dayCell, dayButton and dayContent also accept (day) => string.' },
            { name: 'unstyled', type: 'boolean', default: 'false', description: 'No default class names.' },
            { name: 'id', type: 'string', default: 'useId()', description: 'Root id; the tooltip id is derived from it.' },
            { name: 'aria-label', type: 'string', default: 'messages.calendar', description: 'Label of the calendar group.' },
            { name: 'ref', type: 'Ref<CalendarController>', description: 'Controller methods.' },
          ]}
        />
      </Section>
    </Page>
  );
}

export function EventsReference() {
  return (
    <Page title="Callbacks & events" lead="Every callback receives a typed event. onEvent receives all of them as one discriminated union, after the specific callback.">
      <PropsTable
        rows={[
          { name: 'onChange', type: '(value, ChangeEvent)', description: 'Value changed: source, reason (start, complete, toggle-on, clear, reset, set, …), phase, validation.' },
          { name: 'onSelectionComplete', type: 'SelectionCompleteEvent', description: 'A single date, a range end or a multiple pick completed the selection.' },
          { name: 'onSelectionClear', type: 'SelectionClearEvent', description: 'The selection was cleared.' },
          { name: 'onInvalidSelection', type: 'InvalidSelectionEvent', description: 'A click, key or ref.select() was rejected: issue + localised message.' },
          { name: 'onValidationChange', type: 'ValidationChangeEvent', description: 'Validity of the current value changed (cause: initial, selection, rules).' },
          { name: 'onDateClick', type: 'DateClickEvent', description: 'Every activation, with accepted, kind and issue.' },
          { name: 'onActiveEndpointChange', type: '(endpoint, event)', description: 'Range endpoint changed (controlled: a request at action time).' },
          { name: 'onVisibleMonthChange', type: '(month, event)', description: 'Reference month changed (previous, next, jump, keyboard).' },
          { name: 'onVisibleMonthsChange', type: 'VisibleMonthsChangeEvent', description: 'The visible window changed.' },
          { name: 'onRenderedMonthsChange', type: 'RenderedMonthsChangeEvent', description: 'Rendered months changed (also on mount): load data here.' },
          { name: 'onLoadMore', type: 'LoadMoreEvent', description: 'Months were added (button, auto, manual, keyboard).' },
          { name: 'onLoadingChange', type: 'LoadingChangeEvent', description: 'Loading snapshot transitions.' },
          { name: 'onLayoutChange', type: 'LayoutChangeEvent', description: 'Effective layout (columns, months, overflow) changed.' },
          { name: 'onResize', type: 'ResizeEvent', description: 'Container size changed (see resizeThreshold).' },
          { name: 'onDayFocusChange', type: 'DayFocusChangeEvent', description: 'Keyboard/DOM focus moved to another day.' },
          { name: 'onTooltipOpenChange', type: 'TooltipOpenChangeEvent', description: 'A tooltip opened or closed.' },
          { name: 'onOutsideClick', type: 'OutsideClickEvent', description: 'Pointer press outside the calendar’s React tree.' },
          { name: 'onScroll', type: 'ScrollEvent', description: 'Months area scrolled (one call per frame).' },
          { name: 'onReady', type: 'ReadyEvent', description: 'First layout measured.' },
          { name: 'onEvent', type: 'CalendarEvent', description: 'All of the above.' },
        ]}
      />
      <Section title="Order">
        <ul>
          <li>Start click: dateClick → dayFocusChange → change → activeEndpointChange.</li>
          <li>End click: dateClick → (dayFocusChange) → change → selectionComplete → activeEndpointChange.</li>
          <li>Rejected click: dateClick → (dayFocusChange) → invalidSelection.</li>
          <li>Derived events (validationChange, visibleMonthsChange, renderedMonthsChange, loadingChange, layoutChange, tooltipOpenChange) arrive after the commit.</li>
          <li>Changing a controlled prop never calls onChange (source <code>prop</code> appears only in derived events).</li>
        </ul>
      </Section>
    </Page>
  );
}

export function ControllerReference() {
  return (
    <Page title="Controller (ref)" lead="Pass a ref to drive the calendar from your own UI. The same object is available in slots as ctx.actions.">
      <PropsTable
        rows={[
          { name: 'goToMonth(month, options?)', type: '→ { month, clamped } | null', description: 'YYYY-MM or a date’s month; { focus?, behavior? }. Never changes the selection.' },
          { name: 'next() / previous()', type: '→ void', description: 'Page forward/back (paged) or scroll (continuous).' },
          { name: 'loadMore(direction?)', type: '→ void', description: 'Add months (continuous).' },
          { name: 'select(value)', type: '→ ValidationResult', description: 'Propose a value; validated like a click, emits change or invalidSelection.' },
          { name: 'clear()', type: '→ void', description: 'Clear the selection (change + selectionClear).' },
          { name: 'reset()', type: '→ void', description: 'Back to defaultValue (or empty).' },
          { name: 'setActiveEndpoint(endpoint)', type: '→ void', description: 'Range: which end the next click sets.' },
          { name: 'focusDate(date)', type: '→ void', description: 'Move keyboard focus to a day (navigates if needed).' },
          { name: 'getSnapshot()', type: '→ CalendarSnapshot', description: 'selection, activeEndpoint, phase, validation, referenceMonth, visibleMonths, renderedMonths, layout, focusedDate, today.' },
          { name: 'instanceId', type: 'string', description: 'The root id.' },
        ]}
      />
    </Page>
  );
}

export function RulesReference() {
  return (
    <Page title="Rules, adapters & helpers" lead="The React-free part of the API, also available from calendar-kit/core.">
      <Section title="SelectionRules">
        <PropsTable
          rows={[
            { name: 'minDate / maxDate', type: 'CalendarDate | null', description: 'Limits.' },
            { name: 'disablePast / disableFuture', type: 'boolean', description: 'Relative to today.' },
            { name: 'rangeSemantics', type: "'inclusive' | 'exclusive'", default: "'inclusive'", description: 'Whether the end day counts.' },
            { name: 'allowSameDay', type: 'boolean', default: 'inclusive: true, exclusive: false', description: 'start === end.' },
            { name: 'minLength / maxLength / fixedLength', type: 'number', description: 'In nights (exclusive) or days (inclusive).' },
            { name: 'startWeekdays / endWeekdays', type: 'Weekday[]', description: 'Allowed start/end weekdays (schedule).' },
            { name: 'availableWeekdays', type: 'Weekday[]', description: 'Operating weekdays; others closed (schedule).' },
            { name: 'singleDayFirst', type: 'boolean', description: 'Inclusive: first click selects one day, a later click extends it.' },
            { name: 'getDayAvailability', type: '(date, ctx) => DayAvailability | null', description: 'Per-day closed/canStart/canEnd/canPassThrough/reason/message/schedule.' },
            { name: 'getDataStatus', type: '(month) => DataStatus', description: 'Data status (the calendar prop of the same name is merged in).' },
            { name: 'unknownDataPolicy', type: "'block' | 'allow'", default: "'block'", description: 'Selectability of days whose data is not loaded.' },
            { name: 'validateSelection', type: '(selection, ctx) => ValidationIssue | null', description: 'Your own rule.' },
            { name: 'maxSelections', type: 'number', description: 'Multiple mode: distinct dates.' },
            { name: 'requireReachableEnd', type: 'boolean', description: 'Range: reject starts that provably have no valid end (63-candidate search).' },
          ]}
        />
      </Section>
      <Section title="Adapters">
        <PropsTable
          rows={[
            { name: 'stayRules(options)', type: 'SelectionRules', description: 'Exclusive ranges: minNights, maxNights, fixedNights, allowSameDay, checkInWeekdays, checkOutWeekdays, availableWeekdays, getDayStatus → available | booked | closed | check-in-only | check-out-only. requireReachableEnd on.' },
            { name: 'dayRangeRules(options)', type: 'SelectionRules', description: 'Inclusive ranges: minDays, maxDays, fixedDays, startWeekdays, endWeekdays, availableWeekdays, singleDayFirst, getDayStatus → available | closed | start-only | end-only.' },
            { name: 'closedDates(dates, reason?)', type: 'SelectionRules', description: 'Closes the given dates.' },
            { name: 'combineRules(...sets)', type: 'SelectionRules', description: 'Merges rule sets (later defined values win; availability is merged).' },
            { name: 'relaxRules(rules, options?)', type: 'SelectionRules', description: 'What relaxSchedule does, for use outside the component.' },
            { name: 'createSelectionEngine({ rules, state, today, context })', type: 'SelectionEngine', description: 'Headless engine: plan(date), validate(selection), validateRange(start, end), availability(date), checkDay(date), checkStart(date), dataStatus(date).' },
          ]}
        />
      </Section>
      <Section title="Date helpers">
        <p>
          Creating: <code>toCalendarDate</code>, <code>parseDate</code>, <code>createDate</code>, <code>isCalendarDate</code>, <code>fromJSDate</code>,{' '}
          <code>getToday</code>, <code>toCalendarMonth</code>, <code>parseMonth</code>, <code>createMonth</code>. Arithmetic: <code>addDays</code>,{' '}
          <code>addMonths</code>, <code>addMonthsToMonth</code>, <code>diffDays</code>, <code>diffMonths</code>, <code>eachDay</code>, <code>eachMonth</code>,{' '}
          <code>clampDate</code>, <code>firstDayOfMonth</code>, <code>lastDayOfMonth</code>, <code>daysInMonth</code>, <code>isLeapYear</code>. Comparing:{' '}
          <code>compareDates</code>, <code>isBefore</code>, <code>isAfter</code>, <code>isSameDate</code>, <code>isWithin</code>. Parts: <code>getDateParts</code>,{' '}
          <code>getMonthParts</code>, <code>getWeekday</code>, <code>getMonth</code>, <code>toUTCDate</code>. Ranges: <code>countNights</code>,{' '}
          <code>countDays</code>, <code>getRangeLength</code>, <code>getIncludedDays</code>, <code>getSelectionPhase</code>. Locale: <code>formatDate</code>,{' '}
          <code>formatMonth</code>, <code>getWeekdayNames</code>, <code>getDefaultFirstDayOfWeek</code>, <code>getLocaleDirection</code>. Messages:{' '}
          <code>messagesEn</code>, <code>messagesTr</code>, <code>messagesDe</code>, <code>messagesFr</code>, <code>messagesEs</code>, <code>messagesIt</code>,{' '}
          <code>messagesNl</code>, <code>messagesAr</code>, <code>mergeMessages</code>, <code>formatIssue</code>.
        </p>
        <p>Dates are defined for years 0001–9999; arithmetic outside that range is undefined. <code>timeZone</code> must be a valid IANA name.</p>
      </Section>
    </Page>
  );
}

export function TypesReference() {
  return (
    <Page title="Types" lead="The most important types, shown in full. All are exported from calendar-kit (React types also from calendar-kit/client).">
      <Section title="Values">
        <pre className="docs-pre docs-type-block">{`type CalendarDate = string & { /* brand */ }   // "YYYY-MM-DD"
type CalendarMonth = string & { /* brand */ }  // "YYYY-MM"
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6        // 0 = Sunday

interface DateRange { start: CalendarDate | null; end: CalendarDate | null }

type Selection =
  | { mode: 'single'; value: CalendarDate | null }
  | { mode: 'range'; value: DateRange }
  | { mode: 'multiple'; value: readonly CalendarDate[] }
  | { mode: 'readonly'; value: null }

type SelectionPhase = 'empty' | 'start-selected' | 'complete'
type DataStatus = 'unknown' | 'loading' | 'loaded' | 'error'`}</pre>
      </Section>
      <Section title="Validation">
        <pre className="docs-pre docs-type-block">{`interface ValidationResult { valid: boolean; issue: ValidationIssue | null }

interface ValidationIssue {
  code: ReasonCode        // 'before-min' | 'after-max' | 'past' | 'future' | 'closed'
                          // | 'start-not-allowed' | 'end-not-allowed' | 'blocked-in-range'
                          // | 'weekday-start' | 'weekday-end' | 'min-length' | 'max-length'
                          // | 'fixed-length' | 'same-day' | 'end-before-start' | 'max-selections'
                          // | 'data-unknown' | 'data-loading' | 'data-error' | 'invalid-date' | 'custom'
  date?: CalendarDate
  params?: Record<string, string | number | boolean | null | undefined>
  dayReason?: string      // DayAvailability.reason of the offending day
  message?: string
}`}</pre>
      </Section>
      <Section title="DayState">
        <p>Passed to render props, modifiers and tooltips; the same state is exposed as data-* attributes.</p>
        <pre className="docs-pre docs-type-block">{`interface DayState {
  date: CalendarDate; month: CalendarMonth; dayOfMonth: number; dayText: string
  weekday: Weekday; column: number; label: string
  today: boolean; past: boolean; future: boolean
  disabled: boolean        // activation rejected now (still focusable)
  unavailable: boolean     // never selectable (closed, out of bounds, no data)
  readOnly: boolean
  selected: boolean; selectedSingle: boolean; selectedStart: boolean; selectedEnd: boolean
  inRange: boolean; included: boolean
  inPreviewRange: boolean; previewStart: boolean; previewEnd: boolean
  focused: boolean; hovered: boolean
  action: ActivationKind   // what a click would do
  canStart: boolean; canEnd: boolean; canPassThrough: boolean; outOfSchedule: boolean
  dataStatus: DataStatus; loading: boolean
  reason: ValidationIssue | null; reasonText: string | null
  modifiers: Readonly<Record<string, boolean>>
  weekStart: boolean; weekEnd: boolean; monthStart: boolean; monthEnd: boolean
}`}</pre>
      </Section>
      <Section title="SlotContext">
        <pre className="docs-pre docs-type-block">{`interface SlotContext extends CalendarSnapshot {
  instanceId: string
  actions: CalendarController
  messages: CalendarMessages
  locale: string
  formatDate(date: CalendarDate, options?: Intl.DateTimeFormatOptions): string
}`}</pre>
      </Section>
    </Page>
  );
}
