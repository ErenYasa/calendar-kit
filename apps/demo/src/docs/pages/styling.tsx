import getDayProps from '../../snippets/styling/getDayProps.tsx?code';
import setup from '../../snippets/styling/setup.tsx?code';
import statusSlots from '../../snippets/styling/statusSlots.tsx?code';
import unstyled from '../../snippets/styling/unstyled.tsx?code';
import { Example, Snippet } from '../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../ui';

export function Styling() {
  return (
    <Page
      title="Styling & Customization"
      lead="Start with the default theme and go only as far as you need: variables, then classes and state attributes, then custom content, then your own markup."
    >
      <PropsTable
        caption="Which approach?"
        rows={[
          { name: <>CSS variables</>, type: <>colours, radius, sizes</>, description: 'Theming (brand colours, dark mode). Cheapest; no selectors into the markup.' },
          { name: 'classNames', type: <>parts</>, description: 'Adding your design system classes to specific parts.' },
          { name: <><code>data-*</code> attributes</>, type: <>state</>, description: 'Styling states (selected, in range, disabled, your modifiers) from your own CSS.' },
          { name: 'renderDayContent', type: <>inside the day</>, description: 'Different content in the default, accessible day button.' },
          { name: 'renderDay + getDayProps', type: <>whole day</>, description: 'Your own day element, keeping keyboard, focus, ARIA and selection.' },
          { name: 'unstyled', type: <>everything</>, description: 'No default classes at all; you style every part.' },
        ]}
      />
      <Section title="Default theme">
        <p>
          Import <code>calendar-kit/styles.css</code> once, before your own CSS. Everything visual reads CSS variables declared on the calendar root, so
          most theming needs no selectors at all. No rule uses <code>!important</code>. Today, hover and the loading skeleton are wrapped in{' '}
          <code>:where()</code> and add no specificity; selected, disabled, unavailable and range-endpoint styles are plain selectors of up to three classes
          — to change those, use the variables (<code>--cal-accent</code>, <code>--cal-range</code>, …) or a selector of at least the same specificity. See the{' '}
          <a href="#/styling-reference">Styling reference</a> for every variable, class and attribute.
        </p>
      </Section>
      <Section title="CSS variables">
        <p>
          Set variables on the root through <code>className</code> or <code>style</code>. Available: <code>--cal-color</code>, <code>--cal-muted</code>,{' '}
          <code>--cal-bg</code>, <code>--cal-accent</code>, <code>--cal-accent-contrast</code>, <code>--cal-range</code>, <code>--cal-preview</code>,{' '}
          <code>--cal-hover</code>, <code>--cal-focus</code>, <code>--cal-today</code>, <code>--cal-ring</code>, <code>--cal-danger</code>,{' '}
          <code>--cal-radius</code>, <code>--cal-circle</code>, <code>--cal-font</code> and the tooltip variables <code>--cal-tooltip-bg</code>,{' '}
          <code>--cal-tooltip-color</code>, <code>--cal-tooltip-shadow</code>, <code>--cal-tooltip-max-width</code> (copied to the portalled tooltip).
        </p>
        <Example src="styling/CssVariables" title="Dark theme with variables" />
      </Section>
      <Section title="classNames">
        <p>
          Parts: <code>root, header, footer, viewport, months, month, monthHeader, monthTitle, navigation, navButton, weekdays, weekday, grid, week, dayCell,
          dayButton, dayContent, rangeBackground, tooltip, loadMore, loading, error, liveRegion, readOnlyNotice</code>. <code>dayCell</code>,{' '}
          <code>dayButton</code> and <code>dayContent</code> accept a function of the day&apos;s state.
        </p>
        <Example src="styling/ClassNames" title="classNames" />
      </Section>
      <Section title="State attributes and modifiers">
        <p>
          Day cells and buttons carry <code>data-today</code>, <code>data-past</code>, <code>data-disabled</code>, <code>data-unavailable</code>,{' '}
          <code>data-selected</code>, <code>data-range-start</code>, <code>data-range-end</code>, <code>data-in-range</code>, <code>data-preview</code>,{' '}
          <code>data-focused</code>, <code>data-loading</code>, <code>data-reason</code>, <code>data-mod-*</code> and more; cells also have{' '}
          <code>data-band=&quot;start | mid | end&quot;</code>. Pair them with your own classes so your CSS does not depend on internal class names.
        </p>
        <Example src="styling/DataAttributes" title="Modifiers and data attributes" />
      </Section>
      <Section title="renderDayContent">
        <Example src="styling/DayContentRender" title="Custom day content" />
      </Section>
      <Section title="renderDay and getDayProps">
        <p>
          <code>getDayProps</code> merges the ref (tooltip anchor, roving focus), <code>tabIndex</code>, ARIA attributes, <code>data-*</code> state and event
          handlers with yours. On a <code>&lt;button&gt;</code> call it as <code>getDayProps(yourProps)</code>: it writes <code>type=&quot;button&quot;</code>.
        </p>
        <Example src="styling/RenderDay" title="Custom day element" />
        <p>
          For an element that is not a button (a <code>&lt;div&gt;</code>, a <code>&lt;span&gt;</code>), pass <code>type: null</code>:{' '}
          <code>getDayProps(&#123; type: null &#125;)</code> writes no <code>type</code> attribute and adds <code>role=&quot;button&quot;</code> unless you
          pass your own <code>role</code>. Focus works exactly as with a button: one day is in the tab order (roving <code>tabIndex</code>) and the arrow,
          Page and Home/End keys move between days. Enter and Space select the focused day; on a non-button element the calendar handles those keys
          itself, while a native button turns them into a click.
        </p>
        <Example src="styling/RenderDayDiv" title="A div as the day element" />
      </Section>
      <Section title="unstyled">
        <p>
          No default class names are added, so none of the default theme applies — including the week-row grids and day cell sizes. Only the months grid
          (columns), the viewport&apos;s overflow and the sizing variables stay inline; you lay out weeks and days yourself (the example uses a 7-column grid).
          Keep your day size consistent with <code>minDaySize</code>: the calendar uses it to decide how many months fit.
        </p>
        <Example src="styling/Unstyled" title="Unstyled calendar" />
      </Section>
      <Note>
        <p>
          Never put buttons or links inside <code>renderDayContent</code>: the day is already a button. For an action inside a day, render the day yourself (
          <code>renderDay</code>) and move the action out of the button, for example into a tooltip or a slot.
        </p>
      </Note>
    </Page>
  );
}

const c = (s: string) => <code>{s}</code>;
const yes = 'present';

export function StylingReference() {
  return (
    <Page
      title="Styling reference"
      lead="Everything the default theme and the markup expose for styling: the classNames parts and the element each lands on, the CSS variables, the data-* state attributes, modifiers, slots, and how the cascade is meant to be used."
    >
      <Section title="classNames">
        <p>
          <code>classNames</code> adds your class to a part. In the default (styled) mode it is added next to the default <code>cal-*</code> class; with{' '}
          <code>unstyled</code> it is the only class. The root also receives the <code>className</code> prop, after <code>classNames.root</code>. Parts that
          are not rendered (a slot replaced them, or the feature is off) get nothing.
        </p>
        <DataTable
          caption="classNames keys"
          head={['Key', 'Default class', 'Element', 'Rendered when']}
          rows={[
            [c('root'), c('cal-root'), <>Outer {c('div[role=group]')}. Carries the root data-* attributes, the theme variables and the inline sizing variables.</>, 'Always.'],
            [c('readOnlyNotice'), c('cal-readonly-notice'), <>{c('<p>')} with an eye icon, first child of the root.</>, <>{c('mode="readonly"')} and {c('messages.readOnlyNotice')} is not empty.</>],
            [c('header'), c('cal-header'), <>{c('div')} wrapping the {c('renderHeader')} result.</>, <>{c('renderHeader')} returns something other than {c('null')}, {c('undefined')} or {c('false')}.</>],
            [c('navigation'), c('cal-navigation'), <>{c('div')} wrapping the {c('renderNavigation')} result, above the months.</>, <>{c('renderNavigation')} is set and {c('navigation="paged"')}.</>],
            [c('weekdays'), c('cal-weekdays'), <>Row of weekday names: a {c('row')} inside each month grid, or, in continuous navigation with one column, one shared row above the viewport (sticky in the default theme).</>, 'Always.'],
            [c('weekday'), c('cal-weekday'), <>{c('span')} per weekday name ({c('columnheader')} inside a grid).</>, 'Always.'],
            [c('viewport'), c('cal-viewport'), 'The scroll container around all months (and the load-more areas).', 'Always.'],
            [c('months'), c('cal-months'), 'The grid of month sections.', 'Always.'],
            [c('month'), c('cal-month'), <>{c('<section>')} per month. Carries {c('data-month')}, {c('data-status')}, {c('data-skeleton')}.</>, 'Per rendered month.'],
            [c('monthHeader'), c('cal-month-header'), 'Row with the month title and the default arrows.', <>No {c('renderMonthHeader')} (that slot replaces the whole row).</>],
            [c('monthTitle'), c('cal-month-title'), <>{c('<h2>')} with the month name.</>, <>No {c('renderMonthHeader')}.</>],
            [c('navButton'), c('cal-nav-button'), <>Default previous / next {c('<button>')}, with {c('data-direction')}. Previous sits in the first month header, next in the last header of the first row (horizontal) or the first header (vertical).</>, <>{c('navigation="paged"')} and no {c('renderNavigation')}. Also inside {c('MonthHeaderRenderProps.navigation')} if your month header renders it.</>],
            [c('grid'), c('cal-grid'), <>{c('div[role=grid]')} per month (weekday row + weeks).</>, 'Per month.'],
            [c('week'), c('cal-week'), <>{c('div[role=row]')} per week.</>, 'Per week.'],
            [c('dayCell'), c('cal-day'), <>{c('div[role=gridcell]')} per day. Carries the day data-* attributes plus {c('data-band')} and {c('data-band-preview')}. Accepts a function.</>, <>Per day. Empty leading/trailing cells get only {c('cal-day-empty')}, no key.</>],
            [c('rangeBackground'), c('cal-range-bg'), <>{c('span')} inside the cell drawing the range or preview band.</>, <>Only on cells that are part of the drawn band ({c('data-band')} is set).</>],
            [c('dayButton'), c('cal-day-button'), <>The day {c('<button>')}, or your element from {c('renderDay')} through {c('getDayProps')}. Carries the day data-* attributes. Accepts a function.</>, 'Per day.'],
            [c('dayContent'), c('cal-day-content'), <>{c('span')} inside the default button, around the number or {c('renderDayContent')}. Accepts a function.</>, <>No {c('renderDay')}.</>],
            [c('tooltip'), c('cal-tooltip'), <>The portalled {c('div[role=tooltip]')} (in {c('document.body')} or {c('tooltip.container')}). {c('tooltip.className')} is added after it. Carries {c('data-placement')}.</>, 'While a day tooltip is open.'],
            [c('loadMore'), c('cal-load-more'), <>Default load-more {c('<button>')} with {c('data-direction')}.</>, <>{c('navigation="continuous"')}, {c('loadMore="button"')}, more months can be loaded, no {c('renderLoadMore')}.</>],
            [c('loading'), c('cal-loading'), <>Default initial-load indicator with {c('data-scope="initial"')}: a spinner in the months grid while no month is rendered, and a visually hidden status text during the initial {c('loading')}.</>, <>Initial load only, without {c('renderLoading')}. Month and load-more loading have no default element with this class (the days are drawn as a skeleton).</>],
            [c('error'), c('cal-error'), <>{c('div[role=alert]')} in a month whose data status is {c('error')}, with a {c('cal-retry')} button when {c('onRetry')} is set.</>, <>Month status {c('error')}, no {c('renderError')}.</>],
            [c('liveRegion'), c('cal-live'), 'Visually hidden aria-live region for announcements.', 'Always (kept visually hidden inline, also when unstyled).'],
          ]}
        />
        <p>
          All 24 keys of <code>CalendarPart</code> are applied somewhere, including <code>rangeBackground</code>. Some default classes have no key, so they
          can only be styled through the parts around them: <code>cal-day-empty</code>, <code>cal-day-number</code>, <code>cal-day-label</code>,{' '}
          <code>cal-day-badge</code>, <code>cal-day-icon</code>, <code>cal-day-markers</code>, <code>cal-day-marker</code> (each marker takes its own{' '}
          <code>className</code> in the day data), <code>cal-retry</code>, <code>cal-load-more-area</code>, <code>cal-spinner</code> and{' '}
          <code>cal-tooltip-arrow</code>.
        </p>
        <h3>Functions of the day: dayCell, dayButton, dayContent</h3>
        <p>
          These three accept <code>ClassNameValue = string | ((day: DayState) =&gt; string | undefined)</code>. The function runs for every day on every
          render and receives the same <code>DayState</code> as <code>modifiers</code>, <code>renderDayContent</code> and <code>renderDay</code>. Return{' '}
          <code>undefined</code> for no class.
        </p>
        <PropsTable
          caption="DayState"
          rows={[
            { name: 'date, month', type: 'CalendarDate, CalendarMonth', description: <>{c('YYYY-MM-DD')} and {c('YYYY-MM')}.</> },
            { name: 'dayOfMonth, dayText, weekday, column', type: 'number, string, Weekday, number', description: <>Day number, the number formatted for the locale, weekday (0 = Sunday), column 0–6 in the row (logical, also in RTL).</> },
            { name: 'label', type: 'string', description: 'Full accessible date label.' },
            { name: 'today, past, future', type: 'boolean', description: 'Relative to the calendar’s today.' },
            { name: 'disabled', type: 'boolean', description: <>Activating it is rejected right now ({c('reason')} says why). Still focusable.</> },
            { name: 'unavailable', type: 'boolean', description: 'Not selectable in any phase (closed, out of bounds, data missing).' },
            { name: 'outOfSchedule', type: 'boolean', description: <>The restriction comes from the regular schedule (see {c('relaxSchedule')}).</> },
            { name: 'readOnly', type: 'boolean', description: <>{c('mode="readonly"')}.</> },
            { name: 'selected, selectedSingle, selectedStart, selectedEnd', type: 'boolean', description: <>{c('selected')} is any of the other three.</> },
            { name: 'inRange', type: 'boolean', description: 'Strictly between range start and end.' },
            { name: 'included', type: 'boolean', description: <>Counts toward the selection per {c('rangeSemantics')} (the end is excluded for stays).</> },
            { name: 'inPreviewRange, previewStart, previewEnd', type: 'boolean', description: 'The range a click on the hovered (or keyboard-focused) day would create.' },
            { name: 'focused, hovered', type: 'boolean', description: 'Keyboard/DOM focus inside the calendar on this day; pointer hover (not touch).' },
            { name: 'action, canStart, canEnd, canPassThrough', type: 'ActivationKind, boolean…', description: 'What a click would do now, and the day’s availability.' },
            { name: 'dataStatus, loading', type: "DataStatus, boolean", description: <>Month data status; {c('loading')} is true while the month loads or during the initial load.</> },
            { name: 'reason, reasonText', type: 'ValidationIssue | null, string | null', description: 'Why it is disabled/unavailable, and the localised text.' },
            { name: 'modifiers', type: 'Record<string, boolean>', description: <>Your {c('modifiers')} that returned true.</> },
            { name: 'weekStart, weekEnd, monthStart, monthEnd', type: 'boolean', description: 'First/last column of the row; first/last day of the month.' },
          ]}
        />
        <Note>
          <p>
            Day cells are memoised and compare <code>classNames</code> by reference. Define the object (and its functions) outside the component or with{' '}
            <code>useMemo</code>; an inline object re-renders every day on each render of the parent.
          </p>
        </Note>
      </Section>

      <Section title="CSS variables">
        <p>
          The default theme declares its public variables on <code>.cal-root</code> and reads every colour, the corner radius and the circle size from them.
          Override them on the root: with <code>className</code> (in a stylesheet loaded after <code>calendar-kit/styles.css</code>), with{' '}
          <code>style</code>, or on a cell through a state selector (see the state example below). Because the root declares them itself, a value set on an
          ancestor such as <code>body</code> or <code>.dark</code> does not reach the calendar; select the root instead, e.g.{' '}
          <code>.dark .cal-root</code> or <code>.dark .my-calendar</code>. The exceptions are <code>--cal-font</code> (declared as <code>inherit</code>) and{' '}
          <code>--cal-tooltip-max-width</code> (not declared), which do inherit from ancestors.
        </p>
        <DataTable
          caption="Public theme variables"
          head={['Variable', 'Default', 'Drives']}
          rows={[
            [c('--cal-font'), c('inherit'), 'font-family of the root (and the tooltip, which copies the root’s font-family).'],
            [c('--cal-color'), c('#1f2328'), 'Root text colour: day numbers, month titles, nav arrows, buttons that inherit colour.'],
            [c('--cal-muted'), c('#8b9198'), 'Weekday names, disabled and unavailable day numbers, the read-only notice text, the loading text.'],
            [c('--cal-bg'), c('#fff'), 'Root background, the shared (sticky) weekday row background, and the gap between a focused day and its focus ring.'],
            [c('--cal-accent'), c('#1f2328'), 'Selected day circle, the outline of the previewed range end, day badges.'],
            [c('--cal-accent-contrast'), c('#fff'), 'Number on a selected circle, badge text.'],
            [c('--cal-range'), c('#eef0f2'), 'Selected range band; also nav button and load-more hover, the shared weekday row border, the footer top border, and the skeleton shimmer.'],
            [c('--cal-preview'), c('#f4f5f6'), 'Preview band while choosing an end; also the read-only notice background and the skeleton shimmer.'],
            [c('--cal-hover'), c('#d0d4d9'), 'Thin outline of a hovered day (not disabled, not selected, not read-only).'],
            [c('--cal-focus'), c('#2563eb'), 'Keyboard focus ring of days, nav buttons, load-more and retry buttons.'],
            [c('--cal-today'), c('#9aa0a6'), <>Thin outline of today’s circle (only while {c('highlightToday')} is on).</>],
            [c('--cal-ring'), c('#c4c7cc'), 'Outer half-ring on the start and end of a multi-day band.'],
            [c('--cal-danger'), c('#b42318'), 'Month error message: text colour, and an 8% tint as its background.'],
            [c('--cal-radius'), c('12px'), 'Rounded band ends where the band breaks at a week or month edge.'],
            [c('--cal-circle'), c('0.84'), 'Circle size as a fraction of the cell’s shorter side: selection, today, hover and focus circles, band height, end half-rings, label/badge width, skeleton pills.'],
            [c('--cal-tooltip-bg'), c('#fff'), 'Tooltip and arrow background.'],
            [c('--cal-tooltip-color'), c('#1f2328'), 'Tooltip text colour.'],
            [c('--cal-tooltip-shadow'), c('0 4px 16px rgb(0 0 0 / 0.14)'), 'Tooltip box-shadow.'],
            [c('--cal-tooltip-max-width'), <>not set ({c('280px')} fallback)</>, 'Tooltip max-width (never wider than the window minus 16px).'],
          ]}
        />
        <p>
          The tooltip is portalled outside the root, so variables would not reach it by inheritance: when it opens, the calendar reads the four{' '}
          <code>--cal-tooltip-*</code> variables and the font-family from the root’s computed style and sets them inline on the tooltip. The tooltip rules
          have the same values as fallbacks.
        </p>
        <Example src="styling-ref/AllVariables" title="Every public variable, changed" />
        <p>
          Some variables are set inline on the root from props, on every render. Inline styles beat your stylesheet, and they are written after your{' '}
          <code>style</code> prop, so setting them has no effect: change the prop instead. You may read them in your own CSS.
        </p>
        <DataTable
          caption="Internal variables (set by the component)"
          head={['Variable', 'Set from', 'Used by the theme for']}
          rows={[
            [c('--cal-day-min-w'), <>{c('minDaySize')} width (default 40)</>, 'Minimum column width of weekday and week rows.'],
            [c('--cal-day-min-h'), <>{c('minDaySize')} height (default 40)</>, 'Minimum day cell height.'],
            [c('--cal-day-max'), <>{c('maxDaySize')} (default 56)</>, 'Maximum day cell height.'],
            [c('--cal-month-gap'), <>{c('monthGap')} (default 32)</>, 'Column gap between months.'],
            [c('--cal-month-padding'), 'constant 8px', 'Inline padding of each month, the shared weekday row padding, and the position of a month loading indicator.'],
            [c('--cal-month-min'), 'computed minimum month width', 'Not used by the default theme.'],
            [c('--cal-columns'), 'current number of month columns', 'Not used by the default theme.'],
            [c('--cal-tooltip-arrow'), 'tooltip position (on the tooltip element)', 'Arrow offset along the tooltip edge.'],
          ]}
        />
      </Section>

      <Section title="data-* attributes">
        <p>
          State is exposed as attributes, the styling contract that also works with <code>unstyled</code> and with your own classes. Boolean attributes
          are present with an empty value or absent: select them with <code>[data-selected]</code>, not <code>[data-selected=&quot;true&quot;]</code>.
        </p>
        <DataTable
          caption="Root (cal-root)"
          head={['Attribute', 'Values', 'Meaning']}
          rows={[
            [c('data-mode'), c('single | range | multiple | readonly'), 'Selection mode.'],
            [c('data-phase'), c('empty | start-selected | complete'), <>Selection phase. {c('start-selected')} only in range mode; read-only is always {c('empty')}.</>],
            [c('data-orientation'), c('horizontal | vertical'), 'Layout orientation.'],
            [c('data-navigation'), c('paged | continuous'), 'Navigation mode.'],
            [c('data-overflow'), c('none | scroll | wrap | reduce-months'), 'What the layout is doing now to fit (the active overflow strategy).'],
            [c('data-at-min-size'), yes, <>Day cells are at {c('minDaySize')} and cannot shrink further.</>],
            [c('data-measured'), yes, 'The first layout measurement has run (absent in server HTML and before the first effect).'],
            [c('data-highlight-today'), yes, <>Unless {c('highlightToday={false}')}. The default today outline requires it.</>],
            [c('dir'), c('ltr | rtl'), 'Not data-*, but the theme uses it to mirror arrows and band half-rings.'],
          ]}
        />
        <DataTable
          caption="Month (cal-month section)"
          head={['Attribute', 'Values', 'Meaning']}
          rows={[
            [c('data-month'), c('YYYY-MM'), 'The month.'],
            [c('data-status'), c('unknown | loading | error'), <>From {c('getDataStatus')}; absent when {c('loaded')}. The theme draws the days as a skeleton for {c('unknown')} and {c('loading')}.</>],
            [c('data-skeleton'), yes, <>Initial load ({c('loading')} before the calendar was shown without it): days drawn as a skeleton.</>],
          ]}
        />
        <DataTable
          caption="Day cell (cal-day) and day button (cal-day-button)"
          head={['Attribute', 'Values', 'Meaning']}
          rows={[
            [c('data-date'), c('YYYY-MM-DD'), 'The date (always present).'],
            [c('data-today'), yes, 'Today.'],
            [c('data-past'), yes, 'Before today.'],
            [c('data-disabled'), yes, <>Activation is rejected now ({c('day.disabled')}).</>],
            [c('data-unavailable'), yes, <>Not selectable in any phase ({c('day.unavailable')}).</>],
            [c('data-out-of-schedule'), yes, 'Restricted by a schedule rule.'],
            [c('data-selected'), yes, 'Selected single or multiple day, or a range endpoint.'],
            [c('data-range-start'), yes, 'Range start.'],
            [c('data-range-end'), yes, 'Range end.'],
            [c('data-in-range'), yes, 'Strictly between start and end.'],
            [c('data-included'), yes, <>Counted by {c('rangeSemantics')} (start through end, or end excluded for stays).</>],
            [c('data-preview'), yes, 'Strictly inside the preview range.'],
            [c('data-preview-start'), yes, 'Start of the preview range.'],
            [c('data-preview-end'), yes, 'End of the preview range.'],
            [c('data-focused'), yes, 'Has focus.'],
            [c('data-hovered'), yes, 'Pointer hover (mouse or pen, not touch).'],
            [c('data-loading'), yes, 'Its month is loading, or the initial load is running.'],
            [c('data-status'), c('unknown | loading | error'), <>The month’s data status; absent when {c('loaded')}.</>],
            [c('data-reason'), <>a {c('ReasonCode')}</>, <>{c('reason.code')} when the day is disabled, unavailable or read-only with a reason: {c('past')}, {c('closed')}, {c('before-min')}, {c('min-length')}, {c('data-error')}, …</>],
            [c('data-day-reason'), 'your string', <>{c('DayAvailability.reason')} of the day, e.g. {c('"maintenance"')}.</>],
            [c('data-week-start'), yes, <>First column of the row (follows {c('firstDayOfWeek')}).</>],
            [c('data-week-end'), yes, 'Last column of the row.'],
            [c('data-month-start'), yes, 'First day of the month.'],
            [c('data-month-end'), yes, 'Last day of the month.'],
            [c('data-mod-<name>'), yes, <>Your modifier {c('<name>')} returned true.</>],
          ]}
        />
        <DataTable
          caption="Cell only"
          head={['Attribute', 'Values', 'Meaning']}
          rows={[
            [c('data-band'), c('start | mid | end'), <>Position in the drawn band: the preview while there is one, otherwise the selected range when start ≠ end. A single-day selection draws no band. The cell then also contains the {c('cal-range-bg')} span.</>],
            [c('data-band-preview'), yes, 'The drawn band is the preview, not the selection.'],
          ]}
        />
        <DataTable
          caption="Other elements"
          head={['Attribute', 'Element', 'Values']}
          rows={[
            [c('data-direction'), <>Nav button ({c('cal-nav-button')})</>, c('previous | next')],
            [c('data-direction'), <>Load-more button ({c('cal-load-more')}) and its area ({c('cal-load-more-area')})</>, c('previous | next')],
            [c('data-scope'), <>Default loading element ({c('cal-loading')})</>, <>{c('initial')} (the only scope the default UI renders)</>],
            [c('data-placement'), <>Tooltip ({c('cal-tooltip')})</>, <>{c('top | bottom | left | right')}: the side actually used after flipping.</>],
          ]}
        />
        <p>
          Cell and button carry the same day attributes, so you can select either. Select the cell for things around the button (the range band, a
          border), the button for the button itself. With <code>renderDay</code>, the attributes reach your element through <code>getDayProps</code>.
        </p>
        <Example src="styling-ref/StateAttributes" title="Every state in its own colour" />
        <p>
          The example recolours states by setting theme variables on <code>.sr-cell[data-…]</code>: the default circle, band and rings read those variables,
          so they change without touching their selectors. Hover a later day after clicking a new start to see <code>data-band-preview</code> and the{' '}
          <code>data-preview-end</code> outline.
        </p>
      </Section>

      <Section title="Modifiers">
        <p>
          <code>modifiers=&#123;&#123; name: (day) =&gt; boolean &#125;&#125;</code> adds your own day states. Each function runs for every rendered day
          with the day’s <code>DayState</code> (before modifiers are applied, so one modifier cannot read another). When it returns true:
        </p>
        <ul>
          <li>
            <code>day.modifiers.name</code> is <code>true</code> in <code>classNames</code> functions, <code>renderDayContent</code>, <code>renderDay</code>,{' '}
            <code>getDayTooltip</code> and <code>renderDayTooltip</code> (false modifiers are left out of the object);
          </li>
          <li>
            <code>data-mod-name</code> is set on the cell and the button.
          </li>
        </ul>
        <p>
          Use names that are valid in an attribute name, ideally lowercase with hyphens (<code>&apos;long-stay&apos;</code>): HTML lowercases attribute
          names, so <code>longStay</code> becomes <code>data-mod-longstay</code> in the DOM.
        </p>
        <Snippet files={setup} label="Theme, state classes and modifiers" />
      </Section>

      <Section title="Slots and render callbacks">
        <p>
          Slots replace a region with your content. Most receive the slot&apos;s own props and a <code>SlotContext</code>: the calendar snapshot (
          <code>selection</code>, <code>activeEndpoint</code>, <code>phase</code>, <code>validation</code>, <code>referenceMonth</code>,{' '}
          <code>visibleMonths</code>, <code>renderedMonths</code>, <code>layout</code>, <code>focusedDate</code>, <code>today</code>) plus{' '}
          <code>instanceId</code>, <code>actions</code> (the same controller as the ref), <code>messages</code>, <code>locale</code> and{' '}
          <code>formatDate</code>.
        </p>
        <PropsTable
          caption="Slots"
          rows={[
            { name: 'renderHeader', type: '(ctx) => ReactNode', description: <>Inside {c('div.cal-header')} ({c('classNames.header')}), after the read-only notice, before the months.</> },
            { name: 'renderFooter', type: '(ctx) => ReactNode', description: <>Inside {c('div.cal-footer')} ({c('classNames.footer')}), after the months. The theme adds a top border in {c('--cal-range')}.</> },
            { name: 'renderNavigation', type: '(NavigationRenderProps, ctx) => ReactNode', description: <>Paged only. Inside {c('div.cal-navigation')} above the months and replaces the default arrows. Props: {c('canPrevious')}, {c('canNext')}, {c('previous()')}, {c('next()')}, {c('months')}, {c('labels')}.</> },
            { name: 'renderMonthHeader', type: '(MonthHeaderRenderProps, ctx) => ReactNode', description: <>Replaces the whole {c('cal-month-header')} row, without a wrapper. Props: {c('month')}, {c('title')}, {c('index')}, {c('status')} and {c('navigation')}: the default arrows that belong to this header, or {c('null')} (always null with {c('renderNavigation')} or continuous navigation). The month is then labelled with {c('aria-label')}.</> },
            { name: 'renderLoading', type: '(LoadingRenderProps, ctx) => ReactNode', description: <>No wrapper. {c('scope')} {c('initial')}: after the viewport during the initial load; {c('month')}: inside a loading month after its grid (the skeleton stays); {c('load-more')}: in the load-more area while added months load (no default for this one).</> },
            { name: 'renderError', type: '(ErrorRenderProps, ctx) => ReactNode', description: <>Replaces {c('div.cal-error')} in each month with status {c('error')}. {c('retry()')} calls {c('onRetry([month])')}.</> },
            { name: 'renderLoadMore', type: '(LoadMoreRenderProps, ctx) => ReactNode', description: <>Replaces the default load-more button inside its area (continuous, {c('loadMore="button"')}, directions in {c('loadDirections')}); also called at {c('minDate')}/{c('maxDate')} with {c('canLoad: false')}, where {c('loadMore()')} does nothing. Props: {c('direction')}, {c('canLoad')}, {c('loading')}, {c('loadMore()')}, {c('label')}.</> },
            { name: 'renderDayTooltip', type: '(DayTooltipRenderProps) => ReactNode', description: <>Content of the open tooltip, inside {c('div.cal-tooltip')} before the arrow. Props: {c('day')}, {c('content')} (from {c('getDayTooltip')} or the default reason text), {c('trigger')}, {c('placement')}. No ctx.</> },
            { name: 'renderDayContent', type: '({ day, data }) => ReactNode', description: <>Inside {c('span.cal-day-content')} in the default day button. Everything else (button, circle, band, ARIA) stays. No interactive elements.</> },
            { name: 'renderDay', type: '({ day, data, getDayProps, defaultContent }) => ReactNode', description: <>Replaces the button and its content span. The cell, its data-* attributes, the range band span and the hidden description stay.</> },
          ]}
        />
        <Example src="styling-ref/Slots" title="Header, navigation, month header, day content, tooltip and footer slots" />
        <Snippet files={statusSlots} label="Loading, error and load-more slots" />
        <h3>getDayProps</h3>
        <p>
          <code>getDayProps(yourProps)</code> returns the props for your day element. Order: the day&apos;s data-* attributes, then your props, then the
          calendar&apos;s own props, which win: the ref (merged with yours: it registers the element for roving focus and as the tooltip anchor),{' '}
          <code>type=&quot;button&quot;</code> (or, with <code>type: null</code> for a non-button element, no <code>type</code> and{' '}
          <code>role=&quot;button&quot;</code> unless you pass a <code>role</code>), <code>id</code>, <code>tabIndex</code>, <code>aria-label</code>, <code>aria-disabled</code>,{' '}
          <code>aria-pressed</code>, <code>aria-current</code>, plus <code>className</code> and <code>aria-describedby</code>, which are merged with
          yours. The class list starts with <code>cal-day-button</code> and <code>classNames.dayButton</code>, so a custom element keeps the default
          circle, focus ring and disabled look unless you use <code>unstyled</code>.
        </p>
        <p>
          Event handlers (<code>onClick</code>, <code>onKeyDown</code>, <code>onPointerEnter</code>, <code>onPointerLeave</code>,{' '}
          <code>onPointerDown</code>, <code>onFocus</code>, <code>onBlur</code>) are composed: yours runs first, and the calendar&apos;s runs only if you
          did not call <code>event.preventDefault()</code>.
        </p>
        <Snippet files={getDayProps} label="getDayProps on a custom element" />
        <h3>unstyled</h3>
        <p>
          <code>unstyled</code> removes every default <code>cal-*</code> class; only your <code>classNames</code> (and <code>className</code>,{' '}
          <code>tooltip.className</code>, marker classes) remain. What stays inline, so the structure still works:
        </p>
        <ul>
          <li>the internal sizing variables on the root (you can use them in your CSS);</li>
          <li>
            the viewport&apos;s <code>overflow-x: auto</code> (and <code>max-block-size</code> / <code>overflow-y</code> with <code>maxBlockSize</code>);
          </li>
          <li>the months grid: <code>display: grid</code> and its column template from the measured layout;</li>
          <li>visually hidden texts (descriptions, status, live region) and the tooltip&apos;s positioning, width and copied theme variables;</li>
          <li>marker colours from the day data.</li>
        </ul>
        <p>
          Not inline: the weekday and week grids, cell sizes, the circle, the range band (its span is still rendered, unstyled) and all colours. Your
          classes must lay out the week rows and size the days.
        </p>
        <Snippet files={unstyled} label="Minimum layout CSS with unstyled" />
      </Section>

      <Section title="The cascade contract">
        <ul>
          <li>
            Import <code>calendar-kit/styles.css</code> once, before your own CSS. The default rules are mostly one class (<code>.cal-root</code>,{' '}
            <code>.cal-month</code>), so a single class of yours on the same element wins by order alone. No rule uses <code>!important</code>, and you
            never need it.
          </li>
          <li>
            State rules select <code>.cal-day[data-…] .cal-day-button</code> (and the <code>::before</code> circle). Today, hover and skeleton wrap their
            state in <code>:where()</code>, so those states add no specificity and the keyboard focus ring, declared last, always wins. Selected, disabled,
            unavailable, the range rings and the preview end are plain selectors of up to three classes.
          </li>
          <li>
            Prefer changing a variable over overriding a property: variables are read wherever they are used, so <code>.my-cell[data-selected]</code>{' '}
            setting <code>--cal-accent</code> recolours the circle regardless of the selector that draws it. The circle is a <code>::before</code> of the
            button; a background on the button itself fills the whole square cell.
          </li>
          <li>
            To override a property of a state rule, match its specificity, e.g. <code>.my-calendar .my-cell[data-unavailable] .my-day</code>.
          </li>
          <li>
            Select your own classes from <code>classNames</code> plus the data-* attributes. Internal class names (<code>cal-day-number</code>,{' '}
            <code>cal-range-bg</code>, …) and the DOM nesting are implementation details; the attributes, variables and parts above are the contract, and
            they keep working with <code>unstyled</code>.
          </li>
        </ul>
      </Section>
    </Page>
  );
}
