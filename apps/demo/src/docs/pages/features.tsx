import { Example } from '../Code';
import { Note, Page, PropsTable, Section } from '../ui';

export function SelectionModes() {
  return (
    <Page
      title="Selection modes"
      lead="The mode prop decides what a click selects: one date, a date range, several separate dates, or nothing at all (read-only). The value and the onChange callback have a different type in each mode."
    >
      <Section title="Single date">
        <p>
          A click selects the date; clicking another date replaces it. The value is a <code>CalendarDate</code>, a date string such as{' '}
          <code>&apos;2026-11-13&apos;</code>, or <code>null</code> when nothing is selected.
        </p>
        <Example src="features/ModeSingle" title="Single date" />
      </Section>
      <Section title="Range">
        <p>
          The first click sets the start, the second click sets the end. While only the start is chosen, pointing at a later day previews the range up to
          that day. Clicking a day before the start begins a new range from that day, and once both ends are set the next click also starts a new range.
          The value is a <code>DateRange</code>: <code>&#123; start, end &#125;</code>, with <code>null</code> for an end that is not chosen yet.
        </p>
        <Example src="features/ModeRange" title="Date range" />
      </Section>
      <Section title="Multiple dates">
        <p>
          Each click adds the date to the selection; clicking a selected date removes it. The value is an array of dates.{' '}
          <code>rules.maxSelections</code> sets how many dates can be selected; when the limit is reached, a further date is rejected until the user
          removes one.
        </p>
        <Example src="features/ModeMultiple" title="Up to 5 dates" />
        <p>
          Rules that limit which days can start a range also limit which dates can be picked here. For example <code>startWeekdays</code> set to{' '}
          <code>[2, 4]</code> allows only Tuesdays and Thursdays (0 = Sunday). When the user clicks a day that is not allowed, the selection does not change:
          the calendar writes the reason to its screen-reader live region, and the day&apos;s tooltip (the small box that appears when you point at or focus the day) shows it. You can
          change these texts through <code>messages.reasons</code>.
        </p>
        <p>
          Some reasons have no tooltip by default because the day already looks unavailable: a day in the past or the future, outside{' '}
          <code>minDate</code>/<code>maxDate</code>, an invalid date, or a day whose data has not loaded yet. Screen readers still hear the reason in the
          day&apos;s label. If you pass <code>getDayTooltip</code>, the calendar shows your content instead of any default tooltip.
        </p>
        <Example src="features/SessionDays" title="Tuesday and Thursday sessions" />
      </Section>
      <Section title="Read-only">
        <p>
          The calendar shows the same days, rules and data (for example which dates are booked), but clicks select nothing. A notice above the grid tells
          the user that dates cannot be selected; change or hide it with <code>messages.readOnlyNotice</code>.
        </p>
        <Example src="features/ModeReadonly" title="Read-only availability" />
      </Section>
      <Section title="Value props: controlled or uncontrolled">
        <p>
          <strong>Controlled</strong>: your component keeps the selection in state and passes it back, e.g.{' '}
          <code>value=&#123;range&#125; onChange=&#123;setRange&#125;</code>; the calendar always shows what you pass. <strong>Uncontrolled</strong>: you
          pass only an initial <code>defaultValue</code>; the calendar keeps the selection itself and still reports every change through{' '}
          <code>onChange</code>.
        </p>
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'CalendarDate | null · DateRange · readonly CalendarDate[]',
              description: 'The selection when you control it. Single mode: a date or null; range mode: a DateRange; multiple mode: an array of dates.',
            },
            { name: 'defaultValue', type: <>same as <code>value</code></>, description: 'Initial selection of an uncontrolled calendar; read once when it mounts, later changes are ignored.' },
            { name: 'onChange', type: '(value, event) => void', description: 'Called when the user or the controller (ref) changes the selection. Not called when you change value yourself.' },
            { name: 'activeEndpoint / defaultActiveEndpoint', type: "'start' | 'end'", description: 'Range mode only: which end the next click sets. Control it to let several calendars continue the same range.' },
          ]}
        />
      </Section>
    </Page>
  );
}

export function DateLimits() {
  return (
    <Page title="Date limits" lead="Block days before or after a date, or before or after today, and stop the month arrows at the limits.">
      <Section title="Minimum and maximum date">
        <p>
          Days before <code>minDate</code> and after <code>maxDate</code> cannot be selected, and the previous/next arrows stop at the months that contain
          these dates. Both limits are inclusive: <code>minDate</code> itself can be selected. The example allows today and the next 30 days.
        </p>
        <Example src="features/DateLimits" title="Next 30 days" />
      </Section>
      <Section title="Past and future">
        <p>
          <code>disablePast</code> blocks every day before today, <code>disableFuture</code> every day after today. Unlike <code>minDate</code>/
          <code>maxDate</code> they do not stop the arrows: the user can still browse to any month, but cannot pick the blocked days.
        </p>
        <Example src="features/PastFuture" title="disablePast and disableFuture" />
      </Section>
      <Section title="Picking a past date: disableFuture with this month last">
        <p>
          With <code>disableFuture</code> and two months, the calendar would show this month and next month, and every day of next month would be blocked.
          To show last month and this month instead, put the current month in second place with <code>monthPosition=&#123;2&#125;</code>.{' '}
          <code>disableFuture</code> only blocks the days after today; it never moves the months shown by itself.
        </p>
        <Example src="features/DisableFutureWindow" title="Last month and this month" />
      </Section>
      <Section title="Today">
        <p>
          Today is marked with a thin circle and a “Today” tooltip. The date comes from the <code>today</code> prop when you pass it; otherwise it is computed
          in <code>timeZone</code> (default: the browser&apos;s time zone). It updates after midnight without changing the month shown.{' '}
          <code>disablePast</code>/<code>disableFuture</code> use the same date. <code>highlightToday=&#123;false&#125;</code> removes only the circle and the
          tooltip; “today” stays in the day&apos;s accessible label.
        </p>
        <Example src="features/TodayMarker" title="Today in another time zone, and without the marker" />
      </Section>
      <PropsTable
        rows={[
          { name: 'minDate / maxDate', type: 'CalendarDate | null', description: 'First and last day that can be selected (both included); the arrows stop at their months. Can also be set inside rules.' },
          { name: 'disablePast / disableFuture', type: 'boolean', default: 'false', description: 'Blocks the days before / after today; does not limit the arrows.' },
          { name: 'today', type: 'CalendarDate', description: 'A fixed date to use as today. Recommended for server rendering and tests, so that every run sees the same today.' },
          { name: 'timeZone', type: 'string', description: 'IANA time zone, e.g. Europe/Istanbul, used to compute today when today is not given. Default: the browser’s time zone.' },
        ]}
      />
    </Page>
  );
}

