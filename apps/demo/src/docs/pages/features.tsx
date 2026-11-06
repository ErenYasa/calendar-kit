import { Example } from '../Code';
import { Note, Page, PropsTable, Section } from '../ui';

export function SelectionModes() {
  return (
    <Page title="Selection modes" lead="Choose what a click selects with the mode prop. Each mode has its own value type, initial value and onChange signature.">
      <Section title="Single date">
        <Example src="features/ModeSingle" title="Single date" />
      </Section>
      <Section title="Range">
        <p>The first click sets the start, the second the end. Hovering previews the range; a click before the start begins a new range.</p>
        <Example src="features/ModeRange" title="Date range" />
      </Section>
      <Section title="Multiple dates">
        <p>Clicks toggle dates. <code>rules.maxSelections</code> limits how many distinct dates can be selected.</p>
        <Example src="features/ModeMultiple" title="Multiple dates" />
      </Section>
      <Section title="Read-only">
        <p>Shows availability with the same rules and data, but nothing can be selected. A notice explains this above the grid.</p>
        <Example src="features/ModeReadonly" title="Read-only availability" />
      </Section>
      <Section title="Initial values">
        <PropsTable
          rows={[
            { name: 'value', type: 'CalendarDate | null · DateRange · readonly CalendarDate[]', description: 'Controlled value for the mode.' },
            { name: 'defaultValue', type: 'same as value', description: 'Uncontrolled initial value, read once on mount.' },
            { name: 'onChange', type: '(value, event) => void', description: 'Called for user and controller changes, never for prop changes.' },
            { name: 'activeEndpoint / defaultActiveEndpoint', type: "'start' | 'end'", description: 'Range only: which end the next click sets.' },
          ]}
        />
      </Section>
    </Page>
  );
}

export function DateLimits() {
  return (
    <Page title="Date limits" lead="Limit which days can be picked and how far the calendar can navigate.">
      <Section title="Minimum and maximum date">
        <p>
          <code>minDate</code> and <code>maxDate</code> disable days outside the limits and stop navigation at the months that contain them.
        </p>
        <Example src="features/DateLimits" title="Next 30 days" />
      </Section>
      <Section title="Past and future">
        <p>
          <code>disablePast</code> and <code>disableFuture</code> are relative to today (<code>today</code> prop, or computed in <code>timeZone</code>). Unlike
          min/max they only restrict selection; they do not limit navigation.
        </p>
        <Example src="features/PastFuture" title="disablePast and disableFuture" />
      </Section>
      <PropsTable
        rows={[
          { name: 'minDate / maxDate', type: 'CalendarDate | null', description: 'Inclusive limits; also available as rules.' },
          { name: 'disablePast / disableFuture', type: 'boolean', default: 'false', description: 'Relative to today.' },
          { name: 'today', type: 'CalendarDate', description: 'Explicit today (recommended for SSR and tests).' },
          { name: 'timeZone', type: 'string', description: 'IANA zone used to compute today when today is not given.' },
        ]}
      />
    </Page>
  );
}

export function LengthRules() {
  return (
    <Page title="Length rules" lead="Minimum, maximum and fixed range lengths, measured in nights for stays and in days for day ranges.">
      <Section title="Minimum and maximum">
        <p>
          While a start is selected, ends that would break the rule are disabled; their reason is part of the day&apos;s accessible label and default
          tooltip. With <code>requireReachableEnd</code> (on in both adapters) a start is rejected when no valid end can follow it — for example when the next
          night is booked under a 2-night minimum.
        </p>
        <Example src="features/MinMaxLength" title="2 to 7 nights" />
      </Section>
      <Section title="Fixed length">
        <p>With a fixed length one click creates the whole range.</p>
        <Example src="features/FixedLength" title="3-day pass" />
      </Section>
      <PropsTable
        caption="Options"
        rows={[
          { name: 'stayRules({ minNights, maxNights, fixedNights })', type: 'number', description: 'Exclusive ranges, counted in nights.' },
          { name: 'dayRangeRules({ minDays, maxDays, fixedDays })', type: 'number', description: 'Inclusive ranges, counted in days.' },
          { name: 'rules.minLength / maxLength / fixedLength', type: 'number', description: 'The same without an adapter; the unit follows rangeSemantics.' },
          { name: 'relaxSchedule', type: 'boolean | { weekdays?, length? }', default: 'false', description: '“Custom dates”: ignores length and weekday rules while bookings still apply.' },
        ]}
      />
      <Note>
        <p>
          The reachable-end search checks at most 63 end candidates. A start is rejected only when it is proven that no end exists; if the search runs out of
          candidates first, the start stays selectable and its end is validated as usual.
        </p>
      </Note>
    </Page>
  );
}

