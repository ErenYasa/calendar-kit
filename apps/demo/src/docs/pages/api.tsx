import type { ReactNode } from 'react';
import more from '../../snippets/props/more.tsx?code';
import overview from '../../snippets/props/overview.tsx?code';
import { Snippet } from '../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../ui';

const c = (s: string) => <code>{s}</code>;
const to = (slug: string, text: ReactNode) => <a href={`#/${slug}`}>{text}</a>;
const ev = (name: string, type: string, what: ReactNode) => ({
  name,
  type,
  description: (
    <>
      {what} See {to('api-events', 'Callbacks & events')}.
    </>
  ),
});

export function PropsReference() {
  return (
    <Page
      title="Calendar props"
      lead={
        <>
          Every prop of <code>{'<Calendar>'}</code>, grouped by topic. Only <code>mode</code> is required. Controlled props are listed next to their
          uncontrolled counterpart; each row links to the page whose live example uses the prop.
        </>
      }
    >
      <Section title="Common props">
        <p>
          A typical booking calendar: a controlled range with rules and limits, two months that adapt to the container, per-day data, a locale and a{' '}
          <code>ref</code> for controls outside the calendar.
        </p>
        <Snippet files={overview} label="Common props" />
        <p>Formatting, layout and identity props that the other examples do not use, together with the remaining controller methods:</p>
        <Snippet files={more} label="Formatting, layout and identity" />
        <Note>
          <strong>Controlled or uncontrolled.</strong> Three pieces of state come in pairs: <code>value</code> / <code>defaultValue</code>,{' '}
          <code>activeEndpoint</code> / <code>defaultActiveEndpoint</code> and <code>visibleMonth</code> / <code>defaultVisibleMonth</code>. Passing the
          controlled prop (anything but <code>undefined</code>) makes you the owner: the calendar reports requests through its callback and shows what you
          pass back. The <code>default…</code> prop is read once on mount; later changes to it are ignored. Changing a controlled prop never calls the
          matching callback.
        </Note>
      </Section>

      <Section title="Selection">
        <p>
          <code>CalendarProps</code> is a union over <code>mode</code>: the type of <code>value</code>, <code>defaultValue</code> and{' '}
          <code>onChange</code> follows it, and <code>activeEndpoint</code> exists only for ranges. See {to('selection-modes', 'Selection modes')} and{' '}
          {to('core-concepts', 'Core concepts')}.
        </p>
        <PropsTable
          caption="Selection props"
          rows={[
            {
              name: 'mode',
              type: "'single' | 'range' | 'multiple' | 'readonly'",
              required: true,
              description: (
                <>
                  What a click does: pick one date, pick a start and an end, toggle dates in a set, or nothing ({c('readonly')} shows availability with a
                  “View only” notice, no value props, and the controller&apos;s {c('select()')} returns invalid). Changing it at runtime on an uncontrolled
                  calendar starts from the new mode&apos;s empty value without calling {c('onChange')}. {to('selection-modes', 'Selection modes')}.
                </>
              ),
            },
            {
              name: 'value',
              type: 'single: CalendarDate | null · range: DateRange · multiple: readonly CalendarDate[]',
              description: (
                <>
                  <strong>Controlled</strong> selection (pair: {c('defaultValue')}). Any value other than {c('undefined')} makes the calendar controlled, so{' '}
                  {c('null')} or {c("{ start: null, end: null }")} is a controlled empty selection. Store what {c('onChange')} gives you, otherwise clicks have
                  no visible effect. Without {c('visibleMonth')}/{c('defaultVisibleMonth')}, the selection&apos;s month (single date, range start or
                  earliest multiple date) is the initial month. {to('core-concepts', 'Core concepts → Controlled')}.
                </>
              ),
            },
            {
              name: 'defaultValue',
              type: <>same as <code>value</code></>,
              description: (
                <>
                  <strong>Uncontrolled</strong> initial selection (pair: {c('value')}), read once on mount; later changes are ignored. {c('ref.reset()')}{' '}
                  restores it. Ignored when {c('value')} is given. {to('core-concepts', 'Core concepts → Uncontrolled')}.
                </>
              ),
            },
            {
              name: 'onChange',
              type: '(value, e: ChangeEvent) => void',
              description: (
                <>
                  Called with the new value after every accepted user or controller action that changes the value (a range calls it on the first click
                  with {c('{ start, end: null }')}, then with both ends). Never called for prop changes, rejected clicks, or when the value stays the
                  same (re-picking the selected date, {c('select()')}/{c('reset()')} of the current value, {c('clear()')} on an empty selection). {c('e')} carries{' '}
                  {c('reason')}, {c('source')}, {c('phase')} and {c('validation')}. {to('api-events', 'onChange')}.
                </>
              ),
            },
            {
              name: 'activeEndpoint',
              type: "'start' | 'end'",
              description: (
                <>
                  Range only. <strong>Controlled</strong> endpoint the next click sets (pair: {c('defaultActiveEndpoint')}); pair it with{' '}
                  {c('onActiveEndpointChange')}. Share it, together with {c('value')}, between calendars that edit one range so a start picked in one makes
                  the other expect the end. When omitted it is derived from the value ({c('end')} while only a start is set).{' '}
                  {to('synced', 'Synced calendars')}, {to('recipe-three-calendars', 'Three synced calendars')}.
                </>
              ),
            },
            {
              name: 'defaultActiveEndpoint',
              type: "'start' | 'end'",
              default: <>derived from the value</>,
              description: (
                <>
                  Range only. <strong>Uncontrolled</strong> initial endpoint, e.g. {c("'end'")} to let the user change only the end of a pre-filled range. It
                  applies while the selection is still the initial one; after a change the endpoint follows the selection. Ignored when{' '}
                  {c('activeEndpoint')} is given. {to('selection-modes', 'Selection modes → Initial values')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Rules and time">
        <p>
          All limits end up in one rule set: the <code>rules</code> prop (one set or an array) is combined with the shortcut props <code>minDate</code>,{' '}
          <code>maxDate</code>, <code>disablePast</code>, <code>disableFuture</code> and <code>getDataStatus</code> through <code>combineRules</code>, so
          the stricter value always wins (latest <code>minDate</code>, earliest <code>maxDate</code>, either <code>disablePast</code>). See{' '}
          {to('api-rules', 'Rules & adapters')}.
        </p>
        <PropsTable
          caption="Rule and time props"
          rows={[
            {
              name: 'rules',
              type: 'SelectionRules<TContext> | readonly (SelectionRules<TContext> | null | undefined | false)[]',
              description: (
                <>
                  Bounds, lengths, weekdays, per-day availability and custom validation. In an array every set must pass and falsy entries are skipped, so{' '}
                  {c('[stayRules(…), closed && closedDates(closed)]')} works. Keep the object stable (module scope or {c('useMemo')}): a new identity
                  recombines the rules and revalidates. {to('length-rules', 'Length rules')}, {to('day-rules', 'Start/end days')},{' '}
                  {to('api-rules', 'Rules & adapters')}.
                </>
              ),
            },
            {
              name: 'minDate / maxDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Inclusive first/last selectable day; {c('null')} means no limit. Unlike {c('disablePast')}, they also limit navigation: the arrows,
                  keyboard, {c('goToMonth()')} and load-more stop at their months (requests are clamped). Merged with any {c('minDate')}/{c('maxDate')} in{' '}
                  {c('rules')}; the narrower range wins. {to('date-limits', 'Date limits')}.
                </>
              ),
            },
            {
              name: 'disablePast / disableFuture',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Days before / after today cannot be picked (reason {c('past')} / {c('future')}, no tooltip). They only disable days: the user can still
                  browse into those months. Depend on {c('today')}/{c('timeZone')}. {to('date-limits', 'Date limits')}.
                </>
              ),
            },
            {
              name: 'ruleContext',
              type: 'TContext',
              description: (
                <>
                  Any app data your rule callbacks need (chosen times, party size), passed to them as {c('ctx.context')}. A new value revalidates the
                  selection and every day, so memoise objects. {to('recipe-home-rental', 'Home rental recipe')}.
                </>
              ),
            },
            {
              name: 'relaxSchedule',
              type: 'boolean | RelaxScheduleOptions',
              default: 'false',
              description: (
                <>
                  “Custom dates” switch: ignores schedule rules — {c('startWeekdays')}/{c('endWeekdays')}/{c('availableWeekdays')}, availability marked{' '}
                  {c('schedule: true')} ({c('weekdays')}) and {c('minLength')}/{c('maxLength')}/{c('fixedLength')} ({c('length')}) — while real
                  availability, bounds, past/future, data status and validators still apply. {c('true')} or {c('{}')} relaxes both groups;{' '}
                  {c('{ weekdays: false }')} relaxes only lengths. {to('recipe-boat-rental', 'Boat rental recipe')}, {to('api-rules', 'relaxRules')}.
                </>
              ),
            },
            {
              name: 'today',
              type: 'CalendarDate',
              default: <>computed on the client</>,
              description: (
                <>
                  Fixes “today” for {c('disablePast')}/{c('disableFuture')}, the today marker, {c('day.past')}/{c('day.future')} and the default month. Pass
                  it for SSR and tests: without it the server knows no today and, unless {c('value')} or {c('defaultVisibleMonth')} names a month, renders a
                  loading placeholder that the client completes. When given, {c('timeZone')} is ignored and today never refreshes.{' '}
                  {to('react-nextjs', 'React & Next.js')}.
                </>
              ),
            },
            {
              name: 'timeZone',
              type: 'string (IANA)',
              default: <>the browser’s zone</>,
              description: (
                <>
                  Zone used to compute today when {c('today')} is not given, e.g. {c("'Europe/Istanbul'")} for a venue&apos;s local date. The computed
                  today refreshes after midnight (checked at least hourly) and when the tab becomes visible again. {to('date-limits', 'Date limits → Today')}.
                </>
              ),
            },
            {
              name: 'highlightToday',
              type: 'boolean',
              default: 'true',
              description: (
                <>
                  Draws the thin today circle and the default “Today” tooltip. {c('false')} hides both; {c('day.today')}, {c('data-today')} and the
                  “today” word in the day&apos;s accessible label stay. {to('date-limits', 'Date limits → Today')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Data and loading">
        <p>
          The calendar never fetches. You load data for the months it renders (start from <code>onRenderedMonthsChange</code>) and describe it with
          these props. See {to('loading', 'Loading & errors')} and {to('day-content', 'Day content')}.
        </p>
        <PropsTable
          caption="Data props"
          rows={[
            {
              name: 'getDayData',
              type: '(date: CalendarDate) => TDayData | undefined',
              description: (
                <>
                  Per-day display data (prices, badges), separate from selectability. A {c('DefaultDayData')} shape ({c('label')}, {c('badge')},{' '}
                  {c('icon')}, {c('markers')}, {c('description')}) is drawn by the default day content; any other shape reaches your render props as{' '}
                  {c('data')}. Called for every rendered day on every render: keep it cheap and return the same object for unchanged days so they skip
                  re-rendering. {to('day-content', 'Day content')}.
                </>
              ),
            },
            {
              name: 'getDataStatus',
              type: '(month: CalendarMonth) => DataStatus',
              default: <>every month <code>'loaded'</code></>,
              description: (
                <>
                  Status of each month&apos;s data. {c("'loading'")} and {c("'unknown'")} months draw day skeletons without tooltips;{' '}
                  {c("'error'")} months show the error UI. It also feeds the rules: days of a month that is not {c("'loaded'")} cannot be picked
                  (reasons {c('data-loading')}, {c('data-unknown')}, {c('data-error')}) unless the rules set {c("unknownDataPolicy: 'allow'")}. Combined
                  with a {c('getDataStatus')} in {c('rules')} (the worse status wins). {to('loading', 'Loading & errors')}.
                </>
              ),
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Calendar-wide flag. Before the calendar has ever rendered without it, it is the <em>initial load</em>: every day is a skeleton, selection
                  is validated as if all data were loading, and {c("renderLoading({ scope: 'initial' })")} is used. Set again later, it is a{' '}
                  <em>background refresh</em>: days, selection and focus stay, only {c('aria-busy')} and {c('LoadingSnapshot.refreshing')} change. Per-month
                  loading belongs in {c('getDataStatus')}. {to('loading', 'Loading & errors → Initial load')}.
                </>
              ),
            },
            {
              name: 'onRetry',
              type: '(months: readonly CalendarMonth[]) => void',
              description: (
                <>
                  Called with {c('[month]')} by the default error UI&apos;s Retry button and by {c('retry()')} in {c('renderError')}. The default Retry
                  button is only shown when this prop is set. {to('loading', 'Loading & errors')}.
                </>
              ),
            },
            {
              name: 'modifiers',
              type: 'Record<string, (day: DayState) => boolean>',
              description: (
                <>
                  Your own day flags for styling: each function runs for every rendered day; the names that return {c('true')} land in{' '}
                  {c('day.modifiers')} and as {c('data-mod-<name>')} on the day cell and button. They do not affect selection (use {c('rules')} for that). Use
                  lowercase, hyphenated names: HTML lowercases attribute names. {to('styling', 'Styling → State attributes and modifiers')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Layout">
        <p>
          The layout follows the calendar&apos;s own container width (ResizeObserver), not the window. A month needs at least{' '}
          <code>7 × minDaySize.width + 16</code> px; when the requested months do not fit side by side, <code>overflow</code> decides what happens and{' '}
          <code>onLayoutChange</code> reports it. See {to('orientation', 'Orientation & months')} and {to('responsive', 'Responsive layout')}.
        </p>
        <PropsTable
          caption="Layout props"
          rows={[
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: (
                <>
                  Months side by side or stacked in one column, independent of the device. Vertical layouts never use {c('overflow')} (one column always
                  fits, or scrolls when even one month does not). Often combined with {c('navigation="continuous"')} and {c('maxBlockSize')}.{' '}
                  {to('orientation', 'Orientation & months')}.
                </>
              ),
            },
            {
              name: 'numberOfMonths',
              type: 'number',
              default: '1',
              description: (
                <>
                  Months in the window (paged) or rendered initially (continuous). Never changed silently: only {c("overflow='reduce-months'")} shows fewer.
                  Decimals are floored; values below 1 or not finite fall back to 1. Also the default of {c('monthsPerLoad')}.{' '}
                  {to('orientation', 'Orientation & months')}.
                </>
              ),
            },
            {
              name: 'monthPosition',
              type: 'number',
              default: '1',
              description: (
                <>
                  1-based slot of the reference month (the {c('visibleMonth')}, selection month or today&apos;s month) in the window: {c('3')} with three
                  months shows the two months before it. Clamped to 1…effective months; near {c('minDate')}/{c('maxDate')} the window shifts instead of
                  showing unreachable months. {to('month-position', 'Reference month position')}.
                </>
              ),
            },
            {
              name: 'overflow',
              type: "'wrap' | 'scroll' | 'reduce-months'",
              default: "'wrap'",
              description: (
                <>
                  Horizontal only, when the months do not fit: {c('wrap')} moves them to more rows, {c('scroll')} keeps one row with an inner horizontal
                  scrollbar, {c('reduce-months')} shows fewer months (paging still moves by {c('stepMonths')}). If not even one month fits, every strategy
                  falls back to an inner scroll. {to('responsive', 'Responsive layout')}.
                </>
              ),
            },
            {
              name: 'minDaySize',
              type: 'number | { width: number; height: number }',
              default: '40',
              description: (
                <>
                  Smallest interactive day in px (a number sets both sides). The width decides how many months fit; days grow beyond it with the
                  container. Raise it for touch targets; keep custom CSS consistent with it when {c('unstyled')}. {to('day-size', 'Day size & inner scroll')}.
                </>
              ),
            },
            {
              name: 'maxDaySize',
              type: 'number',
              default: '56',
              description: (
                <>
                  Upper limit of the day cell height in px (never below the {c('minDaySize')} height), so wide containers do not produce tall grids. Sets{' '}
                  {c('--cal-day-max')}. No live example; see {to('day-size', 'Day size & inner scroll')}.
                </>
              ),
            },
            {
              name: 'monthGap',
              type: 'number',
              default: '32',
              description: (
                <>
                  Gap between months in px. It is part of the fit calculation, so a larger gap makes months wrap/reduce earlier. Sets{' '}
                  {c('--cal-month-gap')}; change it here, not in CSS. {to('orientation', 'Orientation & months')}.
                </>
              ),
            },
            {
              name: 'fixedWeeks',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Always render 6 week rows, so the height does not change between 4-, 5- and 6-week months (useful in popovers and side-by-side months).{' '}
                  {to('orientation', 'Orientation & months')}.
                </>
              ),
            },
            {
              name: 'maxBlockSize',
              type: 'number | string',
              description: (
                <>
                  Maximum height of the months area (px number or any CSS length, e.g. {c("'60vh'")}). Above it the months scroll inside the calendar
                  while header and footer stay visible; in continuous mode auto-loading and visible-month tracking then observe that inner scroll area.{' '}
                  {to('day-size', 'Day size & inner scroll')}, {to('load-more', 'Progressive months')}.
                </>
              ),
            },
            {
              name: 'resizeThreshold',
              type: 'number',
              default: '0',
              description: (
                <>
                  Minimum change in px (width or height) since the last reported size before {c('onResize')} is called again. Only thins out
                  notifications; the layout still adapts to every change. {to('api-events', 'onResize')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Navigation">
        <p>
          The <strong>reference month</strong> anchors the window: <code>visibleMonth</code>, else <code>defaultVisibleMonth</code>, else the
          selection&apos;s month, else today&apos;s month. <code>navigation</code> decides whether the user pages through windows or scrolls a growing list.
          See {to('load-more', 'Progressive months')} and {to('go-to-month', 'Programmatic navigation')}.
        </p>
        <PropsTable
          caption="Navigation props"
          rows={[
            {
              name: 'visibleMonth',
              type: 'CalendarMonth ("YYYY-MM")',
              description: (
                <>
                  <strong>Controlled</strong> reference month (pair: {c('defaultVisibleMonth')}); pair it with {c('onVisibleMonthChange')}. Arrows,
                  keyboard paging, {c('ref.next()')} and {c('goToMonth()')} then only request a month; store it to move. Use it to keep the month in the URL
                  or to sync calendars. An unparsable value is ignored. In continuous mode a prop change works like {c('goToMonth()')}: scrolls to a
                  rendered month (list kept) or rebuilds the list around an unrendered one, without smooth scrolling, focus moves or a{' '}
                  {c('visibleMonthChange')}; feed it from {c('onVisibleMonthChange')}, not from {c('onVisibleMonthsChange')}.{' '}
                  {to('api-events', 'onVisibleMonthChange (live example)')}.
                </>
              ),
            },
            {
              name: 'defaultVisibleMonth',
              type: 'CalendarMonth ("YYYY-MM")',
              default: <>the selection’s month, else today’s</>,
              description: (
                <>
                  <strong>Uncontrolled</strong> initial reference month, read once on mount. Also makes server HTML complete without {c('today')}.
                  Ignored when {c('visibleMonth')} is given. {to('core-concepts', 'Core concepts → Start month')}, {to('load-more', 'Progressive months')}.
                </>
              ),
            },
            {
              name: 'navigation',
              type: "'paged' | 'continuous'",
              default: "'paged'",
              description: (
                <>
                  {c('paged')}: a window of {c('numberOfMonths')} months with previous/next arrows. {c('continuous')}: a list that grows with load-more
                  (no arrows; {c('renderNavigation')} and {c('stepMonths')} do not apply), suited to vertical and mobile layouts.{' '}
                  {to('load-more', 'Progressive months')}.
                </>
              ),
            },
            {
              name: 'stepMonths',
              type: 'number',
              default: '1',
              description: (
                <>
                  Paged: months moved by the arrows, {c('renderNavigation')}&apos;s {c('previous()')}/{c('next()')} and {c('ref.previous()')}/
                  {c('ref.next()')}; set it to {c('numberOfMonths')} to turn whole pages. PageUp/PageDown always move one month. Invalid values fall back
                  to 1. {to('orientation', 'Orientation & months → Several months')}.
                </>
              ),
            },
            {
              name: 'loadMore',
              type: "'button' | 'auto' | 'manual'",
              default: "'button'",
              description: (
                <>
                  Continuous only: how months are added. {c('button')} shows “Show more dates” buttons; {c('auto')} loads when the end of the list comes
                  within 200 px of the viewport (or of the {c('maxBlockSize')} area); {c('manual')} renders no control, you call{' '}
                  {c("ref.loadMore('next')")}, e.g. from {c('renderFooter')}. {to('load-more', 'Progressive months')}.
                </>
              ),
            },
            {
              name: 'loadDirections',
              type: "'next' | 'previous' | 'both'",
              default: "'next'",
              description: (
                <>
                  Continuous only: which ends of the list get the built-in UI (load-more buttons or {c('renderLoadMore')} controls, and the{' '}
                  {c("loadMore='auto'")} sentinels). Loading stops at the months of {c('minDate')}/{c('maxDate')}. The controller is not limited by
                  this prop: {c('ref.loadMore(direction)')} adds months in either direction (continuous only, still stopping at the limits). {to('load-more', 'Progressive months')}.
                </>
              ),
            },
            {
              name: 'monthsPerLoad',
              type: 'number',
              default: 'numberOfMonths',
              description: (
                <>
                  Continuous only: months added per load (clipped at min/max). Keyboard focus moving at most this many months past the list also extends
                  it. Invalid values fall back to the default. {to('load-more', 'Progressive months')}.
                </>
              ),
            },
            {
              name: 'maxRenderedMonths',
              type: 'number',
              default: '24',
              description: (
                <>
                  Continuous only: DOM bound. Above it, months are dropped from the opposite end of each load (never the month holding keyboard focus);
                  never below {c('numberOfMonths')}. Lower it for long lists on slow devices. No live example; see {to('load-more', 'Progressive months')}.
                </>
              ),
            },
            {
              name: 'loadMoreLabels',
              type: 'Partial<Record<LoadDirection, ReactNode>>',
              default: 'messages.loadNext / loadPrevious',
              description: (
                <>
                  Content of the default load-more buttons per direction; the button, its behaviour and accessibility stay. Also passed as{' '}
                  {c('label')} to {c('renderLoadMore')}. {to('load-more', 'Progressive months → loadMoreLabels')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Localisation">
        <p>
          <code>locale</code> formats dates only. The calendar&apos;s own texts (button labels, reasons, announcements, “Today”) come from{' '}
          <code>messages</code>, which defaults to English for every locale: pass a bundle such as <code>messagesTr</code> together with{' '}
          <code>locale=&quot;tr-TR&quot;</code>. See {to('i18n', 'Locales, week start & RTL')} and {to('api-messages', 'Messages & formatting')}.
        </p>
        <PropsTable
          caption="Localisation props"
          rows={[
            {
              name: 'locale',
              type: 'string (BCP 47)',
              default: "'en-US'",
              description: (
                <>
                  Intl locale for month titles, weekday names, digits, day labels and dates inside messages, and the source of the {c('direction')} and{' '}
                  {c('firstDayOfWeek')} defaults. Fixed default, so server and browser render the same. Does <strong>not</strong> translate the
                  calendar&apos;s texts (see {c('messages')}). {to('i18n', 'Locales, week start & RTL')}.
                </>
              ),
            },
            {
              name: 'messages',
              type: 'CalendarMessagesInput',
              default: 'messagesEn',
              description: (
                <>
                  Partial overrides merged over English: pass a ready bundle ({c('messagesTr')}, {c('messagesDe')}, …) or single keys; nested{' '}
                  {c('reasons')} and {c('dayReasons')} are merged key by key, so you can add texts for your own {c('DayAvailability.reason')} tags. Memoise
                  it. {to('api-messages', 'Messages & formatting')}.
                </>
              ),
            },
            {
              name: 'direction',
              type: "'ltr' | 'rtl'",
              default: <>from locale</>,
              description: (
                <>
                  Layout direction ({c('dir')} on the root); the default is {c('rtl')} for Arabic, Hebrew, Persian, Urdu and other right-to-left
                  languages. Month order stays chronological; horizontal arrow keys follow the visual direction. {to('i18n', 'Locales → Arabic (RTL)')}.
                </>
              ),
            },
            {
              name: 'firstDayOfWeek',
              type: 'Weekday (0–6, 0 = Sunday)',
              default: <>from the locale’s region</>,
              description: (
                <>
                  First column of every week, e.g. {c('1')} for a Monday start in {c('en-US')}. The default comes from a static region table (Sunday for US,
                  Saturday for some regions, else Monday). {to('i18n', 'Locales → Week start')}.
                </>
              ),
            },
            {
              name: 'weekdayFormat',
              type: "'narrow' | 'short' | 'long'",
              default: "'short'",
              description: (
                <>
                  Intl width of the visible weekday headers ({c('M')}, {c('Mon')}, {c('Monday')}); the full name stays their accessible label. Ignored by{' '}
                  {c('formatWeekday')}. {to('i18n', 'Locales → Week start')}.
                </>
              ),
            },
            {
              name: 'monthTitleFormat',
              type: 'Intl.DateTimeFormatOptions',
              default: "{ month: 'long', year: 'numeric' }",
              description: (
                <>
                  Intl options for month titles, e.g. {c("{ month: 'short', year: '2-digit' }")}. Ignored when {c('formatMonthTitle')} is given. No live
                  example; see {to('api-messages', 'Messages & formatting → Locale formatting')}.
                </>
              ),
            },
            {
              name: 'formatMonthTitle',
              type: '(month: CalendarMonth, locale: string) => string',
              description: (
                <>
                  Returns the month title text yourself (also passed as {c('title')} to {c('renderMonthHeader')} and used as the grid&apos;s label). Use
                  {c('renderMonthHeader')} for markup. No live example; see {to('api-messages', 'Messages & formatting')}.
                </>
              ),
            },
            {
              name: 'formatWeekday',
              type: '(weekday: Weekday, locale: string) => ReactNode',
              description: (
                <>
                  Visible content of each weekday header (e.g. a single letter or an icon); the full localised name stays its accessible label. No live
                  example; see {to('i18n', 'Locales, week start & RTL')}.
                </>
              ),
            },
            {
              name: 'formatDayLabel',
              type: '(date: CalendarDate, locale: string) => string',
              description: (
                <>
                  Date part of each day&apos;s accessible label and {c('day.label')} (default: weekday, day, month and year). States such as “today”,
                  “selected” and the rejection reason are still appended. No live example; see {to('accessibility', 'Keyboard & accessibility')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Rendering and tooltips">
        <p>
          Render props replace parts of the default UI; the calendar keeps state, keyboard handling and ARIA. Keep render functions stable (module scope
          or <code>useCallback</code>): days only re-render when their state, data or these functions change. Slot behaviour in detail:{' '}
          {to('styling-reference', 'Styling reference → Slots')}.
        </p>
        <PropsTable
          caption="Day rendering and tooltip props"
          rows={[
            {
              name: 'renderDay',
              type: '(props: DayRenderProps<TDayData>) => ReactNode',
              description: (
                <>
                  Renders the whole interactive day element. Spread {c('getDayProps()')} on it (ref, roving {c('tabIndex')}, ARIA, {c('data-*')},
                  handlers); pass your own handlers through it, and call {c('preventDefault()')} in them to skip the calendar&apos;s handling. Non-button
                  elements get Enter/Space from the calendar. Takes precedence over {c('renderDayContent')}.{' '}
                  {to('styling', 'Styling → renderDay and getDayProps')}.
                </>
              ),
            },
            {
              name: 'renderDayContent',
              type: '(ctx: DayRenderContext<TDayData>) => ReactNode',
              description: (
                <>
                  Replaces only what is inside the default day button (number and {c('DefaultDayData')} drawing); the button, circle, band and ARIA stay.
                  Do not put interactive elements inside. Ignored when {c('renderDay')} is set. {to('styling', 'Styling → renderDayContent')}.
                </>
              ),
            },
            {
              name: 'getDayTooltip',
              type: '(ctx: DayRenderContext<TDayData>) => TooltipContent | null | undefined',
              description: (
                <>
                  Tooltip per day. When given it <strong>replaces</strong> the default tooltips (rejection reasons and “Today”); return{' '}
                  {c('day.reasonText')} to keep reasons. {c('{ content, persistent: true }')} shows it without hover (the first persistent day wins), e.g.
                  “Choose your check-out”. Days drawn as skeletons get no tooltip. {to('tooltip', 'Tooltip')}.
                </>
              ),
            },
            {
              name: 'renderDayTooltip',
              type: '(props: DayTooltipRenderProps) => ReactNode',
              description: (
                <>
                  Renders the content of the open tooltip from {c('day')}, {c('content')}, {c('trigger')} and the {c('placement')} actually used; the
                  positioned box, arrow and {c('aria-describedby')} link stay. {to('styling-reference', 'Styling reference → Slots')}.
                </>
              ),
            },
            {
              name: 'tooltip',
              type: 'TooltipOptions',
              description: (
                <>
                  {c('placement')} (preferred side, default {c("'top'")}; others are tried when it does not fit), {c('boundary')} ({c("'calendar'")}{' '}
                  default, or {c("'viewport'")}), {c('offset')} (default 8 px), {c('className')}, {c('container')} (portal target, default{' '}
                  {c('document.body')}; use the dialog in a modal) and {c('openDate')} (controlled open day, {c('null')} = closed; only days with content
                  open). {to('tooltip', 'Tooltip')}, {to('placement', 'Inline, modal & portal')}.
                </>
              ),
            },
          ]}
        />
        <PropsTable
          caption="Slot props"
          rows={[
            {
              name: 'renderHeader / renderFooter',
              type: '(ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Your content above / below the months (summary, time pickers, Clear/Apply buttons). {c('ctx')} holds the snapshot, {c('messages')},{' '}
                  {c('formatDate')} and {c('ctx.actions')} (the controller), so no ref is needed. {c('null')} renders no wrapper.{' '}
                  {to('slots', 'Slots & render props')}.
                </>
              ),
            },
            {
              name: 'renderMonthHeader',
              type: '(props: MonthHeaderRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Replaces each month&apos;s title row. Render {c('props.navigation')} to keep the default arrows that belong to this header ({c('null')}{' '}
                  with {c('renderNavigation')} or continuous navigation). The month is then labelled by {c('aria-label')}.{' '}
                  {to('slots', 'Slots → Navigation and month headers')}.
                </>
              ),
            },
            {
              name: 'renderNavigation',
              type: '(props: NavigationRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Paged only: one navigation bar above the months that replaces the default arrows. {c('previous()')}/{c('next()')} move by{' '}
                  {c('stepMonths')}; disable your buttons with {c('canPrevious')}/{c('canNext')}. Not rendered in continuous mode.{' '}
                  {to('slots', 'Slots → Navigation and month headers')}.
                </>
              ),
            },
            {
              name: 'renderLoading',
              type: '(props: LoadingRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  A visible loading indicator; by default only skeleton days and screen-reader text are shown. Called per {c('scope')}:{' '}
                  {c("'initial'")} ({c('loading')} on first load), {c("'month'")} (each loading month, skeleton stays) and {c("'load-more'")} (months just
                  added). Not called for a background refresh. {to('loading', 'Loading & errors → A visible loading indicator')}.
                </>
              ),
            },
            {
              name: 'renderError',
              type: '(props: ErrorRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Replaces the default error box in each month whose status is {c("'error'")}; {c('retry()')} calls {c('onRetry([month])')}. No live
                  example; see {to('styling-reference', 'Styling reference → Slots')}.
                </>
              ),
            },
            {
              name: 'renderLoadMore',
              type: '(props: LoadMoreRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Continuous with {c("loadMore='button'")}: a different control in place of each default load-more button, for each direction in{' '}
                  {c('loadDirections')}. Also called at {c('minDate')}/{c('maxDate')} with {c('canLoad: false')} (where the default button is removed
                  and {c('loadMore()')} does nothing) so it can show a disabled control or a message. {to('load-more', 'Progressive months → renderLoadMore')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Styling and identity">
        <PropsTable
          caption="Styling and identity props"
          rows={[
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: (
                <>
                  On the root element, after the default {c('cal-root')} class. Set theme variables ({c('--cal-accent')}, …) here or in CSS; the size
                  variables {c('--cal-day-min-w/h')}, {c('--cal-day-max')} and {c('--cal-month-gap')} are always overwritten from the props.{' '}
                  {to('styling', 'Styling → CSS variables')}.
                </>
              ),
            },
            {
              name: 'classNames',
              type: 'CalendarClassNames',
              description: (
                <>
                  Extra classes per part ({c('root')}, {c('month')}, {c('dayButton')}, {c('tooltip')}, …), added next to the defaults (or alone with{' '}
                  {c('unstyled')}). {c('dayCell')}, {c('dayButton')} and {c('dayContent')} also accept {c('(day) => string | undefined')}. Keep the object
                  stable: a new one re-renders every day. {to('styling', 'Styling → classNames')}.
                </>
              ),
            },
            {
              name: 'unstyled',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Drops every default {c('cal-*')} class, so the stylesheet no longer applies; style through {c('classNames')} and the {c('data-*')}{' '}
                  attributes. Layout still assumes {c('minDaySize')} and 8 px month padding. {to('styling', 'Styling → unstyled')}.
                </>
              ),
            },
            {
              name: 'id',
              type: 'string',
              default: <>generated (<code>useId</code>)</>,
              description: (
                <>
                  Root element id and the {c('instanceId')} in events, the controller and {c('ctx')}. Inner ids derive from it:{' '}
                  {c('<id>-tooltip')} (the day&apos;s {c('aria-describedby')}), {c('<id>-months')}, {c('<id>-day-<date>')}. Set it for stable ids in tests or
                  to tell calendars apart in shared handlers; it must be unique on the page. {to('api-controller', 'Controller → instanceId')}.
                </>
              ),
            },
            {
              name: 'aria-label',
              type: 'string',
              default: <><code>messages.calendar</code> (“Calendar”)</>,
              description: (
                <>
                  Accessible name of the calendar group. Give each calendar on a page a distinct one (“Check-in”, “Return date”).{' '}
                  {to('accessibility', 'Keyboard & accessibility')}.
                </>
              ),
            },
            {
              name: 'ref',
              type: 'Ref<CalendarController>',
              description: (
                <>
                  Imperative controller: {c('goToMonth')}, {c('next')}/{c('previous')}, {c('loadMore')}, {c('clear')}, {c('reset')}, {c('select')},{' '}
                  {c('setActiveEndpoint')}, {c('focusDate')}, {c('getSnapshot')}. Inside slots the same object is {c('ctx.actions')}.{' '}
                  {to('api-controller', 'Controller (ref)')}, {to('go-to-month', 'Programmatic navigation')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Event callbacks">
        <p>
          All optional; each receives a typed event with <code>instanceId</code>. Payloads, sources and ordering are documented on{' '}
          {to('api-events', 'Callbacks & events')}. <code>onChange</code> is listed under Selection.
        </p>
        <PropsTable
          caption="Event callbacks"
          rows={[
            ev('onReady', '(e: ReadyEvent) => void', 'Once per mount, after the first measurement, with the layout.'),
            ev('onDateClick', '(e: DateClickEvent) => void', 'Every day activation (pointer or keyboard), accepted or rejected, with the day state and issue.'),
            ev('onSelectionComplete', '(e: SelectionCompleteEvent) => void', 'A valid selection became complete: a single pick (also re-picking the selected date), both range ends, multiple reaching maxSelections, or a valid select() of a new value.'),
            ev('onSelectionClear', '(e: SelectionClearEvent) => void', 'The selection became empty (clear(), reset() to empty, toggling the last date off, …).'),
            ev('onInvalidSelection', '(e: InvalidSelectionEvent) => void', 'A click or select() was rejected (every time, never deduplicated); carries the issue and its localised message. e.date is CalendarDate | null: null when a rejected select() has no day.'),
            ev('onValidationChange', '(e: ValidationChangeEvent) => void', 'The validity of the current selection changed; also on mount and when rules, data or today change.'),
            ev('onActiveEndpointChange', '(endpoint: RangeEndpoint, e: ActiveEndpointChangeEvent) => void', 'Range: the endpoint for the next click changed (a request when activeEndpoint is controlled).'),
            ev('onVisibleMonthChange', '(month: CalendarMonth, e: VisibleMonthChangeEvent) => void', 'The reference month was asked to change (arrows, keyboard, goToMonth()); never for prop changes or when the month stays the same (e.g. next() at maxDate).'),
            ev('onVisibleMonthsChange', '(e: VisibleMonthsChangeEvent) => void', 'The months on screen changed, including by scrolling in continuous mode.'),
            ev('onRenderedMonthsChange', '(e: RenderedMonthsChangeEvent) => void', 'Months were added to or removed from the DOM, also on mount: start data requests here.'),
            ev('onLoadMore', '(e: LoadMoreEvent) => void', 'Continuous: months were added by a button, auto-loading or ref.loadMore().'),
            ev('onLoadingChange', '(e: LoadingChangeEvent) => void', 'The LoadingSnapshot changed (initial, refreshing, loading or error months).'),
            ev('onResize', '(e: ResizeEvent) => void', 'The root element was first measured or resized by more than resizeThreshold.'),
            ev('onLayoutChange', '(e: LayoutChangeEvent) => void', 'Columns, effective months, active overflow or the minimum-size state changed.'),
            ev('onDayFocusChange', '(e: DayFocusChangeEvent) => void', 'The focused day changed (keyboard, click or focusDate()).'),
            ev('onTooltipOpenChange', '(e: TooltipOpenChangeEvent) => void', 'A day tooltip opened, closed or moved to another day, with its trigger.'),
            ev('onOutsideClick', '(e: OutsideClickEvent) => void', 'A pointerdown outside the calendar and its portals (tooltip, slot popovers): close a popover here.'),
            ev('onScroll', '(e: ScrollEvent) => void', 'The months area scrolled; at most once per animation frame.'),
            ev('onEvent', '(e: CalendarEvent) => void', 'Every event, including change, after its specific callback.'),
          ]}
        />
      </Section>
    </Page>
  );
}

const typeLinks: readonly (readonly [string, ReactNode, string, string])[] = [
  ['CalendarDate, CalendarMonth, Weekday, DateParts', 'Branded “YYYY-MM-DD” / “YYYY-MM” strings, 0 = Sunday, and { year, month, day }.', 'api-dates', 'Date helpers'],
  ['SelectionRules, DayAvailability, RuleContext', 'Rule set, per-day result and the ctx of rule callbacks.', 'api-rules', 'Rules & adapters'],
  ['StayRulesOptions, StayDayStatus, StayReason', 'Options, per-night statuses and reason tags of stayRules().', 'api-rules', 'Rules & adapters'],
  ['DayRangeRulesOptions, DayRangeStatus', 'Options and per-day statuses of dayRangeRules().', 'api-rules', 'Rules & adapters'],
  ['RelaxScheduleOptions', '{ weekdays?: boolean; length?: boolean }, both default true (see relaxSchedule).', 'api-rules', 'Rules & adapters'],
  ['SelectionEngine, SelectionEngineInput, ActivationPlan', 'The headless engine behind the calendar and what plan(date) returns.', 'api-rules', 'Rules & adapters'],
  ['CalendarMessages, CalendarMessagesInput, ReasonMessage, MessageFormatHelpers', 'Text bundle, partial overrides and reason functions.', 'api-messages', 'Messages & formatting'],
  ['CalendarController, GoToMonthOptions, GoToMonthResult, CalendarSnapshot', 'The ref API and its snapshot.', 'api-controller', 'Controller (ref)'],
  ['CalendarEvent, CalendarEventType, EventSource, ReadyEvent … ScrollEvent', 'Every event payload, the union and the source values.', 'api-events', 'Callbacks & events'],
  ['CalendarLayout, LoadingSnapshot', 'Payloads of onLayoutChange / onReady and onLoadingChange.', 'api-events', 'Callbacks & events'],
  ['CalendarPart, ClassNameValue', 'classNames keys and their value type.', 'styling-reference', 'Styling reference'],
  ['MonthHeaderRenderProps, NavigationRenderProps, LoadingRenderProps, ErrorRenderProps, LoadMoreRenderProps, DayTooltipRenderProps', 'Props of the slots.', 'styling-reference', 'Styling reference'],
  ['DefaultDayData', 'Shape drawn by the default day content.', 'day-content', 'Day content'],
];

export function TypesReference() {
  return (
    <Page
      title="Types"
      lead={
        <>
          Every exported type of the public API. All are exported from <code>calendar-kit</code>; the React types also from <code>calendar-kit/client</code>, the
          React-free ones also from <code>calendar-kit/core</code>. Types fully documented elsewhere are listed first with a link; the rest are
          shown here.
        </>
      }
    >
      <Section title="Documented on other pages">
        <DataTable
          caption="Types documented on other pages"
          head={['Types', 'What they are', 'Page']}
          rows={typeLinks.map(([names, what, slug, title]) => [<code key="n">{names}</code>, what, to(slug, title)])}
        />
      </Section>

      <Section title="Props">
        <pre className="docs-pre docs-type-block">{`type CalendarProps<TDayData = unknown, TContext = unknown> =
  CalendarBaseProps<TDayData, TContext> & SelectionProps

// Everything except the selection props, incl. CalendarEventHandlers
interface CalendarBaseProps<TDayData, TContext> extends CalendarEventHandlers { … }

type SelectionProps =
  | SingleSelectionProps     // { mode: 'single';   value?, defaultValue?: CalendarDate | null; onChange? }
  | RangeSelectionProps      // { mode: 'range';    value?, defaultValue?: DateRange; onChange?;
                             //   activeEndpoint?, defaultActiveEndpoint?: RangeEndpoint }
  | MultipleSelectionProps   // { mode: 'multiple'; value?, defaultValue?: readonly CalendarDate[]; onChange? }
  | ReadonlySelectionProps   // { mode: 'readonly' }

interface CalendarEventHandlers {
  onReady?, onDateClick?, onSelectionComplete?, onSelectionClear?, onInvalidSelection?,
  onValidationChange?, onActiveEndpointChange?, onVisibleMonthChange?, onVisibleMonthsChange?,
  onRenderedMonthsChange?, onLoadMore?, onLoadingChange?, onResize?, onLayoutChange?,
  onDayFocusChange?, onTooltipOpenChange?, onOutsideClick?, onScroll?, onEvent?
}`}</pre>
        <p>
          <code>TDayData</code> is what <code>getDayData</code> returns (it types <code>data</code> in render props); <code>TContext</code> is the type
          of <code>ruleContext</code> (it types <code>ctx.context</code> in rules). Both are inferred from the props. Use <code>CalendarProps</code> to
          wrap the calendar in your own component, a <code>*SelectionProps</code> variant to accept only one mode, and{' '}
          <code>CalendarEventHandlers</code> to forward callbacks. Every prop: {to('api-props', 'Calendar props')}.
        </p>
      </Section>

      <Section title="Selection values">
        <pre className="docs-pre docs-type-block">{`type SelectionMode = 'single' | 'range' | 'multiple' | 'readonly'

interface DateRange { start: CalendarDate | null; end: CalendarDate | null }
type RangeEndpoint = 'start' | 'end'          // which end the next activation sets
type RangeSemantics = 'inclusive' | 'exclusive'
  // inclusive [start, end]: 13–20 Nov = 8 days · exclusive [start, end): 7 nights

type Selection =
  | { mode: 'single'; value: CalendarDate | null }
  | { mode: 'range'; value: DateRange }
  | { mode: 'multiple'; value: readonly CalendarDate[] }
  | { mode: 'readonly'; value: null }

type SelectionPhase = 'empty' | 'start-selected' | 'complete'
  // complete: a single date, both range ends, or at least one multiple date

interface SelectionState { selection: Selection; activeEndpoint: RangeEndpoint }

type DataStatus = 'unknown' | 'loading' | 'loaded' | 'error'`}</pre>
        <p>
          <code>Selection</code> is the mode-tagged value found in snapshots, <code>SlotContext</code>, validators and{' '}
          <code>ValidationChangeEvent</code>. <code>SelectionState</code> adds the active endpoint; it is the engine&apos;s input state and{' '}
          <code>ActivationPlan.next</code>. <code>DataStatus</code> is what <code>getDataStatus</code> returns per month (see{' '}
          {to('loading', 'Loading & errors')}); <code>RangeSemantics</code> is explained in {to('core-concepts', 'Core concepts')}.
        </p>
      </Section>

      <Section title="Validation">
        <pre className="docs-pre docs-type-block">{`interface ValidationResult { valid: boolean; issue: ValidationIssue | null }

interface ValidationIssue {
  code: ReasonCode
  date?: CalendarDate      // the day that caused it
  params?: IssueParams     // values for message templates, e.g. { min: 2, actual: 1, unit: 'nights' }
  dayReason?: string       // DayAvailability.reason of the offending day
  message?: string         // ready-made text; wins over every template
}

type IssueParams = Record<string, string | number | boolean | null | undefined>

type ReasonCode =
  | 'invalid-date' | 'before-min' | 'after-max' | 'past' | 'future'
  | 'closed' | 'start-not-allowed' | 'end-not-allowed' | 'blocked-in-range'
  | 'weekday-start' | 'weekday-end' | 'min-length' | 'max-length' | 'fixed-length'
  | 'same-day' | 'end-before-start' | 'max-selections'
  | 'data-unknown' | 'data-loading' | 'data-error' | 'custom'

type ActivationKind =      // what activating a day would do now (day.action)
  | 'select'      // single (also the date that is already selected)
  | 'start'       // range: new start
  | 'complete'    // range: end chosen, or a fixed-length range
  | 'toggle-on' | 'toggle-off'   // multiple
  | 'clear'       // range: click on the lone start without same-day support
  | 'none'        // read-only mode
  | 'rejected'`}</pre>
        <p>
          Issues reach you as <code>day.reason</code>, in <code>onInvalidSelection</code>, <code>onValidationChange</code> and{' '}
          <code>ref.select()</code>. Each <code>ReasonCode</code> has a text in <code>messages.reasons</code> ({to('api-messages', 'Messages')}); the
          rules that produce them are on {to('api-rules', 'Rules & adapters')}.
        </p>
      </Section>

      <Section title="Days">
        <pre className="docs-pre docs-type-block">{`interface DayState {
  date: CalendarDate; month: CalendarMonth; dayOfMonth: number
  dayText: string          // number in the locale's digits
  weekday: Weekday
  column: number           // 0–6 inside the week row (logical, RTL-independent)
  label: string            // full accessible date (formatDayLabel)
  today: boolean; past: boolean; future: boolean
  disabled: boolean        // activation rejected now (reason explains); still focusable
  unavailable: boolean     // not selectable in any phase (closed, out of bounds, no data)
  readOnly: boolean
  selected: boolean; selectedSingle: boolean; selectedStart: boolean; selectedEnd: boolean
  inRange: boolean         // strictly between start and end
  included: boolean        // counts toward the selection per rangeSemantics
  inPreviewRange: boolean; previewStart: boolean; previewEnd: boolean   // hover/focus preview
  focused: boolean; hovered: boolean
  action: ActivationKind   // what a click would do
  canStart: boolean; canEnd: boolean; canPassThrough: boolean
  outOfSchedule: boolean   // restriction comes from the schedule (see relaxSchedule)
  dataStatus: DataStatus; loading: boolean
  reason: ValidationIssue | null; reasonText: string | null   // localised reason
  modifiers: Readonly<Record<string, boolean>>                 // your modifiers that are true
  weekStart: boolean; weekEnd: boolean; monthStart: boolean; monthEnd: boolean
}

interface DayRenderContext<TDayData> { day: DayState; data: TDayData | undefined }

interface DayRenderProps<TDayData> extends DayRenderContext<TDayData> {
  getDayProps: (props?: DayPropsInput) => DayProps
  defaultContent: ReactNode   // day number + default DefaultDayData drawing
}

// What you may pass to getDayProps: your attributes and handlers
type DayPropsInput = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref?: Ref<HTMLElement>
  // omit for a <button> (type="button" is written); null for another element:
  // no type attribute, role="button" unless you pass a role, Enter/Space select
  type?: 'button' | null
  [dataAttr: \`data-\${string}\`]: string | number | boolean | undefined
}

// What it returns: merged attributes to spread on your element
type DayProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref: (el: HTMLElement | null) => void
  type?: 'button'
  tabIndex: number
  [dataAttr: \`data-\${string}\`]: string | number | boolean | undefined
}`}</pre>
        <p>
          <code>DayState</code> is passed to render props, <code>modifiers</code>, tooltips and <code>classNames</code> functions; the same state is on
          the day as <code>data-*</code> attributes ({to('styling-reference', 'Styling reference')}). <code>DayRenderContext</code> is the argument of{' '}
          <code>renderDayContent</code> and <code>getDayTooltip</code>; <code>DayRenderProps</code> of <code>renderDay</code>. In{' '}
          <code>getDayProps</code> your handlers run first; <code>event.preventDefault()</code> in <code>onClick</code>, <code>onKeyDown</code>,{' '}
          <code>onPointerEnter</code> or <code>onFocus</code> skips the calendar&apos;s handling of that event; your <code>ref</code>,{' '}
          <code>className</code> and <code>aria-describedby</code> are merged. Pass <code>type: null</code> when spreading onto an element that is not a{' '}
          <code>&lt;button&gt;</code> ({to('styling', 'Styling → renderDay and getDayProps')}).
        </p>
      </Section>

      <Section title="Tooltips">
        <pre className="docs-pre docs-type-block">{`type TooltipContent = ReactNode | { content: ReactNode; persistent?: boolean }
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
type TooltipBoundary = 'calendar' | 'viewport'
type TooltipTrigger = 'hover' | 'focus' | 'touch' | 'persistent' | 'controlled'

interface TooltipOptions {
  placement?: TooltipPlacement      // preferred side, default 'top'
  boundary?: TooltipBoundary        // default 'calendar'
  offset?: number                   // px, default 8
  className?: string
  container?: HTMLElement | null    // portal target, default document.body
  openDate?: CalendarDate | null    // controlled open day; null = closed, undefined = uncontrolled
}

interface DayTooltipRenderProps {
  day: DayState; content: ReactNode; trigger: TooltipTrigger; placement: TooltipPlacement
}`}</pre>
        <p>
          <code>TooltipContent</code> is what <code>getDayTooltip</code> returns; the object form with <code>persistent: true</code> shows the tooltip
          without hover or focus. <code>calendar</code> keeps the tooltip inside the month area of the calendar; <code>viewport</code> lets it extend
          beyond the calendar, inside the window. <code>TooltipTrigger</code> says why it is open (in <code>renderDayTooltip</code> and{' '}
          <code>onTooltipOpenChange</code>). See {to('tooltip', 'Tooltip')}.
        </p>
      </Section>

      <Section title="Layout and navigation">
        <pre className="docs-pre docs-type-block">{`type Orientation = 'horizontal' | 'vertical'
type OverflowStrategy = 'scroll' | 'wrap' | 'reduce-months'
type NavigationMode = 'paged' | 'continuous'
type LoadMoreMode = 'button' | 'auto' | 'manual'
type LoadDirection = 'next' | 'previous'
type LoadingScope = 'initial' | 'month' | 'load-more'`}</pre>
        <p>
          The value types of <code>orientation</code>, <code>overflow</code>, <code>navigation</code> and <code>loadMore</code> (see{' '}
          {to('api-props', 'Calendar props')}). <code>LoadDirection</code> is used by <code>ref.loadMore()</code>, <code>loadMoreLabels</code> and{' '}
          <code>onLoadMore</code>; <code>loadDirections</code> also accepts <code>&apos;both&apos;</code>. <code>LoadingScope</code> is{' '}
          <code>renderLoading</code>&apos;s <code>scope</code>.
        </p>
      </Section>

      <Section title="Slots and styling">
        <pre className="docs-pre docs-type-block">{`interface SlotContext extends CalendarSnapshot {
  instanceId: string
  actions: CalendarController    // the same object as the ref
  messages: CalendarMessages     // merged messages
  locale: string
  formatDate(date: CalendarDate, options?: Intl.DateTimeFormatOptions): string
}

type CalendarClassNames =
  Partial<Record<Exclude<CalendarPart, 'dayCell' | 'dayButton' | 'dayContent'>, string>> & {
    dayCell?: ClassNameValue
    dayButton?: ClassNameValue
    dayContent?: ClassNameValue
  }
type ClassNameValue = string | ((day: DayState) => string | undefined)`}</pre>
        <p>
          <code>SlotContext</code> is the second argument of every slot ({c('renderHeader')}, {c('renderFooter')}, {c('renderMonthHeader')},{' '}
          {c('renderNavigation')}, {c('renderLoading')}, {c('renderError')}, {c('renderLoadMore')}). <code>formatDate</code> defaults to a long date
          (“13 November 2026”) in the calendar&apos;s locale. <code>CalendarClassNames</code> is the type of <code>classNames</code>; its keys are the{' '}
          <code>CalendarPart</code> names listed on {to('styling-reference', 'Styling reference')}.
        </p>
      </Section>
    </Page>
  );
}