export function LengthRules() {
  return (
    <Page title="Length rules" lead="Set how short or long a range may be, or give every range the same length. Stays are counted in nights, day ranges in days.">
      <Section title="Minimum and maximum length">
        <p>
          Once a start is selected, ends that would make the range too short or too long are disabled, and the day&apos;s label and tooltip say why (for
          example “Minimum 2 nights”). Both adapters, <code>stayRules</code> and <code>dayRangeRules</code>, also turn on{' '}
          <code>requireReachableEnd</code>: a start is rejected right away when no valid end can follow it — for example with a 2-night minimum when the next
          night is already booked. The user is never left with a start that cannot be completed.
        </p>
        <Example src="features/MinMaxLength" title="2 to 7 nights" />
      </Section>
      <Section title="Fixed length">
        <p>
          With a fixed length, one click selects the whole range. With <code>fixedDays: 3</code>, a click on a Friday selects Friday, Saturday and Sunday.
        </p>
        <Example src="features/FixedLength" title="3-day pass" />
      </Section>
      <PropsTable
        caption="Options"
        rows={[
          { name: 'stayRules({ minNights, maxNights, fixedNights })', type: 'number', description: 'Overnight stays, counted in nights. The check-out day is not part of the stay (exclusive end): 13 → 20 Nov is 7 nights.' },
          { name: 'dayRangeRules({ minDays, maxDays, fixedDays })', type: 'number', description: 'Day ranges, counted in days. The last day is included (inclusive end): 13 → 20 Nov is 8 days.' },
          { name: 'rules.minLength / maxLength / fixedLength', type: 'number', description: 'The same without an adapter; rangeSemantics sets the unit (exclusive: nights, inclusive: days).' },
          {
            name: 'relaxSchedule',
            type: 'boolean | { weekdays?, length? }',
            default: 'false',
            description: '“Custom dates”: ignores the length and weekday rules, while bookings, closed days and date limits still apply. Pass { length: false } to keep the length rules, { weekdays: false } to keep the weekday rules.',
          },
        ]}
      />
      <Note>
        <p>
          To decide whether a start has a valid end, the calendar tries at most 63 possible end days. It rejects the start only when it has proven that no
          end works. If it runs out of candidates first, the start stays selectable and the end the user picks is checked as usual.
        </p>
      </Note>
    </Page>
  );
}

export function DayRules() {
  return (
    <Page title="Start/end days & validation" lead="Decide which days can start or end a range and which can lie inside one, and add rules of your own.">
      <Section title="Start and end days">
        <p>
          Every day has three answers: can a range start here (<code>canStart</code>), end here (<code>canEnd</code>), and pass through it (
          <code>canPassThrough</code>)? With <code>stayRules</code> you set them through weekday options (<code>checkInWeekdays</code>,{' '}
          <code>checkOutWeekdays</code>, <code>availableWeekdays</code>) and a status per day (<code>check-in-only</code>, <code>check-out-only</code>,{' '}
          <code>booked</code>, <code>closed</code>). Without an adapter, return them from <code>rules.getDayAvailability(date, ctx)</code>; <code>ctx</code>{' '}
          is the rule context: the mode, the current selection, the end being chosen, today, and your own <code>ruleContext</code> value.
        </p>
        <Example src="features/StartEndDays" title="Friday/Saturday check-in" />
      </Section>
      <Section title="Custom validation">
        <p>
          For a rule the package does not know, use <code>validateSelection(selection, ctx)</code>. It runs for every selection the user or your code
          proposes (clicks, keyboard and <code>ref.select()</code>). Return an issue with a <code>message</code> to reject it: the selection does not change
          and the message is announced and shown in the tooltip. If the rule depends on your app&apos;s state (for example the number of guests), pass that
          state as <code>ruleContext</code> and read it as <code>ctx.context</code>; when it changes, the current selection is checked again.
        </p>
        <Example src="features/CustomValidation" title="At most one weekend" />
      </Section>
      <PropsTable
        caption="DayAvailability (returned for each day)"
        rows={[
          { name: 'closed', type: 'boolean', description: 'Nothing is possible on this day: no start, no end, no range through it.' },
          { name: 'canStart / canEnd / canPassThrough', type: 'boolean', default: '!closed', description: 'Can be a start (or a single/multiple pick) / a range end / a day inside a range.' },
          { name: 'reason', type: 'string', description: 'Your own tag, e.g. check-out-only; its text comes from messages.dayReasons.' },
          { name: 'message', type: 'string', description: 'A ready-made text for the tooltip and the screen-reader announcement.' },
          { name: 'schedule', type: 'boolean', description: 'Marks the restriction as a schedule rule, so relaxSchedule ignores it (bookings should not set it).' },
        ]}
      />
      <p>
        To combine several rule sets, pass an array to <code>rules</code> (entries that are <code>false</code>, <code>null</code> or{' '}
        <code>undefined</code> are skipped, so <code>cond &amp;&amp; rules</code> works) or use <code>combineRules(...)</code>.
      </p>
    </Page>
  );
}