export function DayRules() {
  return (
    <Page title="Start/end days & validation" lead="Control which days can start or end a range, which can be passed through, and add rules of your own.">
      <Section title="Start and end days">
        <p>
          Weekday rules (<code>checkInWeekdays</code>, <code>checkOutWeekdays</code>, <code>availableWeekdays</code>) and per-day statuses (
          <code>check-in-only</code>, <code>check-out-only</code>, <code>booked</code>, <code>closed</code>) decide each day&apos;s <code>canStart</code>,{' '}
          <code>canEnd</code> and <code>canPassThrough</code>. Without an adapter, return them from <code>rules.getDayAvailability(date, ctx)</code>.
        </p>
        <Example src="features/StartEndDays" title="Friday/Saturday check-in" />
      </Section>
      <Section title="Custom validation">
        <p>
          <code>validateSelection(selection, ctx)</code> runs for every proposed selection (clicks, keyboard and <code>ref.select()</code>). Return an issue with a{' '}
          <code>message</code> to reject it. Rules can depend on app state through <code>ruleContext</code> (available as <code>ctx.context</code>); a change
          revalidates.
        </p>
        <Example src="features/CustomValidation" title="At most one weekend" />
      </Section>
      <PropsTable
        caption="DayAvailability (returned per day)"
        rows={[
          { name: 'closed', type: 'boolean', description: 'Nothing possible on this day.' },
          { name: 'canStart / canEnd / canPassThrough', type: 'boolean', default: '!closed', description: 'Start or single pick / range end / inside a range.' },
          { name: 'reason', type: 'string', description: 'Your tag (e.g. check-out-only); localised through messages.dayReasons.' },
          { name: 'message', type: 'string', description: 'Ready-made text for tooltips and announcements.' },
          { name: 'schedule', type: 'boolean', description: 'The restriction is a schedule rule, ignored by relaxSchedule.' },
        ]}
      />
      <p>
        Several rule sets can be combined: <code>rules</code> accepts an array (falsy entries are skipped), or use <code>combineRules(...)</code>.
      </p>
    </Page>
  );
}

export function Orientation() {
  return (
    <Page title="Orientation & months" lead="Show one or more months, side by side or stacked, independent of the device.">
      <Section title="Several months">
        <Example src="features/MultipleMonths" title="Three months" />
      </Section>
      <Section title="Vertical">
        <Example src="features/Vertical" title="Vertical months" />
      </Section>
      <PropsTable
        rows={[
          { name: 'numberOfMonths', type: 'number', default: '1', description: 'Months in the window, in both orientations.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction.' },
          { name: 'stepMonths', type: 'number', default: '1', description: 'Months moved by previous/next in paged navigation.' },
          { name: 'monthGap', type: 'number', default: '32', description: 'Gap between months in px.' },
          { name: 'fixedWeeks', type: 'boolean', default: 'false', description: 'Always render 6 week rows (constant height).' },
        ]}
      />
    </Page>
  );
}

export function MonthPosition() {
  return (
    <Page title="Reference month position" lead="Where the reference month appears inside a window of several months.">
      <Section title="Middle position">
        <p>
          <code>monthPosition</code> is 1-based: with 3 months, <code>1</code> shows reference + 2 next, <code>2</code> previous + reference + next. The order is
          always chronological. When the window would cross <code>minDate</code>/<code>maxDate</code> it shifts inside them.
        </p>
        <Example src="features/MonthPosition" title="Reference month in the middle" />
      </Section>
    </Page>
  );
}

