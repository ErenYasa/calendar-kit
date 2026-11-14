import dates from '../../snippets/concepts/dates.ts?code';
import { Example, Snippet } from '../Code';
import { Note, Page, PropsTable, Section } from '../ui';

export function CoreConcepts() {
  return (
    <Page title="Core Concepts" lead="The few ideas every other page builds on: the date format, modes, who owns the value, which months are shown, what slots receive and how ranges are counted.">
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
            { name: "'range'", type: '{ start, end }', description: 'Two clicks: start, then end. Ranges can be exclusive (stays) or inclusive (days).' },
            { name: "'multiple'", type: 'readonly CalendarDate[]', description: 'Any number of separate dates (limit with maxSelections).' },
            { name: "'readonly'", type: '—', description: 'Shows availability; nothing can be selected.' },
          ]}
        />
        <p>
          The value type follows the mode, so <code>onChange</code> is typed for it. See <a href="#/selection-modes">Selection modes</a> for live examples.
        </p>
      </Section>
      <Section title="Uncontrolled">
        <p>
          Uncontrolled means the calendar keeps the value: you pass a starting value (for example <code>defaultValue=&#123;addDays(today, 3)&#125;</code>),
          the user changes it, and the calendar stores the change itself. <code>defaultValue</code> is read once, on mount; later changes are ignored (use{' '}
          <code>value</code>, or <code>ref.reset()</code> to return to it). Changing <code>mode</code> starts from the new mode&apos;s empty value, without an{' '}
          <code>onChange</code> call.
        </p>
        <Example src="concepts/Uncontrolled" title="Uncontrolled calendar" />
      </Section>
      <Section title="Controlled">
        <p>
          Controlled means you keep the value: you pass <code>value</code> from your state and update that state in <code>onChange</code> (for example{' '}
          <code>value=&#123;range&#125;</code> and <code>onChange=&#123;setRange&#125;</code>). Your state is the source of truth: the calendar shows exactly{' '}
          <code>value</code>; setting it from outside (a button, a URL, another
          calendar) never calls <code>onChange</code> back. Use controlled mode whenever other UI depends on the selection.
        </p>
        <Example src="concepts/Controlled" title="Controlled calendar" />
      </Section>
      <Section title="Reference month">
        <p>
          The reference month is the month the calendar uses as the base for deciding which months to show. It is chosen in this order:{' '}
          <code>visibleMonth</code> (controlled) or <code>defaultVisibleMonth</code>; otherwise the month of the selection; otherwise today&apos;s month. When
          today is not given, the default month is fixed from the first known today; a later midnight only moves the today marker.
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
          <code>getSelectionPhase(selection)</code> (also <code>ctx.phase</code> in slots) is <code>empty</code>, <code>start-selected</code> (a range waiting for
          its end) or <code>complete</code>. In range mode, <code>activeEndpoint</code> tells which end the next click sets; it can be controlled and shared
          between calendars.
        </p>
      </Section>
      <Section title="Slot context">
        <p>
          Slots such as <code>renderHeader</code> and <code>renderFooter</code> receive the calendar&apos;s current state as <code>ctx</code> (type{' '}
          <code>SlotContext</code>). The most used fields: <code>ctx.selection</code> (the value, with its <code>mode</code>), <code>ctx.phase</code>,{' '}
          <code>ctx.validation</code>, <code>ctx.visibleMonths</code>, <code>ctx.today</code>, <code>ctx.formatDate</code> (formats in the calendar&apos;s locale)
          and <code>ctx.actions</code>, the calendar&apos;s controller (<code>clear()</code>, <code>goToMonth(month)</code>, <code>select(value)</code>, …). A slot
          can therefore show and change the selection without any state in your app.
        </p>
        <Example src="concepts/SlotContext" title="Footer built from ctx" />
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
          A range stores only two dates; <code>rangeSemantics</code> decides what they mean. The adapters set it for you: <code>stayRules</code> is{' '}
          <strong>exclusive</strong> (the end is the check-out day and is not included: 13 → 16 November is 3 nights), <code>dayRangeRules</code> is{' '}
          <strong>inclusive</strong> (every day counts: 13 → 16 November is 4 days). Count with <code>countNights</code> and <code>countDays</code>; list the
          counted days with <code>getIncludedDays(range, semantics)</code>.
        </p>
        <Example src="concepts/RangeSemantics" title="Nights and days" />
      </Section>
      <Section title="Same-day ranges">
        <p>
          Inclusive ranges allow <code>start === end</code> by default (a one-day ticket). Exclusive ranges do not, because such a stay has 0 nights; enable it
          with <code>allowSameDay</code> (day use).
        </p>
        <Note>
          <p>
            A same-day exclusive range has length 0, so <code>allowSameDay</code> cannot be combined with a minimum of 1 or more nights: with{' '}
            <code>minNights: 1</code> day use is still rejected.
          </p>
        </Note>
        <Example src="concepts/SameDay" title="Day use" />
      </Section>
    </Page>
  );
}