export function Orientation() {
  return (
    <Page title="Orientation & months" lead="Show one or more months, side by side or stacked. You choose the orientation; the calendar does not switch it by screen size (what happens when months do not fit is on the Responsive layout page).">
      <Section title="Several months">
        <p>
          <code>numberOfMonths</code> sets how many months are shown. In the example <code>stepMonths=&#123;3&#125;</code> makes each arrow click move a
          whole page of three months.
        </p>
        <Example src="features/MultipleMonths" title="Three months" />
      </Section>
      <Section title="Vertical">
        <p>
          <code>orientation=&quot;vertical&quot;</code> stacks the months. Add <code>maxBlockSize</code> to keep the stack inside a scroll area.
        </p>
        <Example src="features/Vertical" title="Vertical months" />
      </Section>
      <Section title="Fixed number of week rows">
        <p>
          With <code>fixedWeeks</code> the calendar draws every month with 6 week rows: a month that needs only 5 (or 4) gets empty rows at the end. So the
          number of week rows stays the same when the user changes month, and the layout below does not shift because one month has fewer rows. The
          number of months shown does not change.
        </p>
        <p>
          Without it, each month gets only the rows it needs: four, five or six, depending on its length and on which weekday it starts. The example shows
          the same five-row month (the first one from now, with weeks starting on Monday) twice: with <code>fixedWeeks=&#123;false&#125;</code> it has five
          rows, with <code>fixedWeeks=&#123;true&#125;</code> a sixth, empty row is added. The rows are outlined so you can see it.
        </p>
        <Example src="features/FixedWeeks" title="Five-row month with and without fixedWeeks" />
      </Section>
      <Section title="Paged or continuous navigation">
        <p>
          <code>navigation=&quot;paged&quot;</code> (default) shows <code>numberOfMonths</code> months at a time; the arrows move this window by{' '}
          <code>stepMonths</code> months. This suits horizontal layouts. <code>navigation=&quot;continuous&quot;</code> shows a list of months that the user
          scrolls and that grows on request, which suits vertical and mobile layouts; see <a href="#/load-more">Loading more months</a>.
        </p>
      </Section>
      <PropsTable
        rows={[
          { name: 'numberOfMonths', type: 'number', default: '1', description: 'How many months are shown, in both orientations.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Months side by side or stacked.' },
          { name: 'stepMonths', type: 'number', default: '1', description: 'How many months one arrow click moves (paged navigation).' },
          { name: 'monthGap', type: 'number', default: '32', description: 'Space between months in px.' },
          { name: 'fixedWeeks', type: 'boolean', default: 'false', description: 'Every month is drawn with 6 week rows (empty rows at the end), so the row count does not change between months.' },
        ]}
      />
    </Page>
  );
}

export function MonthPosition() {
  return (
    <Page title="Reference month position" lead="When several months are shown, choose whether the reference month comes first, in the middle or last.">
      <Section title="First or middle position">
        <p>
          The reference month is the month the calendar opens on and moves from: the month of the selected date, otherwise the current month, unless you
          set it with <code>defaultVisibleMonth</code> or <code>visibleMonth</code>. <code>monthPosition</code> (counted from 1) sets where it appears among the months shown; it moves the window, not the reference month. With
          November as the reference month and three months, <code>monthPosition=&#123;1&#125;</code> shows November, December and January;{' '}
          <code>monthPosition=&#123;2&#125;</code> shows October, November and December.
        </p>
        <p>
          The example shows both with this month as the reference month. The months are always in date order. If the window would reach past{' '}
          <code>minDate</code>/<code>maxDate</code>, it is shifted to stay inside the limits.
        </p>
        <Example src="features/MonthPosition" title="monthPosition 1 and 2 compared" />
      </Section>
    </Page>
  );
}

export function Responsive() {
  return (
    <Page
      title="Responsive layout"
      lead="The calendar measures its own container, not the window, so it adapts the same way in a sidebar, a dialog or a full page."
    >
      <Section title="When the months do not fit">
        <p>
          A month needs at least <code>7 × minDaySize</code> plus padding in width. When the requested months do not fit side by side,{' '}
          <code>overflow</code> decides what happens: <code>wrap</code> (default) moves months to a new row, <code>scroll</code> keeps them in one row that
          scrolls horizontally inside the calendar, <code>reduce-months</code> shows fewer months. Your <code>numberOfMonths</code> stays as it is;{' '}
          <code>onLayoutChange</code> reports what is actually shown. The selection and keyboard focus are kept while the size changes. Drag the corner of
          the box in the example to resize it.
        </p>
        <Example src="features/Responsive" title="Layout follows the container" />
      </Section>
      <Section title="wrap">
        <p>The default. Nothing is hidden: months that do not fit move to a new row and the calendar gets taller. Good for pages with vertical room.</p>
        <Example src="features/OverflowWrap" title="overflow wrap" />
      </Section>
      <Section title="scroll">
        <p>The calendar keeps the height of one row; the months scroll horizontally inside it. Good for toolbars or panels with a fixed height.</p>
        <Example src="features/OverflowScroll" title="overflow scroll" />
      </Section>
      <Section title="reduce-months">
        <p>
          Shows fewer months than requested while they do not fit and goes back to the requested number when there is room. The reference month always stays
          visible. <code>onLayoutChange</code> tells you how many months are shown, e.g. to display it as text as the example does.
        </p>
        <Example src="features/OverflowReduce" title="overflow reduce-months" />
      </Section>
    </Page>
  );
}

export function DaySize() {
  return (
    <Page title="Day size & inner scroll" lead="Keep days large enough to tap; when space runs out, the months scroll inside the calendar instead of the page.">
      <Section title="Minimum day size">
        <p>
          <code>minDaySize</code> (default 40 px) is the smallest size of a day button; <code>maxDaySize</code> (default 56) is the largest height of a day
          cell. When not even one month fits at the minimum size, the months scroll horizontally inside the calendar: the page itself never gets a
          horizontal scrollbar, and the calendar&apos;s scrollbar stays visible. Header and footer slots stay outside this scroll area.{' '}
          <code>maxBlockSize</code> limits the height of the months area and makes it scroll vertically.
        </p>
        <Example src="features/DaySize" title="48 px days in a narrow box" />
      </Section>
    </Page>
  );
}