export function Responsive() {
  return (
    <Page title="Responsive layout" lead="The calendar measures its own container (ResizeObserver), so it works the same in a sidebar, a modal or a full page.">
      <Section title="Overflow strategies">
        <p>
          The minimum month width is <code>7 × minDaySize</code> plus padding. When the requested months do not fit, <code>overflow</code> decides:{' '}
          <code>wrap</code> (default) moves months to a new row, <code>scroll</code> scrolls them horizontally inside the calendar, <code>reduce-months</code>{' '}
          shows fewer months. The requested count never changes silently: <code>onLayoutChange</code> reports the effective layout. Selection and focus survive
          resizing.
        </p>
        <Example src="features/Responsive" title="Container-based layout" />
      </Section>
    </Page>
  );
}

export function DaySize() {
  return (
    <Page title="Day size & inner scroll" lead="Keep touch targets large; let the months area scroll instead of the page.">
      <Section title="Minimum day size">
        <p>
          <code>minDaySize</code> (default 40 px) is the smallest interactive day; <code>maxDaySize</code> (default 56) caps the cell height. If even one month
          does not fit, the months area scrolls horizontally inside the calendar — the page never overflows and the scrollbar is not hidden. Header and footer
          slots stay outside the scroll area. <code>maxBlockSize</code> adds vertical scrolling.
        </p>
        <Example src="features/DaySize" title="48 px days in a narrow box" />
      </Section>
    </Page>
  );
}

export function LoadMore() {
  return (
    <Page title="Progressive months" lead="Continuous navigation renders a growing list of months; “show more dates” adds the next ones.">
      <Section title="Show more dates">
        <p>
          With <code>navigation=&quot;continuous&quot;</code> only <code>numberOfMonths</code> months render at first; each load adds <code>monthsPerLoad</code>{' '}
          before or after, stopping at min/max. Scroll position is kept when earlier months are added, and keyboard focus is never lost.
        </p>
        <Example src="features/LoadMore" title="Show more dates" />
      </Section>
      <PropsTable
        rows={[
          { name: 'navigation', type: "'paged' | 'continuous'", default: "'paged'", description: 'Pages of N months, or a growing list.' },
          { name: 'loadMore', type: "'button' | 'auto' | 'manual'", default: "'button'", description: 'Load on button click, automatically near the end of the scroll area, or only through ref.loadMore().' },
          { name: 'loadDirections', type: "'next' | 'previous' | 'both'", default: "'next'", description: 'Where months can be added.' },
          { name: 'monthsPerLoad', type: 'number', default: 'numberOfMonths', description: 'Months added per load.' },
          { name: 'maxRenderedMonths', type: 'number', default: '24', description: 'DOM bound; months are dropped at the far end (never the one holding focus).' },
          { name: 'loadMoreLabels', type: '{ previous?, next?: ReactNode }', description: 'Content of the default buttons.' },
          { name: 'renderLoadMore', type: '(props, ctx) => ReactNode', description: 'A completely different control.' },
        ]}
      />
    </Page>
  );
}

