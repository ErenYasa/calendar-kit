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