export function LoadMore() {
  return (
    <Page
      title="Loading more months"
      lead="With continuous navigation the calendar shows a scrolling list of months instead of pages, and adds months before or after the list when asked."
    >
      <Section title="How continuous navigation works">
        <p>
          With <code>navigation=&quot;continuous&quot;</code> the calendar first shows <code>numberOfMonths</code> months, starting at the reference month.
          Each load adds <code>monthsPerLoad</code> months (default: <code>numberOfMonths</code>) at the start or the end of the list, in the directions
          allowed by <code>loadDirections</code>, and stops at the months that contain <code>minDate</code>/<code>maxDate</code>. When earlier months are
          added, the scroll position is kept, so the dates under the user&apos;s finger do not jump.
        </p>
        <p>
          To keep the page light, the list is trimmed to <code>maxRenderedMonths</code> (default 24) months: after each addition the months farthest from
          it are removed, so the list never holds more. If the day with keyboard focus is in a removed month, focus first moves to the same day of the
          month in the nearest kept month that is on screen, so focus stays in the calendar and the page does not jump. Every addition — also when keyboard focus moves past the end of the list — calls{' '}
          <code>onLoadMore</code> and <code>onRenderedMonthsChange</code> (load your data there). The reference month does not change, so{' '}
          <code>onVisibleMonthChange</code> is not called. Paged navigation (the default) works differently: the arrows replace the months shown — see{' '}
          <a href="#/orientation">Orientation &amp; months</a>.
        </p>
        <p>
          <code>loadDirections</code> only decides at which ends the built-in controls appear: the load-more buttons (or your{' '}
          <code>renderLoadMore</code> controls) and, with <code>loadMore=&quot;auto&quot;</code>, the invisible markers that load when scrolled into view.
          It does not limit code: <code>ref.loadMore(direction)</code> (or <code>ctx.actions.loadMore</code> inside a slot) adds months in either direction,
          still only in continuous mode and still stopping at <code>minDate</code>/<code>maxDate</code>. Moving keyboard focus past either end of the list
          also adds months.
        </p>
        <p>
          You can also set the month from your state with a controlled <code>visibleMonth</code> (you pass the month and update it yourself). Changing it
          works like <code>goToMonth()</code>: a month that is already in the list is scrolled to and the list stays; for any other month the list is rebuilt
          around it (within <code>maxRenderedMonths</code>, reported by <code>onRenderedMonthsChange</code> so your data loading follows) and scrolled to.
          The jump is instant, focus does not move, and <code>onVisibleMonthChange</code> is not called for your own change. Update your state from{' '}
          <code>onVisibleMonthChange</code>, not from <code>onVisibleMonthsChange</code>: the visible months change with every scroll, and writing them
          back would make the calendar chase the user&apos;s scrolling. Details in{' '}
          <a href="#/api-events">Callbacks &amp; events → onVisibleMonthChange</a>.
        </p>
      </Section>
      <Section title="Default buttons">
        <p>
          The calendar adds a “Show earlier dates” button above the list and a “Show more dates” button below it (in the calendar&apos;s language). Use
          them when they fit your UI. In the example both directions are enabled.
        </p>
        <Example src="features/LoadMoreDefault" title="Default load-more buttons" />
      </Section>
      <Section title="Your own button text: loadMoreLabels">
        <p>
          <code>loadMoreLabels=&#123;&#123; previous, next &#125;&#125;</code> replaces only what is inside the default buttons; it accepts any{' '}
          <code>ReactNode</code> (text, an icon, both). Behaviour, focus handling and accessibility stay the package&apos;s, so prefer this when only the
          wording or an icon differs. The example starts two months after the current month, so both directions have months to load.
        </p>
        <Example src="features/LoadMore" title="loadMoreLabels" />
      </Section>
      <Section title="Your own control: renderLoadMore">
        <p>
          <code>renderLoadMore(&#123; direction, canLoad, loading, loadMore, label &#125;, ctx)</code> renders your own control in place of each default
          button, for example a link. <code>ctx</code> is the slot context (selection, visible months, actions, …). It is called for each direction enabled
          by <code>loadDirections</code> (other ends get no control at all), also once the list has reached <code>minDate</code>/<code>maxDate</code>: there{' '}
          <code>canLoad</code> is <code>false</code> and <code>loadMore()</code> does nothing, so your control can show a disabled state or a text such as
          “No more dates” (or return <code>null</code>). The default button would simply disappear there.
        </p>
        <p>
          Accessibility of your control is up to you. One thing the calendar handles: if keyboard focus is in the control when the limit is reached, focus
          moves to the first newly added day, so the user is not left on a control that no longer does anything. The example stops at a{' '}
          <code>maxDate</code> two months ahead so the end state is easy to reach.
        </p>
        <Example src="features/LoadMoreRender" title="renderLoadMore" />
      </Section>
      <Section title="Controls outside the list: loadMore=&quot;manual&quot;">
        <p>
          <code>loadMore=&quot;manual&quot;</code> shows no control in the months area; months are added only when you call{' '}
          <code>loadMore(&apos;previous&apos; | &apos;next&apos;)</code> on the controller — the <code>ref</code>, or <code>ctx.actions</code> inside a slot.
          Use it to place the buttons in a footer, a toolbar or a sticky bar. The third option, <code>loadMore=&quot;auto&quot;</code>, loads automatically
          when the end of the list scrolls into view.
        </p>
        <Example src="features/LoadMoreManual" title="Loading from buttons in the footer" />
      </Section>
      <PropsTable
        rows={[
          { name: 'navigation', type: "'paged' | 'continuous'", default: "'paged'", description: 'Pages of months changed with arrows, or a growing list.' },
          { name: 'loadMore', type: "'button' | 'auto' | 'manual'", default: "'button'", description: 'Buttons at the list ends, automatic loading when an end scrolls into view, or only from your code.' },
          { name: 'loadDirections', type: "'next' | 'previous' | 'both'", default: "'next'", description: 'List ends that get built-in controls or automatic loading. ref.loadMore(direction) works in both directions regardless.' },
          { name: 'monthsPerLoad', type: 'number', default: 'numberOfMonths', description: 'Months added per load.' },
          { name: 'maxRenderedMonths', type: 'number', default: '24', description: 'Most months kept rendered (never fewer than numberOfMonths); the farthest are removed, and focus in a removed month moves to a kept day.' },
          { name: 'loadMoreLabels', type: '{ previous?, next?: ReactNode }', description: 'Content of the default buttons.' },
          { name: 'renderLoadMore', type: '(props, ctx) => ReactNode', description: 'Your own control for each direction.' },
        ]}
      />
    </Page>
  );
}

export function GoToMonth() {
  return (
    <Page title="Changing the month from code" lead="Show a given month from your own UI, for example a “First available date” button, without changing the selection.">
      <Section title="Go to the first available date">
        <p>
          Get the controller with a <code>ref</code> (a React ref: <code>useRef</code> gives you an object whose methods act on the calendar), then call{' '}
          <code>ref.goToMonth(month, &#123; focus, behavior &#125;)</code>. It returns <code>&#123; month, clamped &#125;</code>: a month outside{' '}
          <code>minDate</code>/<code>maxDate</code> is replaced by the nearest allowed month and <code>clamped</code> is <code>true</code>. The calendar does
          not search for free dates: your app knows the first available month and passes it.
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
    <Page title="Tooltip" lead="A tooltip is the small box shown next to a day: it can say why a day cannot be picked, show a price, or give a hint while a range is being chosen.">
      <Section title="Day tooltips">
        <p>
          Return a text, or <code>&#123; content, persistent &#125;</code>, from <code>getDayTooltip(&#123; day, data &#125;)</code>; return{' '}
          <code>null</code> for no tooltip. Tooltips open when the user points at the day, focuses it with the keyboard or taps it; a{' '}
          <code>persistent</code> one is shown without any interaction. Without <code>getDayTooltip</code>, a day that cannot be picked shows the reason
          (except for past/future days, days outside the limits, invalid dates and days whose data has not loaded) and today shows “Today”.
        </p>
        <Example src="features/Tooltip" title="Reasons and hints" />
      </Section>
      <Section title="Where the tooltip may appear">
        <p>
          With the default <code>boundary=&quot;calendar&quot;</code> the tooltip stays inside the calendar, below the day&apos;s month title and weekday
          row, so it never covers the navigation. <code>boundary=&quot;viewport&quot;</code> lets it extend beyond the calendar while staying inside the
          browser window, which helps in narrow calendars. The preferred <code>placement</code> is tried first, then the opposite side, then the two remaining
          sides; long text wraps instead of being cut.
        </p>
        <Example src="features/TooltipViewport" title="Viewport boundary, placed right" />
      </Section>
      <PropsTable
        caption="tooltip prop"
        rows={[
          { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred side; when it does not fit, the opposite side, then the other two sides are tried.' },
          { name: 'boundary', type: "'calendar' | 'viewport'", default: "'calendar'", description: 'calendar: stays in the calendar, below the month title and weekday row. viewport: may extend beyond the calendar.' },
          { name: 'offset', type: 'number', default: '8', description: 'Distance from the day in px.' },
          { name: 'container', type: 'HTMLElement | null', default: 'document.body', description: 'Element the tooltip is rendered into, e.g. an open <dialog>.' },
          { name: 'openDate', type: 'CalendarDate | null', description: 'Opens the tooltip of this day from your state (controlled); null closes it.' },
          { name: 'className', type: 'string', description: 'Extra class on the tooltip.' },
        ]}
      />
      <ul>
        <li>The tooltip is rendered into <code>document.body</code> by default, so the calendar&apos;s scroll area never cuts it off; its CSS variables and font are copied from the calendar.</li>
        <li>Escape closes it without moving focus; tapping elsewhere closes a tooltip opened by a tap.</li>
        <li>Days drawn as empty placeholders while their dates load show no tooltip. The reason a day cannot be picked is always in its aria-label as well.</li>
        <li><code>renderDayTooltip(&#123; day, content, trigger, placement &#125;)</code> lets you render the tooltip&apos;s content yourself.</li>
      </ul>
    </Page>
  );
}

export function DayContent() {
  return (
    <Page title="Labels, badges & icons on days" lead="Show your own data on days — prices, badges, icons and coloured dots — independently of whether a day can be selected.">
      <Section title="Labels, badges, icons and markers">
        <p>
          Return an object of the <code>DefaultDayData</code> shape from <code>getDayData(date)</code>, and the default day content draws it: a label under
          the number, a badge, an icon and marker dots. The package does not compute prices or capacity; pass ready-formatted values. Which days can be
          selected is still decided by the rules.
        </p>
        <Example src="features/DayContent" title="Prices, deals and markers" />
      </Section>
      <PropsTable
        caption="DefaultDayData"
        rows={[
          { name: 'label', type: 'ReactNode', description: 'Short text under the number, e.g. a price.' },
          { name: 'badge', type: 'ReactNode', description: 'A small badge in the top end corner.' },
          { name: 'icon', type: 'ReactNode', description: 'A small icon in the top start corner; it does not move the number or the label.' },
          { name: 'markers', type: '{ color?, label?, className? }[]', description: 'Small coloured dots. The dots are hidden from screen readers; each label is added to the day’s accessible description (after description, not repeated).' },
          { name: 'description', type: 'string', description: 'Extra text that screen readers read after the day’s label (aria-describedby).' },
        ]}
      />
      <p>
        For anything else, replace the day&apos;s content (<code>renderDayContent</code>) or the whole day (<code>renderDay</code>) — see{' '}
        <a href="#/styling">Styling</a>.
      </p>
    </Page>
  );
}

export function Loading() {
  return (
    <Page title="Loading & errors" lead="The calendar never fetches data. Your app loads it and tells the calendar what is loading, loaded or failed.">
      <Section title="Initial load">
        <p>
          If <code>loading</code> is on when the calendar first appears, the days are drawn as empty placeholders without numbers, screen readers get a
          status message, and the calendar sets <code>aria-busy</code>. Whether a day can be picked meanwhile depends on the rule option{' '}
          <code>unknownDataPolicy</code>: with <code>&apos;block&apos;</code> (the default) nothing can be selected — not by pointer, keyboard or{' '}
          <code>ref.select()</code>; with <code>&apos;allow&apos;</code> selection works as usual.
        </p>
        <p>
          In the example, “Reload (initial load)” mounts the calendar again with a new <code>key</code>, so the placeholders appear again for three seconds.
        </p>
        <Example src="features/InitialLoad" title="Initial load and background refresh" />
      </Section>
      <Section title="Background refresh">
        <p>
          Once the dates have been shown, turning <code>loading</code> on again keeps the months, the selection and focus. The days keep their numbers and
          stay selectable; only <code>aria-busy</code> is set. Try “Refresh in background” in the example above.
        </p>
      </Section>
      <Section title="Data per month, errors and retry">
        <p>
          When data is loaded month by month, start the requests from <code>onRenderedMonthsChange</code> (it tells you which months were added) and return
          each month&apos;s status from <code>getDataStatus(month)</code>: <code>unknown</code>, <code>loading</code>, <code>loaded</code> or{' '}
          <code>error</code>. Months that are loading or unknown show the placeholders, and with the default policy their days cannot be selected (
          <code>unknownDataPolicy: &apos;allow&apos;</code> changes that). A month with an error shows a retry button that calls{' '}
          <code>onRetry(months)</code>. In the example, the month after the two visible ones fails once: press next to see it.
        </p>
        <Example src="features/MonthData" title="Availability loaded per month" />
      </Section>
      <Section title="A visible loading indicator">
        <p>
          By default, loading is shown only by the placeholders and a status message for screen readers. To show your own spinner or text, use{' '}
          <code>renderLoading</code>. It receives <code>scope</code> — <code>&apos;month&apos;</code> for a month whose data is loading,{' '}
          <code>&apos;load-more&apos;</code> for months just added in continuous mode, <code>&apos;initial&apos;</code> for the calendar-wide{' '}
          <code>loading</code> — plus the affected <code>months</code> and the translated “Loading” text.
        </p>
        <Example src="features/LoadingIndicator" title="renderLoading for months" />
      </Section>
      <PropsTable
        rows={[
          { name: 'loading', type: 'boolean', description: 'Loading for the whole calendar: initial load or background refresh (see above).' },
          { name: 'getDataStatus', type: '(month) => DataStatus', description: 'Status of each month’s data: unknown, loading, loaded or error.' },
          { name: 'onRetry', type: '(months) => void', description: 'Called by the default retry button.' },
          { name: 'renderLoading', type: '({ scope, months, status, messages }, ctx) => ReactNode', description: 'An extra visible indicator; the placeholders stay.' },
          { name: 'renderError', type: '({ months, retry, messages }, ctx) => ReactNode', description: 'Your own error message and retry control.' },
          { name: 'onLoadingChange', type: '(event) => void', description: 'Called when the loading state changes (initial, refreshing, loadingMonths, errorMonths, busy).' },
        ]}
      />
      <Note>
        <p>
          The placeholders&apos; shimmer and the spinner stop when the user has asked the system for reduced motion. Guard against late responses in your
          loader: the example cancels requests for months that are no longer rendered.
        </p>
      </Note>
    </Page>
  );
}

export function I18n() {
  return (
    <Page title="Locales, week start & RTL" lead="Month and weekday names come from the browser's Intl API; the calendar's own texts (buttons, reasons, announcements) come from message packs.">
      <Note>
        <p>
          A calendar&apos;s language comes only from its own <code>locale</code> and <code>messages</code> props; the language switch of these docs does not
          change it. To change single texts or add a language that has no ready pack, see{' '}
          <a href="#/api-messages">Messages &amp; formatting</a>.
        </p>
      </Note>
      <Section title="Turkish">
        <p>
          <code>locale</code> sets the month and weekday names and the first day of the week (Monday for tr-TR); <code>messages</code> translates the
          calendar&apos;s own texts.
        </p>
        <Example src="features/LocaleTurkish" title="Turkish locale" />
      </Section>
      <Section title="Arabic, right to left">
        <p>
          <code>direction</code> follows the locale by default (ar, he, fa, ur, … → right to left). The left and right arrow keys are swapped to match;
          the months stay in date order.
        </p>
        <Example src="features/Rtl" title="Arabic (RTL)" />
      </Section>
      <Section title="Week start">
        <p>
          <code>firstDayOfWeek</code> overrides the locale&apos;s first day of the week (0 = Sunday … 6 = Saturday). The example uses en-US, which starts on
          Sunday, and starts on Monday instead.
        </p>
        <Example src="features/WeekStart" title="Monday start in en-US" />
      </Section>
      <Section title="Several languages on one page">
        <p>
          Every calendar has its own locale and messages; nothing is global. The French, Spanish, Italian, Dutch, German and Arabic packs are complete,
          like English and Turkish: every text and rejection reason is translated (see <a href="#/api-messages">Messages &amp; formatting</a>). To change
          single texts, pass them in <code>messages</code>; the rest of the pack stays.
        </p>
        <Example src="features/MoreLocales" title="French, Spanish, Italian and Dutch" />
      </Section>
      <PropsTable
        rows={[
          { name: 'locale', type: 'string', default: "'en-US'", description: 'Language and region (BCP 47), e.g. tr-TR; used for names, number formats and the first day of the week.' },
          { name: 'messages', type: 'Partial<CalendarMessages>', default: 'messagesEn', description: 'Ready packs: messagesEn, messagesTr, messagesDe, messagesFr, messagesEs, messagesIt, messagesNl, messagesAr. Texts you pass replace only those texts.' },
          { name: 'direction', type: "'ltr' | 'rtl'", default: <>from locale</>, description: 'Left to right or right to left.' },
          { name: 'firstDayOfWeek', type: '0–6', default: <>from locale</>, description: 'First column of the week; 0 = Sunday.' },
          { name: 'weekdayFormat', type: "'narrow' | 'short' | 'long'", default: "'short'", description: 'Length of the weekday names in the header.' },
          { name: 'monthTitleFormat', type: 'Intl.DateTimeFormatOptions', description: 'Format of the month title.' },
          { name: 'formatMonthTitle / formatWeekday / formatDayLabel', type: 'functions', description: 'Build these texts yourself.' },
        ]}
      />
    </Page>
  );
}

export function Slots() {
  return (
    <Page title="Slots & render props" lead="Add your own UI above, below and inside the calendar. A slot is a function prop (a render prop) that returns your JSX and receives the calendar's state and actions.">
      <Section title="Header and footer">
        <p>
          <code>renderHeader</code> and <code>renderFooter</code> receive the slot context <code>ctx</code>: the current <code>selection</code>, its{' '}
          <code>phase</code> (empty, start selected, complete), <code>validation</code>, <code>activeEndpoint</code>, <code>visibleMonths</code>,{' '}
          <code>renderedMonths</code>, <code>focusedDate</code>, <code>today</code>, <code>layout</code>, <code>messages</code>, <code>locale</code>,{' '}
          <code>formatDate</code> and <code>actions</code> (the controller: the same methods as the <code>ref</code>). In the example the header reads the
          phase to ask for check-in or check-out, and the footer&apos;s Clear button calls <code>ctx.actions.clear()</code>.
        </p>
        <Example src="features/Slots" title="Header and footer slots" />
      </Section>
      <Section title="Navigation and month headers">
        <p>
          <code>renderNavigation</code> replaces the previous/next arrows (here one bar for all months); <code>renderMonthHeader</code> replaces the title
          row of each month.
        </p>
        <Example src="features/CustomNavigation" title="Custom navigation" />
      </Section>
      <PropsTable
        rows={[
          { name: 'renderHeader / renderFooter', type: '(ctx) => ReactNode', description: 'Above / below the months, outside their scroll area.' },
          { name: 'renderNavigation', type: '({ canPrevious, canNext, previous, next, months, labels }, ctx)', description: 'Replaces the arrows (paged navigation).' },
          { name: 'renderMonthHeader', type: '({ month, title, index, navigation, status }, ctx)', description: 'Replaces a month’s title row.' },
          { name: 'renderLoading / renderError / renderLoadMore', type: 'functions', description: 'See Loading & errors and Loading more months.' },
          { name: 'renderDayTooltip / renderDayContent / renderDay', type: 'functions', description: 'See Tooltip and Styling.' },
        ]}
      />
    </Page>
  );
}

export function Placement() {
  return (
    <Page
      title="Inline, in a dialog or a popover"
      lead="The calendar is always ordinary content on the page. Opening and closing it, and moving focus to it and back, are your app's job."
    >
      <Section title="Inline">
        <p>
          Every other example is inline: the calendar is part of the page and never closes itself. If you need to know when the user clicks elsewhere,{' '}
          <code>onOutsideClick</code> reports pointer presses outside the calendar (its own tooltip counts as inside).
        </p>
      </Section>
      <Section title="In a dialog">
        <p>
          A native <code>&lt;dialog&gt;</code> opened with <code>showModal()</code> keeps focus inside and closes on Escape. On close the browser returns focus to the element focused before it opened, but Safari does not focus a button when it is clicked, so the examples move focus back to the trigger in <code>onClose</code>.
          A modal dialog is drawn in the browser&apos;s top layer, above everything else, so a tooltip rendered into the page body would sit behind it:
          render the tooltip into the dialog with <code>tooltip.container</code>.
        </p>
        <Example src="features/Modal" title="Calendar in a dialog" />
      </Section>
      <Section title="In a popover rendered through a portal">
        <p>
          A portal only moves the calendar&apos;s HTML elsewhere in the page (here into <code>document.body</code>); it does not position anything.
          Positioning the popover is your app&apos;s job — the calendar positions only its own tooltip. A popover with <code>position: fixed</code> that is
          placed once stays where it is while the page scrolls, so it drifts away from its button and can end up off screen. The example therefore
          recomputes the position from the button on every scroll and resize (at most once per frame), opens above the button when there is more room there,
          keeps the popover inside the window horizontally, limits its height to the free space, and closes it when the button scrolls out of view.
        </p>
        <p>
          Closing is also your app&apos;s job. Close on Escape (the calendar uses Escape only while one of its tooltips is open), on an outside click
          reported by <code>onOutsideClick</code>, and after a pick in <code>onSelectionComplete</code>. Use that rather than <code>onChange</code>: picking
          the date that is already selected changes nothing, so <code>onChange</code> is not called, but the selection is still complete. For focus, call{' '}
          <code>ref.focusDate()</code> in <code>onReady</code> to move it into the grid, and on close return it to the button with{' '}
          <code>focus(&#123; preventScroll: true &#125;)</code>. The calendar never scrolls the page to focus a day inside a fixed popover.
        </p>
        <Example src="features/Popover" title="Popover" />
        <Note>
          <p>
            Need this for many components? A positioning library (for example Floating UI) does the same job; the calendar works inside any positioned
            container.
          </p>
        </Note>
      </Section>
    </Page>
  );
}

export function Synced() {
  return (
    <Page title="Synced calendars" lead="Several calendars can show and edit the same selection. There is no hidden shared store: pass them the same state through props.">
      <Section title="Shared value and endpoint">
        <p>
          Calendars A and B receive the same <code>value</code>, <code>onChange</code>, <code>activeEndpoint</code> and <code>onActiveEndpointChange</code>,
          so a start picked in A can be finished in B. B also has <code>numberOfMonths=&#123;2&#125;</code> and{' '}
          <code>orientation=&quot;vertical&quot;</code>: its two months are stacked inside B. <code>orientation</code> only arranges a calendar&apos;s own
          months; where A and B sit on the page is up to your layout (here a CSS grid).
        </p>
        <Example src="features/Synced" title="Two calendars, one selection" />
      </Section>
      <Section title="Inline and in a dialog">
        <p>
          A calendar in a dialog is just another calendar: give it the same state. It shows the current value when it opens, and its changes appear in the
          inline calendar at once. Its tooltip is rendered into the dialog (top layer).
        </p>
        <Example src="features/SyncedDialog" title="Inline and dialog in sync" />
      </Section>
      <Section title="Inline, in a dialog and in a popover">
        <p>
          The same works wherever a calendar is rendered. Here one range is edited by three calendars: inline in the page, inside a modal{' '}
          <code>&lt;dialog&gt;</code>, and in a popover rendered with <code>createPortal</code> into <code>document.body</code>. All three receive the same{' '}
          <code>value</code>, <code>onChange</code>, <code>activeEndpoint</code>, <code>onActiveEndpointChange</code> and <code>rules</code>. Pick a start
          inline and finish it in the dialog; the popover then opens on the full range.
        </p>
        <ul>
          <li>
            <strong>Shared</strong> (because you pass it): the selection, the end to set next, and the rules.
          </li>
          <li>
            <strong>Per calendar</strong>: the visible month, keyboard focus, hover and the tooltip. Each calendar keeps its own unless you control them.
          </li>
          <li>
            The dialog is in the top layer, so its calendar gets <code>tooltip={'{{ container: dialogContentElement }}'}</code>; a tooltip rendered into{' '}
            <code>document.body</code> would sit behind the dialog.
          </li>
          <li>
            The portal only moves the HTML. Positioning the popover (following the button, flipping, staying in the window) and closing it are the
            app&apos;s job; see <a href="#/placement">Inline, in a dialog or a popover</a>.
          </li>
          <li>A calendar opened later shows the current value, and closing or unmounting one does not reset the others.</li>
        </ul>
        <Example src="features/SyncedEverywhere" title="Inline, dialog and popover in sync" />
      </Section>
      <PropsTable
        caption="What is shared"
        rows={[
          { name: <>Selection</>, type: 'value', description: 'Shared when you pass the same value.' },
          { name: <>Rules and availability</>, type: 'rules', description: 'Shared when built from the same data.' },
          { name: <>Visible month</>, type: 'visibleMonth', description: 'Per calendar, unless you control it.' },
          { name: <>End to set next</>, type: 'activeEndpoint', description: 'Shared when you control it; otherwise each calendar derives it from the value, which gives the same result.' },
          { name: <>Focus, hover, tooltip, rendered months</>, type: '—', description: 'Always per calendar.' },
        ]}
      />
      <p>
        See also the <a href="#/recipe-three-calendars">Three synced calendars</a> example app.
      </p>
    </Page>
  );
}

export function Accessibility() {
  return (
    <Page title="Keyboard & accessibility" lead="Each month is an ARIA grid and every day is a button with a full spoken label. The whole calendar is a single Tab stop; arrow keys move between days.">
      <Section title="Try it">
        <p>Press Tab to reach the grid, then use the keys below. Days that cannot be picked can still be focused, so their reason can be read.</p>
        <Example src="features/Keyboard" title="Keyboard navigation" />
      </Section>
      <PropsTable
        caption="Keys"
        rows={[
          { name: '← → ↑ ↓', type: 'move', description: 'Previous/next day and week. Left and right are swapped in right-to-left layouts.' },
          { name: 'Home / End', type: 'move', description: 'First / last day of the week.' },
          { name: 'PageUp / PageDown', type: 'move', description: 'Same day in the previous / next month (with Shift: year).' },
          { name: 'Enter / Space', type: 'select', description: 'Selects the focused day, like a click.' },
          { name: 'Escape', type: 'dismiss', description: 'Closes an open tooltip without moving focus. When no tooltip is open, the key is left to your app (e.g. to close a dialog).' },
        ]}
      />
      <ul>
        <li>
          Months are <code>role=&quot;grid&quot;</code>; each day is a <code>gridcell</code> containing a <code>&lt;button&gt;</code>. Only one day has{' '}
          <code>tabIndex</code> 0 at a time (roving tab index), so Tab enters and leaves the calendar in one step.
        </li>
        <li>
          A day&apos;s label contains the full date, whether it is today, the start, the end or selected, and why it cannot be picked. Such days use{' '}
          <code>aria-disabled</code> and stay focusable.
        </li>
        <li>Selections, rejected picks and loading are written to a live region (an invisible aria-live area that screen readers read out when it changes).</li>
        <li>
          Each day cell and weekday header carries its column position (<code>aria-colindex</code>), so a day stays under its own weekday header even
          though the empty cells before the 1st are hidden from assistive technology.
        </li>
        <li>Moving focus past the months shown changes the month; adding or removing months never loses focus.</li>
        <li>Trapping focus in a dialog and returning focus when it closes are the app&apos;s job; the calendar only moves focus inside its own grid.</li>
      </ul>
      <Note>
        <p>Behaviour with real screen readers (VoiceOver, NVDA, TalkBack) has not been tested yet; the markup follows the ARIA grid pattern.</p>
      </Note>
    </Page>
  );
}
