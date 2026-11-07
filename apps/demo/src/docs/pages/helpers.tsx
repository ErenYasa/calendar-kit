import type { ReactNode } from 'react';
import arithmetic from '../../snippets/helpers/arithmetic.ts?code';
import comparing from '../../snippets/helpers/comparing.ts?code';
import locale from '../../snippets/helpers/locale.ts?code';
import messages from '../../snippets/helpers/messages.ts?code';
import parsing from '../../snippets/helpers/parsing.ts?code';
import parts from '../../snippets/helpers/parts.ts?code';
import ranges from '../../snippets/helpers/ranges.ts?code';
import today from '../../snippets/helpers/today.ts?code';
import { Example, Snippet } from '../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../ui';

/** One exported function: heading, real signature, behaviour. */
function Fn({ name, sig, children }: { name: string; sig: string; children: ReactNode }) {
  return (
    <>
      <h3 id={`fn-${name}`}>
        <code>{name}</code>
      </h3>
      <pre className="docs-pre docs-type-block">{sig}</pre>
      {children}
    </>
  );
}

const IMPORT = (
  <p>
    Import from <code>calendar-kit/core</code> (React-free, safe in Server Components and plain Node) or from <code>calendar-kit</code>; both export the same
    functions.
  </p>
);

export function DateHelpers() {
  return (
    <Page
      title="Date helpers"
      lead="Pure functions for the calendar's date model: parse and validate input, do day and month arithmetic, compare, read parts, get today in a time zone and measure ranges. None of them render anything or depend on the host time zone."
    >
      <Section title="The date model">
        <p>
          A day is a <code>CalendarDate</code>: a string in <code>YYYY-MM-DD</code> form that has been checked to be a real Gregorian date. A month is a{' '}
          <code>CalendarMonth</code> in <code>YYYY-MM</code> form. Both are branded string types, so a plain <code>string</code> must go through a parser
          below before TypeScript accepts it, while a <code>CalendarDate</code> can be used anywhere a string is expected (JSON, URLs, map keys,{' '}
          <code>&lt;</code>/<code>&gt;</code> comparison).
        </p>
        <p>
          All arithmetic converts the date to an integer day number and back, so results never depend on the host time zone or daylight saving time, and{' '}
          <code>new Date(string)</code> is never used for parsing. Valid years are 0001 to 9999.
        </p>
        <PropsTable
          caption="Types"
          rows={[
            { name: 'CalendarDate', type: 'string & { brand }', description: <>A validated day, <code>"2026-11-13"</code>. No time, no zone.</> },
            { name: 'CalendarMonth', type: 'string & { brand }', description: <>A validated month, <code>"2026-11"</code>.</> },
            { name: 'Weekday', type: '0 | 1 | 2 | 3 | 4 | 5 | 6', description: <>0 = Sunday … 6 = Saturday, the same numbering as <code>Date#getDay</code>.</> },
            { name: 'DateParts', type: '{ year: number; month: number; day: number }', description: 'Numeric parts; month is 1–12, day 1–31.' },
          ]}
        />
        {IMPORT}
        <Note>
          <p>
            Functions that take a <code>CalendarDate</code> trust it and do not re-validate. Values cast with <code>as CalendarDate</code> instead of parsed
            give meaningless results. Arithmetic that crosses the year limits is not checked either: <code>addDays</code> past 9999-12-31 returns a string such
            as <code>"10000-01-01"</code> that no parser would accept; the result outside 0001–9999 is undefined. Stay inside the supported years.
            (<code>addMonths</code> and <code>addMonthsToMonth</code> clamp instead, see below.)
          </p>
        </Note>
      </Section>

      <Section title="Parsing and validation">
        <p>Use these at the edges of your app (URL parameters, form fields, API responses, literals) to turn strings or numbers into dates.</p>
        <DataTable
          caption="Which parser to use"
          head={['Function', 'Input', 'Invalid input', 'Use it for']}
          rows={[
            [<code key="a">parseDate</code>, 'unknown', <code key="b">null</code>, 'Untrusted values of any type.'],
            [<code key="a">isCalendarDate</code>, 'unknown', <code key="b">false</code>, 'The same check as a type guard in conditions.'],
            [<code key="a">toCalendarDate</code>, 'string', 'throws RangeError', 'Literals and values that must be valid (fail loudly).'],
            [<code key="a">createDate</code>, 'year, month, day numbers', <code key="b">null</code>, 'Building a date from numeric fields.'],
          ]}
        />
        <Fn name="parseDate" sig="function parseDate(input: unknown): CalendarDate | null">
          <p>
            Strictly parses <code>YYYY-MM-DD</code>. Returns the date when <code>input</code> is a string of exactly four year digits, two month digits and two
            day digits that names a real day between 0001-01-01 and 9999-12-31; otherwise <code>null</code>. Non-strings, unpadded parts (
            <code>2026-1-5</code>), times or zones (<code>2026-11-13T10:00Z</code>), surrounding spaces, impossible days (<code>2026-02-30</code>) and year
            0000 are all rejected. It never throws.
          </p>
        </Fn>
        <Fn name="isCalendarDate" sig="function isCalendarDate(input: unknown): input is CalendarDate">
          <p>
            Returns <code>true</code> exactly when <code>parseDate(input)</code> would return a date, and narrows <code>input</code> to{' '}
            <code>CalendarDate</code>. Use it when you want to keep the original value rather than a parsed copy.
          </p>
        </Fn>
        <Fn name="toCalendarDate" sig="function toCalendarDate(input: string): CalendarDate">
          <p>
            Same rules as <code>parseDate</code>, but returns the date directly and throws a <code>RangeError</code> (
            <code>Invalid calendar date "…" (expected YYYY-MM-DD)</code>) for invalid input. Handy for literals in code, tests and props such as{' '}
            <code>minDate={'{'}toCalendarDate('2026-12-01'){'}'}</code>; do not use it on user input unless you catch the error.
          </p>
        </Fn>
        <Fn name="createDate" sig="function createDate(year: number, month: number, day: number): CalendarDate | null">
          <p>
            Builds a date from numbers; <code>month</code> is 1–12 (not 0–11 like <code>Date</code>). Returns <code>null</code> when any part is not an
            integer, the year is outside 1–9999, or the day does not exist in that month (29 February in a non-leap year). It does not roll over: day 32 is{' '}
            <code>null</code>, not the 1st of the next month.
          </p>
        </Fn>
        <Fn name="parseMonth" sig="function parseMonth(input: unknown): CalendarMonth | null">
          <p>
            Parses a month. Accepts <code>YYYY-MM</code>, or a full valid <code>YYYY-MM-DD</code> whose day is dropped. Returns <code>null</code> for
            non-strings, months outside 01–12, years outside 0001–9999 and for full dates that are not valid days.
          </p>
        </Fn>
        <Fn name="toCalendarMonth" sig="function toCalendarMonth(input: string): CalendarMonth">
          <p>
            Like <code>parseMonth</code> but throws a <code>RangeError</code> (<code>Invalid calendar month "…" (expected YYYY-MM)</code>) instead of returning{' '}
            <code>null</code>.
          </p>
        </Fn>
        <Fn name="createMonth" sig="function createMonth(year: number, month: number): CalendarMonth | null">
          <p>
            Builds a month from numbers (month 1–12). Returns <code>null</code> for non-integers, years outside 1–9999 or months outside 1–12.
          </p>
        </Fn>
        <Snippet files={parsing} label="Parsing and validation" />
      </Section>

      <Section title="Arithmetic">
        <Fn name="addDays" sig="function addDays(date: CalendarDate, amount: number): CalendarDate">
          <p>
            Returns the day <code>amount</code> days after <code>date</code> (before it when negative). Month and year boundaries are handled; DST cannot
            make a day go missing or repeat. A fractional <code>amount</code> is truncated toward zero (<code>1.5</code> → 1, <code>-1.5</code> → −1).
          </p>
        </Fn>
        <Fn name="addMonths" sig="function addMonths(date: CalendarDate, amount: number): CalendarDate">
          <p>
            Moves a date by whole months (a fractional <code>amount</code> is truncated toward zero) and keeps the day of month when it exists. When it does not, the day is clamped to the last day of the target month:
            31 January + 1 month is 28 February (29 in a leap year). Clamping is not undone later, so adding one month twice to 31 January gives 28 March,
            not 31 March; add the total in one call when that matters. Results never leave 0001–9999: a move past either end stops at the first or last
            month.
          </p>
        </Fn>
        <Fn name="addMonthsToMonth" sig="function addMonthsToMonth(month: CalendarMonth, amount: number): CalendarMonth">
          <p>
            The month equivalent of <code>addMonths</code>, for navigation and month lists where there is no day to clamp. Fractional amounts are
            truncated toward zero. Results are kept within
            0001-01 to 9999-12 (for example <code>9999-12</code> + 1 stays <code>9999-12</code>).
          </p>
        </Fn>
        <Fn name="diffDays" sig="function diffDays(a: CalendarDate, b: CalendarDate): number">
          <p>
            Number of calendar days from <code>a</code> to <code>b</code>, i.e. <code>b − a</code>: positive when <code>b</code> is later, negative when
            earlier, 0 for the same day. It counts day boundaries, not 24-hour periods, so a DST change in between makes no difference.
          </p>
        </Fn>
        <Fn name="diffMonths" sig="function diffMonths(a: CalendarMonth, b: CalendarMonth): number">
          <p>
            Number of months from <code>a</code> to <code>b</code> (<code>b − a</code>). It takes months, not dates: pass <code>getMonth(date)</code> to ask
            how many month pages apart two dates are. Days are not considered, so 31 January and 1 February are one month apart.
          </p>
        </Fn>
        <Fn name="eachDay" sig="function eachDay(start: CalendarDate, end: CalendarDate): CalendarDate[]">
          <p>
            Every date from <code>start</code> to <code>end</code> with both ends included, in order. Returns an empty array when <code>end</code> is before{' '}
            <code>start</code> and a single date when they are equal. For the days a selected range counts (which depends on nights vs days), use{' '}
<code>getIncludedDays</code>.
          </p>
        </Fn>
        <Fn name="eachMonth" sig="function eachMonth(start: CalendarMonth, count: number): CalendarMonth[]">
          <p>
            <code>count</code> consecutive months starting with <code>start</code>. Unlike <code>eachDay</code> it takes a length rather than an end; a count
            of 0 or less returns an empty array.
          </p>
        </Fn>
        <Fn name="clampDate" sig="function clampDate(date: CalendarDate, min?: CalendarDate | null, max?: CalendarDate | null): CalendarDate">
          <p>
            Returns <code>min</code> when <code>date</code> is before it, <code>max</code> when after it, otherwise <code>date</code>. A missing or{' '}
            <code>null</code> bound is ignored. The minimum is checked first, so with <code>min</code> after <code>max</code> an early date returns{' '}
            <code>min</code>. Useful to keep an initial month or a focused day inside <code>minDate</code>/<code>maxDate</code>.
          </p>
        </Fn>
        <Snippet files={arithmetic} label="Arithmetic" />
      </Section>

      <Section title="Comparing">
        <p>
          Because dates are zero-padded ISO strings, string order is chronological order; these functions only make the intent explicit and work as sort
          comparators.
        </p>
        <Fn name="compareDates" sig="function compareDates(a: CalendarDate, b: CalendarDate): number">
          <p>
            Returns <code>-1</code> when <code>a</code> is earlier, <code>1</code> when later, <code>0</code> when equal. Pass it to{' '}
            <code>Array#sort</code> to sort dates ascending.
          </p>
        </Fn>
        <Fn name="isBefore" sig="const isBefore: (a: CalendarDate, b: CalendarDate) => boolean">
          <p>
            <code>true</code> when <code>a</code> is strictly earlier than <code>b</code>; the same day gives <code>false</code>.
          </p>
        </Fn>
        <Fn name="isAfter" sig="const isAfter: (a: CalendarDate, b: CalendarDate) => boolean">
          <p>
            <code>true</code> when <code>a</code> is strictly later than <code>b</code>; the same day gives <code>false</code>.
          </p>
        </Fn>
        <Fn name="isSameDate" sig="const isSameDate: (a: CalendarDate | null | undefined, b: CalendarDate | null | undefined) => boolean">
          <p>
            <code>true</code> when both are the same date. Accepts <code>null</code>/<code>undefined</code> so you can pass selection values directly; two
            empty values are <em>not</em> the same date (<code>false</code>).
          </p>
        </Fn>
        <Fn name="isWithin" sig="function isWithin(date: CalendarDate, start: CalendarDate, end: CalendarDate): boolean">
          <p>
            <code>true</code> when <code>start ≤ date ≤ end</code>; both bounds are included. It does not reorder the bounds: with <code>end</code> before{' '}
            <code>start</code> the result is always <code>false</code>. For a stay where the check-out day is not part of the stay, test against{' '}
            <code>addDays(end, -1)</code> or use <code>getIncludedDays</code>.
          </p>
        </Fn>
        <Snippet files={comparing} label="Comparing" />
      </Section>

      <Section title="Parts and month boundaries">
        <Fn name="getDateParts" sig="function getDateParts(date: CalendarDate): DateParts">
          <p>
            Splits a date into numbers: <code>{'{ year, month, day }'}</code> with month 1–12. The inverse of <code>createDate</code>.
          </p>
        </Fn>
        <Fn name="getWeekday" sig="function getWeekday(date: CalendarDate): Weekday">
          <p>
            Day of the week, 0 = Sunday … 6 = Saturday, computed from the date alone (no <code>Date</code>, no zone). This is the numbering used by{' '}
            <code>firstDayOfWeek</code> and the weekday rules.
          </p>
        </Fn>
        <Fn name="getMonth" sig="function getMonth(date: CalendarDate): CalendarMonth">
          <p>
            The month a date belongs to, as a <code>CalendarMonth</code> string (<code>"2026-11"</code>). Use it to pass a date to month functions or to
            group dates by month.
          </p>
        </Fn>
        <Fn name="getMonthParts" sig="function getMonthParts(month: CalendarMonth): { year: number; month: number }">
          <p>
            Splits a month into numbers. Unlike <code>getMonth</code>, which goes from a date to a month string, this goes from a month string to numbers.
          </p>
        </Fn>
        <Fn name="firstDayOfMonth" sig="function firstDayOfMonth(month: CalendarMonth): CalendarDate">
          <p>The 1st of the month as a date.</p>
        </Fn>
        <Fn name="lastDayOfMonth" sig="function lastDayOfMonth(month: CalendarMonth): CalendarDate">
          <p>
            The last day of the month as a date, taking leap years into account. Together with <code>firstDayOfMonth</code> and <code>eachDay</code> it lists
            a month&apos;s days, e.g. to build per-month availability data.
          </p>
        </Fn>
        <Fn name="daysInMonth" sig="function daysInMonth(year: number, month: number): number">
          <p>
            Length of a month (28–31) from plain numbers, month 1–12. It does not validate its arguments; use <code>lastDayOfMonth</code> when you already
            have a <code>CalendarMonth</code>.
          </p>
        </Fn>
        <Fn name="isLeapYear" sig="function isLeapYear(year: number): boolean">
          <p>Gregorian leap-year rule: divisible by 4, except centuries not divisible by 400 (1900 is not a leap year, 2000 is).</p>
        </Fn>
        <Snippet files={parts} label="Parts and month boundaries" />
      </Section>

      <Section title="Today and JavaScript dates">
        <p>
          A <code>Date</code> is an instant; which calendar day it falls on depends on the time zone. These functions make that choice explicit.
        </p>
        <Fn name="getToday" sig="function getToday(options?: { timeZone?: string; now?: Date | number }): CalendarDate">
          <p>
            The calendar day of the instant <code>now</code> (a <code>Date</code> or epoch milliseconds; default: the current time) as seen in{' '}
            <code>timeZone</code>, an IANA name such as <code>"Europe/Istanbul"</code>. Without a time zone (or with an empty string) the host&apos;s local
            zone is used, which on a server is the server&apos;s zone. Passing both makes the result deterministic, which is what you want for server
            rendering and tests; pass the result to the Calendar&apos;s <code>today</code> prop.
          </p>
          <p>
            An unknown zone name makes <code>Intl.DateTimeFormat</code> throw a <code>RangeError</code>. An invalid <code>now</code> (e.g.{' '}
            <code>NaN</code> or an invalid <code>Date</code>) throws <code>RangeError(&apos;Invalid time value&apos;)</code>, with or without a time zone.
          </p>
        </Fn>
        <Fn name="fromJSDate" sig="function fromJSDate(date: Date, timeZone?: string): CalendarDate">
          <p>
            Converts an existing <code>Date</code> to the calendar day it falls on in <code>timeZone</code> (default: the host&apos;s local zone). It is{' '}
            <code>getToday({'{ now: date, timeZone }'})</code> with a positional signature, and has the same error behaviour. Use it for timestamps from APIs
            or other date pickers; never slice <code>toISOString()</code>, which always gives the UTC day.
          </p>
        </Fn>
        <Fn name="toUTCDate" sig="function toUTCDate(date: CalendarDate): Date">
          <p>
            The opposite direction: a <code>Date</code> at 00:00 UTC on that day (years below 100 are handled correctly). Format it with{' '}
            <code>timeZone: 'UTC'</code>, or the host zone may show the previous day. For display, <code>formatDate</code> on the{' '}
            <a href="#/api-messages">Messages &amp; formatting</a> page already does this.
          </p>
        </Fn>
        <Snippet files={today} label="Today and JavaScript dates" />
      </Section>

      <Section title="Ranges and selection">
        <p>
          A <code>DateRange</code> is <code>{'{ start: CalendarDate | null; end: CalendarDate | null }'}</code>, the value of a range Calendar. What{' '}
          <code>end</code> means depends on <code>RangeSemantics</code>: <code>'exclusive'</code> ranges <code>[start, end)</code> are stays where{' '}
          <code>end</code> is the check-out day (<code>stayRules</code>); <code>'inclusive'</code> ranges <code>[start, end]</code> count every day (
          <code>dayRangeRules</code>, the default). 13 → 20 November is 7 nights or 8 days.
        </p>
        <DataTable
          caption="Range length helpers"
          head={['Function', 'Counts', '13 → 16 Nov', 'Same day', 'Unfinished range']}
          rows={[
            [<code key="a">countNights</code>, 'nights, end excluded', '3', '0', 'null'],
            [<code key="a">countDays</code>, 'days, both ends included', '4', '1', 'null'],
            [<code key="a">getRangeLength</code>, 'either, chosen by semantics', '3 or 4', '0 or 1', 'null'],
          ]}
        />
        <Fn name="countNights" sig="function countNights(range: DateRange): number | null">
          <p>
            Nights in a stay, <code>end − start</code> in days. Returns <code>null</code> while either end is missing, so you can tell “not chosen yet” from 0
            (a same-day range). It does not check the order; an end before the start gives a negative number.
          </p>
        </Fn>
        <Fn name="countDays" sig="function countDays(range: DateRange): number | null">
          <p>
            Days in an inclusive range, <code>end − start + 1</code>. <code>null</code> while either end is missing; not order-checked.
          </p>
        </Fn>
        <Fn name="getRangeLength" sig="function getRangeLength(range: DateRange, semantics: RangeSemantics): number | null">
          <p>
            The length in the unit implied by <code>semantics</code>: nights for <code>'exclusive'</code> (same as <code>countNights</code>), days for{' '}
            <code>'inclusive'</code> (same as <code>countDays</code>). Use it in code that serves both kinds of calendars.
          </p>
        </Fn>
        <Fn name="getIncludedDays" sig="function getIncludedDays(range: DateRange, semantics: RangeSemantics): CalendarDate[]">
          <p>
            The dates a range actually uses, e.g. to sum nightly prices or check availability. Exclusive ranges leave out the end (the check-out day);
            inclusive ranges keep it. An exclusive same-day range (day use) returns that one day, even though it counts as 0 nights. Returns an empty array
            when either end is missing or the end is before the start.
          </p>
        </Fn>
        <Fn name="getSelectionPhase" sig="function getSelectionPhase(selection: Selection): SelectionPhase">
          <p>
            Where a selection stands, given <code>{'{ mode, value }'}</code>: <code>'empty'</code> (nothing selected), <code>'start-selected'</code> (range
            with a start, waiting for an end) or <code>'complete'</code> (a single date, both range ends, or at least one date in multiple mode). Read-only
            selections are always <code>'empty'</code>, and a range with only an end is <code>'empty'</code> too. Useful to enable an “Apply” button or
            choose a hint text.
          </p>
        </Fn>
        <Snippet files={ranges} label="Ranges and selection" />
      </Section>
    </Page>
  );
}

const MESSAGE_KEYS = [
  { name: 'calendar', type: 'string', description: <>Accessible name of the calendar root when no <code>aria-label</code> prop is given.</> },
  { name: 'previousMonth / nextMonth', type: 'string', description: 'Accessible names of the navigation buttons; also passed to a custom navigation slot as its labels.' },
  {
    name: 'loadNext / loadPrevious',
    type: 'string',
    description: (
      <>
        Text of the “load more” buttons in continuous navigation, unless <code>loadMoreLabels</code> is set.
      </>
    ),
  },
  {
    name: 'loading',
    type: 'string',
    description: 'Screen-reader status text while data loads (the days themselves show a skeleton): for the initial load, and per month as “<month title>: <loading>”. Also announced when loading starts and passed to renderLoading.',
  },
  { name: 'error / retry', type: 'string', description: <>Message and button text for a month whose data failed to load (also passed to <code>renderError</code>); <code>error</code> is announced when a month fails.</> },
  { name: 'today', type: 'string', description: "Appended to today's day label for screen readers." },
  { name: 'todayLabel', type: 'string', description: <>Default tooltip on today when <code>highlightToday</code> is on and the day has no other tooltip.</> },
  { name: 'readOnlyNotice', type: 'string', description: <>Caption above a read-only calendar. <code>''</code> hides it.</> },
  { name: 'selected', type: 'string', description: 'Appended to the label of the selected day (single and multiple modes).' },
  { name: 'rangeStart / rangeEnd', type: 'string', description: 'Appended to the labels of the range start and end days.' },
  { name: 'inRange', type: 'string', description: 'Appended to the labels of days between the range ends.' },
  { name: 'unavailable', type: 'string', description: 'Appended to the label of a disabled or unavailable day that has no reason text.' },
  { name: 'announceStart', type: '(date: string) => string', description: 'Announced when a range start is chosen and the end is still open.' },
  { name: 'announceRange', type: '(start: string, end: string) => string', description: 'Announced when a range is complete.' },
  { name: 'announceSingle', type: '(date: string) => string', description: 'Announced when a single date is selected.' },
  { name: 'announceAdded / announceRemoved', type: '(date: string, count: number) => string', description: 'Announced when a date is toggled in multiple mode; count is the new number of selected dates.' },
  { name: 'announceCleared', type: 'string', description: 'Announced when a single or range selection becomes empty.' },
  { name: 'announceRejected', type: '(date: string, reason: string) => string', description: 'Announced when a click or key press is rejected; reason is the formatted issue text.' },
  { name: 'reasons', type: 'Record<ReasonCode, ReasonMessage>', description: 'One function per reason code. The text is the label suffix of a disabled day, its default tooltip (not for past, future, before-min, after-max, invalid-date, data-unknown, data-loading), the reason in announceRejected and the message of invalidSelection events.' },
  { name: 'dayReasons', type: 'Record<string, string>', description: <>Texts for the <code>reason</code> tags of your rules or the adapters (<code>booked</code>, <code>check-out-only</code>, …).</> },
];

export function MessagesReference() {
  return (
    <Page
      title="Messages & formatting"
      lead="Month, weekday and date names come from Intl in the calendar's locale; the calendar's own texts (button names, screen-reader announcements, reasons) come from a message bundle you can replace or partly override."
    >
      <Section title="Locale formatting">
        <p>
          These are the functions the Calendar uses for its titles, headers and labels, exported so your own UI (summaries, inputs, tooltips) matches it.
          The locale is any BCP 47 tag; <code>undefined</code> means the runtime default for formatting and <code>en-US</code> for the week and direction
          tables. An invalid locale tag makes <code>Intl</code> throw a <code>RangeError</code>.
        </p>
        <Fn name="formatDate" sig="function formatDate(date: CalendarDate, locale: string | undefined, options: Intl.DateTimeFormatOptions): string">
          <p>
            Formats a date with <code>Intl.DateTimeFormat</code>. <code>options</code> is required (pass <code>{'{}'}</code> for the locale&apos;s default
            numeric form). The date is formatted from UTC midnight with <code>timeZone: 'UTC'</code> forced, so the host zone can never shift it to the previous
            day; a <code>timeZone</code> in <code>options</code> is overridden. Formatters are cached per locale and options.
          </p>
        </Fn>
        <Fn
          name="formatMonth"
          sig={`function formatMonth(
  month: CalendarMonth,
  locale: string | undefined,
  options?: Intl.DateTimeFormatOptions, // default { month: 'long', year: 'numeric' }
): string`}
        >
          <p>
            Formats a month by formatting its first day, so it takes a <code>CalendarMonth</code> where <code>formatDate</code> takes a date. Without options
            it gives the month title the Calendar shows (“November 2026”); the Calendar&apos;s <code>monthTitleFormat</code> prop passes other options here.
          </p>
        </Fn>
        <Fn
          name="getWeekdayNames"
          sig={`function getWeekdayNames(
  locale: string | undefined,
  firstDayOfWeek: Weekday,
  format?: 'narrow' | 'short' | 'long', // default 'short'
): { weekday: Weekday; short: string; long: string }[]`}
        >
          <p>
            Seven entries in display order, starting at <code>firstDayOfWeek</code>. <code>short</code> is the name in <code>format</code> (despite its name,
            it is narrow or long when you ask for that); <code>long</code> is always the full name, suitable for <code>abbr</code> titles or screen readers.
          </p>
        </Fn>
        <Fn name="getDefaultFirstDayOfWeek" sig="function getDefaultFirstDayOfWeek(locale: string | undefined): Weekday">
          <p>
            The first day of the week the Calendar uses when <code>firstDayOfWeek</code> is not set: 0 (Sunday) for regions such as US, CA, BR, JP, IL, SA;
            6 (Saturday) for regions such as EG, AE, IR; 1 (Monday) otherwise. The region comes from the tag; a tag without one uses a default region for some
            languages (<code>en</code> → US, <code>ar</code> → EG, <code>he</code> → IL, <code>fa</code> → IR, <code>pt</code> → BR, …), and{' '}
            <code>undefined</code> is treated as <code>en-US</code>. These are built-in tables, not <code>Intl.Locale#weekInfo</code>, so server and browser
            always agree.
          </p>
        </Fn>
        <Fn name="getLocaleDirection" sig="function getLocaleDirection(locale: string | undefined): 'ltr' | 'rtl'">
          <p>
            <code>'rtl'</code> when the language of the tag is written right to left (ar, he, fa, ur, ps, yi, dv, ckb, sd, ug), otherwise{' '}
            <code>'ltr'</code>. Only the language subtag is checked. This is the Calendar&apos;s default for its <code>direction</code> prop.
          </p>
        </Fn>
        <Snippet files={locale} label="Locale formatting" />
      </Section>

      <Section title="Message bundles">
        <p>
          The Calendar always starts from <code>messagesEn</code> and applies its <code>messages</code> prop on top. Changing <code>locale</code> does{' '}
          <em>not</em> change the texts; pass the matching bundle as well. Each bundle is a separate export, so unused ones are tree-shaken.
        </p>
        <DataTable
          caption="Built-in bundles (all of type CalendarMessages)"
          head={['Export', 'Language', 'Coverage']}
          rows={[
            [<code key="a">messagesEn</code>, 'English', 'Complete; the default (the Calendar merges messages over it).'],
            [<code key="a">messagesTr</code>, 'Turkish', 'Complete, including every reason and day reason.'],
            [
              <code key="a">messagesDe, messagesFr, messagesEs, messagesIt, messagesNl, messagesAr</code>,
              'German, French, Spanish, Italian, Dutch, Arabic',
              <>
                Complete: all UI texts and announcements, every reason and every day reason (including <code>start-only</code>, <code>end-only</code> and{' '}
                <code>out-of-schedule</code>), with the language&apos;s plural forms for night and day counts (in Arabic: one, two, 3–10, 11–99 and the rest).
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Overriding messages">
        <p>
          Pass only the keys you want to change. On the Calendar, <code>messages</code> is merged over English; to override a non-English bundle, merge it
          yourself with <code>mergeMessages</code>. In this example, select a start and then the next day, or click a booked day (9th, 18th, 27th).
        </p>
        <Example src="helpers/CustomMessages" title="Custom messages over English and German" />
        <Fn name="mergeMessages" sig="function mergeMessages(base: CalendarMessages, override?: CalendarMessagesInput): CalendarMessages">
          <p>
            Returns a new complete bundle: top-level keys of <code>override</code> replace those of <code>base</code>, while <code>reasons</code> and{' '}
            <code>dayReasons</code> are merged key by key, so overriding one reason keeps all others. Without an override it returns <code>base</code>{' '}
            itself. A key present with the value <code>undefined</code> counts as not listed and keeps the base text, at the top level as well as in{' '}
            <code>reasons</code> and <code>dayReasons</code>. Build the
            result once (module scope or <code>useMemo</code>); the Calendar re-merges whenever the <code>messages</code> object changes identity.
          </p>
        </Fn>
        <PropsTable
          caption="CalendarMessagesInput"
          rows={[
            { name: 'any CalendarMessages key', type: 'same as in CalendarMessages', description: 'Optional; replaces the base value.' },
            { name: 'reasons', type: 'Partial<Record<ReasonCode, ReasonMessage>>', description: 'Only the reason codes to change.' },
            { name: 'dayReasons', type: 'Record<string, string>', description: 'Added to or replacing the base day-reason texts.' },
          ]}
        />
        <Snippet files={messages} label="Merging and formatting messages" />
      </Section>

      <Section title="CalendarMessages keys">
        <p>
          Every key of a bundle and where the Calendar uses it. A day&apos;s accessible label is its formatted date followed by the applicable suffixes,
          separated by commas; dates inside announcements are formatted as “13 November 2026” in the calendar&apos;s locale.
        </p>
        <PropsTable caption="CalendarMessages" rows={MESSAGE_KEYS} />
      </Section>

      <Section title="Reason messages">
        <p>
          When a day is disabled or a selection is rejected, the engine produces a <code>ValidationIssue</code> with a reason <code>code</code>, optional{' '}
          <code>params</code>, the day&apos;s <code>dayReason</code> tag and an optional ready-made <code>message</code>. The Calendar turns it into text with{' '}
          <code>formatIssue</code>. The params a reason message can use:
        </p>
        <DataTable
          caption="Reason params"
          head={['Code', 'params']}
          rows={[
            [<code key="a">before-min / after-max</code>, <code key="b">{'{ min } / { max }'}</code>],
            [<code key="a">past / future</code>, <code key="b">{'{ today }'}</code>],
            [<code key="a">min-length / max-length / fixed-length</code>, <code key="b">{"{ min | max | length, unit: 'nights' | 'days', actual? }"}</code>],
            [<code key="a">end-before-start</code>, <code key="b">{'{ start }'}</code>],
            [<code key="a">max-selections</code>, <code key="b">{'{ max, actual }'}</code>],
            [<code key="a">invalid-date</code>, <code key="b">{"{ value, field?: 'start' | 'end' }"}</code>],
          ]}
        />
        <Fn name="ReasonMessage" sig="type ReasonMessage = (params: IssueParams, f: MessageFormatHelpers) => string">
          <p>
            The type of each <code>reasons</code> entry. <code>params</code> is the issue&apos;s params (an empty object when it has none); dates in params
            are <code>YYYY-MM-DD</code> strings, so format them with <code>f.date</code>.
          </p>
        </Fn>
        <Fn name="MessageFormatHelpers" sig={'interface MessageFormatHelpers {\n  locale: string;\n  date: (value: unknown) => string;\n}'}>
          <p>
            Passed to reason messages. In the Calendar, <code>locale</code> is the calendar&apos;s locale and <code>date</code> formats a valid date string
            as day, long month and year in that locale; any other value is returned as a string (<code>null</code>/<code>undefined</code> as{' '}
            <code>''</code>).
          </p>
        </Fn>
        <Fn
          name="formatIssue"
          sig="function formatIssue(issue: ValidationIssue, messages: CalendarMessages, helpers: MessageFormatHelpers): string"
        >
          <p>Returns the text for an issue, checking in this order:</p>
          <ol>
            <li>
              <code>issue.message</code>, when set (from <code>DayAvailability.message</code> or your <code>validateSelection</code>);
            </li>
            <li>
              for <code>closed</code>, <code>start-not-allowed</code> and <code>end-not-allowed</code> only: <code>messages.dayReasons[issue.dayReason]</code>,
              when that text exists;
            </li>
            <li>
              <code>messages.reasons[issue.code]</code>, or <code>messages.reasons.custom</code> when there is no function for the code.
            </li>
          </ol>
          <p>
            You only need it outside the Calendar, for example to show the issue of <code>onValidationChange</code> in your own UI; you then supply the
            helpers yourself (see the snippet above). Inside the Calendar the same text is already in <code>DayState.reasonText</code> and in the{' '}
            <code>message</code> of <code>invalidSelection</code> events.
          </p>
        </Fn>
      </Section>
    </Page>
  );
}