export function GoToMonth() {
  return (
    <Page title="Programmatic navigation" lead="Move the view from your own UI through the controller ref, without changing the selection.">
      <Section title="Go to the first available date">
        <p>
          <code>ref.goToMonth(month, &#123; focus, behavior &#125;)</code> returns <code>&#123; month, clamped &#125;</code>; targets outside min/max are clamped.
          The calendar does not search for availability: your app knows the first available month and passes it.
        </p>
        <Example src="features/GoToMonth" title="Go to first available date" />
      </Section>
      <p>
        Other controller methods: <code>next()</code>, <code>previous()</code>, <code>loadMore(direction)</code>, <code>focusDate(date)</code> — see{' '}
        <a href="#/api-controller">Controller</a>.
      </p>
    </Page>
  );
}

export function TooltipPage() {
  return (
    <Page title="Tooltip" lead="Explain days: why a day cannot be picked, a price, or a hint while a range is being chosen.">
      <Section title="Day tooltips">
        <p>
          Return text or <code>&#123; content, persistent &#125;</code> from <code>getDayTooltip(&#123; day, data &#125;)</code>. Tooltips open on hover, keyboard
          focus and tap; <code>persistent</code> ones show without interaction. By default rejected days show their reason and today shows “Today”.
        </p>
        <Example src="features/Tooltip" title="Reasons and hints" />
      </Section>
      <PropsTable
        caption="tooltip prop"
        rows={[
          { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred side; the opposite side, then right and left are tried when it does not fit.' },
          { name: 'boundary', type: "'calendar' | 'viewport'", default: "'calendar'", description: 'calendar: stays in the month below its header and weekday row. viewport: may extend beyond the calendar.' },
          { name: 'offset', type: 'number', default: '8', description: 'Gap to the day in px.' },
          { name: 'container', type: 'HTMLElement | null', default: 'document.body', description: 'Portal target (e.g. a <dialog>).' },
          { name: 'openDate', type: 'CalendarDate | null', description: 'Controlled open day.' },
          { name: 'className', type: 'string', description: 'Extra class on the tooltip.' },
        ]}
      />
      <ul>
        <li>The tooltip is portalled with fixed positioning; the root&apos;s tooltip CSS variables and font are copied to it.</li>
        <li>Escape closes it without moving focus; a tap outside closes a touch tooltip. Text wraps instead of being cut.</li>
        <li>Skeleton days (loading) never show tooltips. The reason is always in the day&apos;s aria-label as well.</li>
        <li><code>renderDayTooltip(&#123; day, content, trigger, placement &#125;)</code> replaces the tooltip&apos;s content.</li>
      </ul>
    </Page>
  );
}

export function DayContent() {
  return (
    <Page title="Day content" lead="Show your data on days — prices, badges, icons and markers — separately from whether a day can be selected.">
      <Section title="Labels, badges, icons and markers">
        <p>
          When <code>getDayData(date)</code> returns the <code>DefaultDayData</code> shape, the default day content draws it. The package does not compute prices
          or capacity; format values yourself.
        </p>
        <Example src="features/DayContent" title="Prices, deals and markers" />
      </Section>
      <PropsTable
        caption="DefaultDayData"
        rows={[
          { name: 'label', type: 'ReactNode', description: 'Short text under the number (e.g. a price).' },
          { name: 'badge', type: 'ReactNode', description: 'A small badge.' },
          { name: 'icon', type: 'ReactNode', description: 'A small icon.' },
          { name: 'markers', type: '{ color?, label?, className? }[]', description: 'Dots; each label is announced.' },
          { name: 'description', type: 'string', description: 'Added to the accessible label.' },
        ]}
      />
      <p>
        For anything else, replace the content (<code>renderDayContent</code>) or the whole day (<code>renderDay</code>) — see{' '}
        <a href="#/styling">Styling</a>.
      </p>
    </Page>
  );
}

export function Loading() {
  return (
    <Page title="Loading & errors" lead="The calendar never fetches. Your app loads data and tells the calendar what is known.">
      <Section title="Initial load and background refresh">
        <p>
          <code>loading</code> before the calendar was ever shown without it is the <strong>initial load</strong>: days are drawn as an equal-size skeleton (no
          visible text; a status message for screen readers and <code>aria-busy</code>), and no day can be selected by pointer, keyboard or controller. Turned
          on again later it is a <strong>background refresh</strong>: view, selection and focus stay as they are. To show the skeleton again, remount with a
          new <code>key</code>.
        </p>
        <Example src="features/InitialLoad" title="Initial load and refresh" />
      </Section>
      <Section title="Data per month, errors and retry">
        <p>
          Start requests from <code>onRenderedMonthsChange</code> and return each month&apos;s status from <code>getDataStatus(month)</code>:{' '}
          <code>unknown</code>, <code>loading</code>, <code>loaded</code> or <code>error</code>. Days whose data is not loaded cannot be selected (
          <code>unknownDataPolicy: &apos;allow&apos;</code> changes that). An error shows a retry button that calls <code>onRetry(months)</code>.
        </p>
        <Example src="features/MonthData" title="Async availability" />
      </Section>
      <PropsTable
        rows={[
          { name: 'loading', type: 'boolean', description: 'Calendar-wide loading (initial or refresh, see above).' },
          { name: 'getDataStatus', type: '(month) => DataStatus', description: 'Status of each month’s data.' },
          { name: 'onRetry', type: '(months) => void', description: 'Called by the default error UI.' },
          { name: 'renderLoading', type: "({ scope: 'initial' | 'month' | 'load-more', months, status }) => ReactNode", description: 'An extra visible indicator (the skeleton stays).' },
          { name: 'renderError', type: '({ months, retry }) => ReactNode', description: 'Custom error UI.' },
          { name: 'onLoadingChange', type: '(event) => void', description: 'Transitions only: initial, refreshing, loadingMonths, errorMonths, busy.' },
        ]}
      />
      <Note>
        <p>
          The skeleton shimmer and spinner stop when the user prefers reduced motion. Protect against stale responses in your loader: the example aborts
          requests for months that are no longer rendered.
        </p>
      </Note>
    </Page>
  );
}

export function I18n() {
  return (
    <Page title="Locales, week start & RTL" lead="Month and weekday names come from Intl; the calendar's own texts come from message packs.">
      <Section title="Turkish">
        <Example src="features/LocaleTurkish" title="Turkish locale" />
      </Section>
      <Section title="Arabic, right to left">
        <p>
          <code>direction</code> defaults from the locale (ar, he, fa, ur, … → rtl). Horizontal arrow keys are mirrored; the order of months stays chronological.
        </p>
        <Example src="features/Rtl" title="Arabic (RTL)" />
      </Section>
      <Section title="Week start">
        <Example src="features/WeekStart" title="Monday start in en-US" />
      </Section>
      <PropsTable
        rows={[
          { name: 'locale', type: 'string', default: "'en-US'", description: 'BCP 47 locale for Intl formatting.' },
          { name: 'messages', type: 'Partial<CalendarMessages>', default: 'messagesEn', description: 'Ready packs: messagesEn, messagesTr, messagesDe, messagesFr, messagesEs, messagesIt, messagesNl, messagesAr. Partial overrides are merged.' },
          { name: 'direction', type: "'ltr' | 'rtl'", default: 'from locale', description: 'Layout direction.' },
          { name: 'firstDayOfWeek', type: '0–6', default: 'from locale', description: '0 = Sunday.' },
          { name: 'weekdayFormat', type: "'narrow' | 'short' | 'long'", default: "'short'", description: 'Weekday header names.' },
          { name: 'monthTitleFormat', type: 'Intl.DateTimeFormatOptions', description: 'Month title format.' },
          { name: 'formatMonthTitle / formatWeekday / formatDayLabel', type: 'functions', description: 'Full control over these texts.' },
        ]}
      />
    </Page>
  );
}

export function Slots() {
  return (
    <Page title="Slots & render props" lead="Add your own UI around and inside the calendar; slots receive its state and actions.">
      <Section title="Header and footer">
        <p>
          Slots receive a context: <code>selection</code>, <code>phase</code>, <code>validation</code>, <code>activeEndpoint</code>, <code>visibleMonths</code>,{' '}
          <code>renderedMonths</code>, <code>focusedDate</code>, <code>today</code>, <code>layout</code>, <code>messages</code>, <code>locale</code>,{' '}
          <code>formatDate</code> and <code>actions</code> (the controller).
        </p>
        <Example src="features/Slots" title="Header and footer slots" />
      </Section>
      <Section title="Navigation and month headers">
        <Example src="features/CustomNavigation" title="Custom navigation" />
      </Section>
      <PropsTable
        rows={[
          { name: 'renderHeader / renderFooter', type: '(ctx) => ReactNode', description: 'Above / below the months (outside the scroll area).' },
          { name: 'renderNavigation', type: '({ canPrevious, canNext, previous, next, months, labels }, ctx)', description: 'Replaces the arrows (paged mode).' },
          { name: 'renderMonthHeader', type: '({ month, title, index, navigation, status }, ctx)', description: 'Replaces a month’s title row.' },
          { name: 'renderLoading / renderError / renderLoadMore', type: 'functions', description: 'See Loading and Progressive months.' },
          { name: 'renderDayTooltip / renderDayContent / renderDay', type: 'functions', description: 'See Tooltip and Styling.' },
        ]}
      />
    </Page>
  );
}

export function Placement() {
  return (
    <Page title="Inline, modal & portal" lead="The calendar is always inline content; opening, closing and focus management belong to your app.">
      <Section title="Inline">
        <p>
          Every other example is inline: the calendar is part of the page. It never closes itself. <code>onOutsideClick</code> reports pointer presses outside
          its React tree (its own portals, like the tooltip, count as inside).
        </p>
      </Section>
      <Section title="Modal">
        <p>
          A native <code>&lt;dialog&gt;</code> with <code>showModal()</code> traps focus, closes on Escape and returns focus. Because a modal dialog is in the
          top layer, point the tooltip portal into it with <code>tooltip.container</code>.
        </p>
        <Example src="features/Modal" title="Calendar in a dialog" />
      </Section>
      <Section title="Popover through a portal">
        <p>
          A calendar can be portalled anywhere. Here a popover opens under its button, moves focus into the grid with <code>ref.focusDate()</code> and closes on
          selection, Escape or an outside click.
        </p>
        <Example src="features/Popover" title="Popover" />
      </Section>
    </Page>
  );
}

export function Synced() {
  return (
    <Page title="Synced calendars" lead="Several calendars can show and edit the same selection. There is no hidden store: share state through props.">
      <Section title="Shared value and endpoint">
        <Example src="features/Synced" title="Two calendars, one selection" />
      </Section>
      <PropsTable
        caption="What is shared"
        rows={[
          { name: 'Selection', type: 'value', description: 'Shared when you pass the same value.' },
          { name: 'Rules and availability', type: 'rules', description: 'Shared when built from the same source.' },
          { name: 'Visible month', type: 'visibleMonth', description: 'Per calendar unless you control it.' },
          { name: 'Active endpoint', type: 'activeEndpoint', description: 'Shared when controlled; otherwise derived from the value (still consistent).' },
          { name: 'Focus, hover, tooltip, rendered months', type: '—', description: 'Always per calendar.' },
        ]}
      />
      <p>A calendar mounted later shows the current value; unmounting one does not reset the others. See also the <a href="#/recipe-three-calendars">three calendars recipe</a>.</p>
    </Page>
  );
}

export function Accessibility() {
  return (
    <Page title="Keyboard & accessibility" lead="Each month is an ARIA grid with one tab stop; days are buttons with full labels.">
      <Section title="Try it">
        <Example src="features/Keyboard" title="Keyboard navigation" />
      </Section>
      <PropsTable
        caption="Keys"
        rows={[
          { name: '← → ↑ ↓', type: 'move', description: 'Previous/next day and week. Horizontal arrows are mirrored in RTL.' },
          { name: 'Home / End', type: 'move', description: 'Start / end of the week.' },
          { name: 'PageUp / PageDown', type: 'move', description: 'Previous / next month (with Shift: year).' },
          { name: 'Enter / Space', type: 'select', description: 'Activates the focused day.' },
          { name: 'Escape', type: 'dismiss', description: 'Closes an open tooltip without moving focus (only consumed when one is open).' },
        ]}
      />
      <ul>
        <li>Months are <code>role=&quot;grid&quot;</code>, days <code>gridcell</code> + <code>&lt;button&gt;</code> with a roving <code>tabIndex</code>.</li>
        <li>Day labels contain the full date, today/start/end/in-range and the reason a day is disabled. Disabled days use <code>aria-disabled</code> and stay focusable.</li>
        <li>A live region announces selections, rejections and loading.</li>
        <li>Moving focus outside the visible months navigates; adding or dropping months never loses focus.</li>
        <li>Modal focus traps and returning focus are the app&apos;s job; the calendar only manages focus inside its grid.</li>
      </ul>
      <Note>
        <p>Screen reader behaviour (VoiceOver, NVDA, TalkBack) has not been tested yet; the markup follows the ARIA grid pattern.</p>
      </Note>
    </Page>
  );
}
