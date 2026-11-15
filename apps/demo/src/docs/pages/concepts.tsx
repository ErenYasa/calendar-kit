import dates from '../../snippets/concepts/dates.ts?code';
import { Example, Snippet } from '../Code';
import { Note, Page, PropsTable, Section } from '../ui';

export function CoreConcepts() {
  return (
    <Page title="Core concepts" lead="The few ideas every other page builds on: the date format, modes, who owns the value, which months are shown, what slots receive and how ranges are counted.">
      <Section title="Date format">
        <p>
          The calendar uses two date formats. <code>CalendarDate</code> is one day, for example <code>&quot;2026-11-13&quot;</code>.{' '}
          <code>CalendarMonth</code> is a whole month, for example <code>&quot;2026-11&quot;</code>. Both are a <strong>branded type</strong>: at runtime they
          are ordinary strings, but TypeScript treats them as separate types, so you cannot pass an ordinary string directly where a date or month is expected.
        </p>
        <p>Two separate checks keep invalid dates out:</p>
        <ul>
          <li>
            <strong>Type check (compile time).</strong> TypeScript stops a plain <code>string</code> before the code runs. It checks only the type, so it cannot
            tell whether <code>&apos;2026-02-30&apos;</code> is a real day.
          </li>
          <li>
            <strong>Date check (runtime).</strong> <code>parseDate</code> returns the date when the day exists and <code>null</code> when it does not; use it for
            input you do not control (URL, form, JSON). <code>toCalendarDate</code> makes the same check but throws a <code>RangeError</code>; use it for
            values written in your code that you know are valid.
          </li>
        </ul>
        <Snippet files={dates} label="Dates and months" />
        <p>
          You can also get a date with <code>fromJSDate(date)</code> (the day a JavaScript <code>Date</code> falls on) or{' '}
          <code>getToday(&#123; timeZone &#125;)</code>. Arithmetic helpers (<code>addDays</code>, <code>addMonths</code>, <code>diffDays</code>,{' '}
          <code>eachDay</code>, …) work on the calendar day only; daylight saving changes cannot shift a date.
        </p>
      </Section>
      <Section title="Modes">
        <PropsTable
          caption="mode"
          rows={[
            { name: "'single'", type: 'CalendarDate | null', description: 'One date.' },
            { name: "'range'", type: '{ start, end }', description: 'A start and an end date, picked with two clicks. Whether the end day counts (days) or not (nights) is explained below.' },
            { name: "'multiple'", type: 'readonly CalendarDate[]', description: 'Any number of separate dates; each click adds or removes one (limit the count with maxSelections).' },
            { name: "'readonly'", type: '—', description: 'Only shows the months and availability; clicking a day selects nothing.' },
          ]}
        />
        <p>
          The type of the value follows the mode: with <code>mode=&quot;range&quot;</code>, <code>onChange</code> receives a <code>&#123; start, end &#125;</code>{' '}
          object, and TypeScript reports an error if you pass a single date. See <a href="#/selection-modes">Selection modes</a> for live examples.
        </p>
      </Section>
      <Section title="Uncontrolled">
        <p>
          Uncontrolled means the calendar keeps the selected value itself. You may pass a starting value (for example{' '}
          <code>defaultValue=&#123;addDays(today, 3)&#125;</code>); when the user picks another day, the calendar stores it and your component needs no state.{' '}
          <code>onChange</code> is still called, so you can react to the choice. Use it when nothing else on the page needs the selection.
        </p>
        <ul>
          <li>
            <code>defaultValue</code> is read once, when the calendar first renders; changing it later has no effect. To change the selection from outside, use{' '}
            <code>value</code> (controlled, below), or call <code>ref.reset()</code> to return to <code>defaultValue</code>. A ref is the object React gives
            you through the <code>ref</code> prop; for the calendar it holds methods such as <code>reset()</code> and <code>clear()</code>.
          </li>
          <li>
            If <code>mode</code> changes, the selection starts empty in the new mode, and <code>onChange</code> is not called.
          </li>
        </ul>
        <p>In the example, the day three days from today is selected at first. Pick another day: the calendar keeps it without any state in the component.
        </p>
        <Example src="concepts/Uncontrolled" title="Uncontrolled calendar" />
      </Section>
      <Section title="Controlled">
        <p>
          Controlled means your component keeps the value: you pass <code>value</code> from your state and update that state in <code>onChange</code> (for
          example <code>value=&#123;range&#125;</code> and <code>onChange=&#123;setRange&#125;</code>). The calendar always shows exactly{' '}
          <code>value</code>. When you change the state yourself (from a button, the URL or another calendar), the calendar follows and does not call{' '}
          <code>onChange</code>. Use controlled mode whenever other parts of the page show or change the selection, such as a price or a summary.
        </p>
        <p>
          In the example, the text and the two buttons below the calendar use the same state: “Select today + 7” and “Clear” change the selection without
          touching the calendar.
        </p>
        <Example src="concepts/Controlled" title="Controlled calendar" />
      </Section>
      <Section title="Reference month">
        <p>
          The reference month is the month the calendar uses as the base for deciding which months to show: the shown months are counted from it, and
          the previous/next arrows move it. When the calendar first renders, it is, in this order: <code>visibleMonth</code> (controlled) or <code>defaultVisibleMonth</code>; otherwise the month of the initial selection;
          otherwise the current month. If you do not pass <code>today</code>, the calendar keeps the month it found when it first read the date; when midnight
          passes later, only the today marker moves, the shown months stay.
        </p>
        <p>
          With several months, <code>monthPosition</code> (1-based) sets where the reference month sits among the shown months. It does not change the
          reference month. For example, with November as the reference month and three months shown:
        </p>
        <ul>
          <li>
            <code>monthPosition=&#123;1&#125;</code> shows November, December, January;
          </li>
          <li>
            <code>monthPosition=&#123;2&#125;</code> shows October, November, December.
          </li>
        </ul>
        <p>
          Live examples: <a href="#/month-position">Reference month position</a>.
        </p>
      </Section>
      <Section title="Selection phase">
        <p>
          The selection phase tells you how far the user is, for example to show “Select an end date” after the first click. It is <code>empty</code>{' '}
          (nothing selected), <code>start-selected</code> (a range has its start and waits for its end) or <code>complete</code> (a date is selected, a range
          has both ends, or multiple mode has at least one date). Get it with <code>getSelectionPhase(selection)</code>; inside a slot it is already
          available as <code>ctx.phase</code> (see the next section).
        </p>
        <p>
          In range mode, <code>activeEndpoint</code> (<code>&apos;start&apos;</code> or <code>&apos;end&apos;</code>) says which end the next click sets. You
          can control it like <code>value</code> and share it between calendars, so a range started in one calendar can be finished in another (
          <a href="#/recipe-three-calendars">Three synced calendars</a>).
        </p>
      </Section>
      <Section title="Slot context">
        <p>
          A slot is a function prop that renders one area of the calendar, such as <code>renderHeader</code> (above the months) or <code>renderFooter</code>{' '}
          (below them). Every slot receives the slot context, usually named <code>ctx</code> (type <code>SlotContext</code>): the calendar&apos;s
          current state plus its actions. Where it arrives depends on the slot: <code>renderHeader(ctx)</code> and <code>renderFooter(ctx)</code> get it
          as their only argument; <code>renderNavigation</code>, <code>renderMonthHeader</code>, <code>renderLoading</code>, <code>renderError</code> and{' '}
          <code>renderLoadMore</code> get their own props first and <code>ctx</code> second, for example{' '}
          <code>renderNavigation(props, ctx)</code>. The most used fields:
        </p>
        <ul>
          <li>
            <code>ctx.selection</code>: the value together with its <code>mode</code>; <code>ctx.phase</code>: the selection phase above;{' '}
            <code>ctx.validation</code>: whether the selection is valid, and why not.
          </li>
          <li>
            <code>ctx.visibleMonths</code>: the months on screen; <code>ctx.today</code>: today&apos;s date; <code>ctx.formatDate</code>: formats a date in
            the calendar&apos;s locale.
          </li>
          <li>
            <code>ctx.actions</code>: the calendar&apos;s controller, the same methods as its ref (<code>clear()</code>, <code>goToMonth(month)</code>,{' '}
            <code>select(value)</code>, …).
          </li>
        </ul>
        <p>
          A slot can therefore show and change the selection without any state in your app. In the example, the calendar is uncontrolled; the footer text
          follows each click through <code>ctx.phase</code>, and its Today and Clear buttons call <code>ctx.actions</code>.
        </p>
        <Example src="concepts/SlotContext" title="Footer that reads the slot context" />
        <p>Other callbacks receive different objects, not a slot context:</p>
        <ul>
          <li>
            Rule callbacks such as <code>getDayAvailability</code> and <code>validateSelection</code> receive a <code>RuleContext</code> as their second
            argument: <code>mode</code>, <code>selection</code>, <code>activeEndpoint</code>, <code>today</code> and <code>context</code> (your{' '}
            <code>ruleContext</code> prop).
          </li>
          <li>
            <code>renderDayContent</code> and <code>getDayTooltip</code> receive <code>&#123; day, data &#125;</code> for one day; <code>renderDay</code>{' '}
            receives the same object plus <code>getDayProps</code> and <code>defaultContent</code>.
          </li>
          <li>
            Event callbacks such as <code>onChange</code> receive event objects (see <a href="#/api-events">Callbacks &amp; events</a>).
          </li>
        </ul>
      </Section>
      <Section title="Exclusive and inclusive ranges">
        <p>
          A range stores only two dates; <code>rangeSemantics</code> decides whether the end day counts. You rarely set it yourself, because the adapters set
          it: <code>stayRules</code> is <strong>exclusive</strong> (the end is the check-out day and is not included: 13 → 16 November is 3 nights),{' '}
          <code>dayRangeRules</code> is <strong>inclusive</strong> (every day counts: 13 → 16 November is 4 days). Without rules a range is inclusive. Count
          with <code>countNights</code> and <code>countDays</code>; list the counted days with <code>getIncludedDays(range, semantics)</code>, for example to
          add up nightly prices.
        </p>
        <p>In the example, pick the same start and end in both calendars and compare the numbers below them.
        </p>
        <Example src="concepts/RangeSemantics" title="Nights and days" />
      </Section>
      <Section title="Same-day ranges">
        <p>
          An inclusive range may start and end on the same day (<code>start === end</code>) by default: a one-day ticket. An exclusive range may not, because
          such a stay has 0 nights; clicking the start day again clears it instead. To allow day use (arrive and leave on the same day, for example a day room
          in a hotel), pass <code>allowSameDay</code>.
        </p>
        <Note>
          <p>
            A same-day exclusive range is 0 nights long, so a minimum stay still rejects it: with <code>allowSameDay</code> and <code>minNights: 1</code>, day
            use is not possible. Leave the minimum unset when you allow day use.
          </p>
        </Note>
        <Example src="concepts/SameDay" title="Day use" />
      </Section>
    </Page>
  );
}
