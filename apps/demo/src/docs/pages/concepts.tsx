import { Example } from '../Code';
import { Note, Page, PropsTable, Section } from '../ui';

export function CoreConcepts() {
  return (
    <Page title="Core Concepts" lead="The few ideas every other page builds on: the date format, modes, who owns the value, where the calendar starts and how ranges are counted.">
      <Section title="Date format">
        <p>
          <code>CalendarDate</code> is a branded <code>&quot;YYYY-MM-DD&quot;</code> string and <code>CalendarMonth</code> a <code>&quot;YYYY-MM&quot;</code> string.
          Create them with <code>toCalendarDate(&apos;2026-11-13&apos;)</code> (throws on invalid input), <code>parseDate</code> (returns <code>null</code>),{' '}
          <code>fromJSDate(date)</code> or <code>getToday(&#123; timeZone &#125;)</code>. Plain strings are rejected by the types, so invalid dates do not slip
          in. Arithmetic helpers (<code>addDays</code>, <code>addMonths</code>, <code>diffDays</code>, <code>eachDay</code>, …) work on the calendar day only;
          daylight saving changes cannot shift a date.
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
          Give <code>defaultValue</code> and let the calendar keep the selection. <code>defaultValue</code> is read once, on mount; later changes are ignored (use{' '}
          <code>value</code>, or <code>ref.reset()</code> to return to it). Changing <code>mode</code> starts from the new mode&apos;s empty value, without an{' '}
          <code>onChange</code> call.
        </p>
        <Example src="concepts/Uncontrolled" title="Uncontrolled calendar" />
      </Section>
      <Section title="Controlled">
        <p>
          Give <code>value</code> and <code>onChange</code>. The calendar shows exactly <code>value</code>; setting it from outside (a button, a URL, another
          calendar) never calls <code>onChange</code> back. Use controlled mode whenever other UI depends on the selection.
        </p>
        <Example src="concepts/Controlled" title="Controlled calendar" />
      </Section>
      <Section title="Start month">
        <p>
          The <strong>reference month</strong> decides what is shown first: <code>visibleMonth</code> (controlled) or <code>defaultVisibleMonth</code>, otherwise
          the month of the selection, otherwise today&apos;s month. When today is not given, the default month is fixed from the first known today; a later
          midnight only moves the today marker. With several months, <code>monthPosition</code> places the reference month in the window (
          <a href="#/month-position">Reference month position</a>).
        </p>
      </Section>
      <Section title="Selection phase">
        <p>
          <code>getSelectionPhase(selection)</code> (also <code>ctx.phase</code> in slots) is <code>empty</code>, <code>start-selected</code> (a range waiting for
          its end) or <code>complete</code>. In range mode, <code>activeEndpoint</code> tells which end the next click sets; it can be controlled and shared
          between calendars.
        </p>
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
