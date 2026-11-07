import combineFields from '../../snippets/rules/combine-fields.ts?code';
import combineFunctions from '../../snippets/rules/combine-functions.ts?code';
import counting from '../../snippets/rules/counting.ts?code';
import dayStatuses from '../../snippets/rules/day-statuses.ts?code';
import enginePlan from '../../snippets/rules/engine-plan.ts?code';
import reachableEnd from '../../snippets/rules/reachable-end.ts?code';
import relax from '../../snippets/rules/relax.ts?code';
import serverValidation from '../../snippets/rules/server-validation.ts?code';
import stayStatuses from '../../snippets/rules/stay-statuses.ts?code';
import stayWeekdays from '../../snippets/rules/stay-weekdays.ts?code';
import { Example, Snippet } from '../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../ui';

const yes = 'Yes';
const no = 'No';

export function RulesReference() {
  return (
    <Page
      title="Rules & adapters"
      lead={
        <>
          The React-free selection model: the <code>SelectionRules</code> object, the adapters that build it for stays and day ranges, the functions that combine
          and relax rule sets, and the headless engine that evaluates them. Everything here is exported from <code>calendar-kit/core</code> (and{' '}
          <code>calendar-kit</code>), so the same rules can be checked on the server.
        </>
      }
    >
      <Section title="SelectionRules">
        <p>
          The calendar&apos;s <code>rules</code> prop takes one rule set or an array of them. An array is merged with <code>combineRules</code>; the{' '}
          <code>minDate</code>, <code>maxDate</code>, <code>disablePast</code>, <code>disableFuture</code> and <code>getDataStatus</code> props are added as one
          more set at the end of that list. Every field is optional; an empty object allows every day.
        </p>

        <h3>Bounds</h3>
        <PropsTable
          caption="Bounds"
          rows={[
            {
              name: 'minDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Earliest selectable day (inclusive). An earlier day fails with <code>before-min</code>. The calendar also stops navigating before the month that
                  contains it.
                </>
              ),
            },
            {
              name: 'maxDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Latest selectable day (inclusive); later days fail with <code>after-max</code>. Navigation stops at its month.
                </>
              ),
            },
            {
              name: 'disablePast',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Days before <em>today</em> fail with <code>past</code>. Has no effect while today is unknown (<code>today: null</code> in the engine). Does not
                  limit navigation.
                </>
              ),
            },
            {
              name: 'disableFuture',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Days after today fail with <code>future</code>. Same conditions as <code>disablePast</code>.
                </>
              ),
            },
          ]}
        />
        <p>
          Bound checks apply to every day a selection touches: a start, an end and every day between them. A bound violation on a day inside a range is reported
          as <code>blocked-in-range</code>.
        </p>

        <h3>Range shape</h3>
        <PropsTable
          caption="Range shape"
          rows={[
            {
              name: 'rangeSemantics',
              type: "'inclusive' | 'exclusive'",
              default: "'inclusive'",
              description: (
                <>
                  How the end is counted. <code>inclusive</code>: <code>[start, end]</code>, the end day is part of the booking (13 → 20 = 8 days).{' '}
                  <code>exclusive</code>: <code>[start, end)</code>, the end is a boundary such as a check-out day (13 → 20 = 7 nights). In both cases the start
                  must allow starting, the end must allow ending and every day strictly between them must allow passing through; the semantics changes the length
                  unit, the default of <code>allowSameDay</code> and which days are reported as included (<code>getIncludedDays</code>,{' '}
                  <code>DayState.included</code>).
                </>
              ),
            },
            {
              name: 'allowSameDay',
              type: 'boolean',
              default: 'inclusive: true · exclusive: false',
              description: (
                <>
                  Whether <code>start === end</code> is a valid range. When it is not, clicking the lone start again clears it, and validating such a range gives{' '}
                  <code>same-day</code>. A same-day range needs a day that passes both the start and the end checks (<code>canStart</code>, <code>canEnd</code>,{' '}
                  <code>startWeekdays</code>, <code>endWeekdays</code>). In exclusive semantics a same-day range has length 0,
                  so it is only valid when <code>minLength</code> is unset or 0.
                </>
              ),
            },
            {
              name: 'minLength',
              type: 'number',
              description: (
                <>
                  Shortest range. Measured in nights for exclusive ranges (<code>end − start</code>) and in days for inclusive ranges (<code>end − start + 1</code>
                  ). Shorter ranges fail with <code>min-length</code>, params <code>{'{ min, actual, unit }'}</code>.
                </>
              ),
            },
            {
              name: 'maxLength',
              type: 'number',
              description: (
                <>
                  Longest range, same unit. Longer ranges fail with <code>max-length</code>, params <code>{'{ max, actual, unit }'}</code>. Also caps the
                  reachable-end search.
                </>
              ),
            },
            {
              name: 'fixedLength',
              type: 'number',
              description: (
                <>
                  Exact length, same unit. One click on a start creates the whole range (end = start + N for exclusive, start + N − 1 for inclusive) and validates
                  it at once; any other length fails with <code>fixed-length</code>. It is checked before <code>minLength</code>/<code>maxLength</code>, which
                  still apply, so a fixed length outside them makes every range invalid. Turns off <code>singleDayFirst</code> and the reachable-end search.
                </>
              ),
            },
            {
              name: 'singleDayFirst',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  The first click selects that day alone as a complete range (<code>start === end</code>, next endpoint <code>end</code>). A later click on or
                  after it extends the range; clicking the same lone day clears it; a click before it starts over. Ignored when same-day ranges are not allowed or{' '}
                  <code>fixedLength</code> is set. If the single day itself is not valid (for example under <code>minLength: 2</code>, or on a day that cannot be
                  an end) the click falls back to an ordinary start.
                </>
              ),
            },
          ]}
        />

        <h3>Schedule</h3>
        <PropsTable
          caption="Schedule rules"
          rows={[
            {
              name: 'startWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Weekdays (0 = Sunday … 6 = Saturday) a range, single pick or multiple pick may start on. Other days fail with <code>weekday-start</code>, params{' '}
                  <code>{'{ weekday }'}</code>. Days that are not allowed as starts can still be ends or be passed through.
                </>
              ),
            },
            {
              name: 'endWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Weekdays a range may end on; others fail with <code>weekday-end</code>. Also checked for same-day ranges, whose end is the start day.
                </>
              ),
            },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Weekdays the service operates on. Every other day is closed as a whole (reason <code>out-of-schedule</code>, marked as schedule): it cannot be
                  a start, an end or be crossed. This replaces what <code>getDayAvailability</code> returned for that day unless it was already closed. An empty
                  list closes every day.
                </>
              ),
            },
          ]}
        />
        <p>
          These three fields, the length fields and availability results marked <code>schedule: true</code> are <em>schedule rules</em>: the regular timetable
          rather than real unavailability. The calendar&apos;s <code>relaxSchedule</code> prop (and <code>relaxRules</code>) removes them (see relaxRules below). Days blocked only by the schedule are drawn faded (<code>data-out-of-schedule</code>) instead of struck through.
        </p>

        <h3>Availability and data</h3>
        <PropsTable
          caption="Availability and data"
          rows={[
            {
              name: 'getDayAvailability',
              type: '(date, ctx: RuleContext) => DayAvailability | null | undefined',
              description: (
                <>
                  Per-day selectability. Return nothing for a fully available day. It is called at most once per day for each engine snapshot (the calendar
                  creates one per render), and it receives the current selection in <code>ctx</code>, so availability may depend on the chosen start.
                </>
              ),
            },
            {
              name: 'getDataStatus',
              type: "(month: CalendarMonth) => 'unknown' | 'loading' | 'loaded' | 'error'",
              default: "every month 'loaded'",
              description: (
                <>
                  Load state of your availability data per month. When both the rules and the calendar prop define it, the worse status wins (see{' '}
                  <code>combineRules</code>).
                </>
              ),
            },
            {
              name: 'unknownDataPolicy',
              type: "'block' | 'allow'",
              default: "'block'",
              description: (
                <>
                  <code>block</code>: a day in a month that is not <code>loaded</code> fails with <code>data-unknown</code>, <code>data-loading</code> or{' '}
                  <code>data-error</code> — as a start, an end and inside a range. <code>allow</code>: the data status is ignored by validation.
                </>
              ),
            },
          ]}
        />

        <h3>Validation</h3>
        <PropsTable
          caption="Validation"
          rows={[
            {
              name: 'validateSelection',
              type: '(selection, ctx: RuleContext) => ValidationIssue | null | undefined',
              description: (
                <>
                  Your own rule. Runs only after every built-in check has passed, for each proposed selection: clicks and keys (also when a range start is placed,
                  so it sees <code>{'{ start, end: null }'}</code>), <code>ref.select()</code>, and revalidation when rules, data or <code>ruleContext</code>{' '}
                  change. It is not called for deselecting actions (clearing a range, toggling a date off). A returned issue without <code>code</code> gets{' '}
                  <code>custom</code>; its <code>message</code> is shown as is.
                </>
              ),
            },
            {
              name: 'maxSelections',
              type: 'number',
              description: (
                <>
                  Multiple mode only: the most distinct dates. The value is treated as a set, so a duplicated date counts once. Adding one more fails with{' '}
                  <code>max-selections</code>, params <code>{'{ max, actual }'}</code>.
                </>
              ),
            },
            {
              name: 'requireReachableEnd',
              type: 'boolean',
              default: 'false (true in both adapters)',
              description: (
                <>
                  Range mode only: a start is rejected when no valid end can follow it, for example when the next night is booked under a 2-night minimum. See
                  the search rules below.
                </>
              ),
            },
          ]}
        />
        <h3>How the reachable-end search decides</h3>
        <p>
          For a candidate start, the engine tries ends from the shortest allowed length upward: <code>minLength</code>, or 1 night / 1 day when same-day ranges
          are not allowed. It looks at no more than 63 end candidates and never past <code>maxLength</code>. The first fully valid end makes the start
          acceptable. The search stops early, proving that no later end can work, when a day inside the range is blocked, or a candidate end passes{' '}
          <code>maxDate</code>, the future limit or a month without loaded data. A start is rejected only when that proof exists or every candidate up to{' '}
          <code>maxLength</code> failed. When the 63 candidates run out first, the start stays selectable and its end is validated when it is picked.
        </p>
        <p>
          The rejection reports the bound or data issue when that ended the search. Otherwise it reports <code>min-length</code> on the start (with the{' '}
          <code>dayReason</code> of the last failure) only when the minimum is what blocks: a <code>minLength</code> above the natural one (1 night / 1 day) is
          configured and a shorter end would be valid without the length rule. In every other case the last candidate&apos;s issue is reported, so a start
          with no possible check-out after it gets e.g. <code>end-not-allowed</code>, not “Minimum N”. The search is skipped when <code>fixedLength</code> is set (a fixed range is validated as a whole instead) and it is not part of{' '}
          <code>validate()</code>.
        </p>
        <Snippet files={reachableEnd} label="requireReachableEnd" />

        <h3>DayAvailability</h3>
        <PropsTable
          caption="DayAvailability (returned by getDayAvailability)"
          rows={[
            {
              name: 'closed',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Nothing is possible on this day. Overrides the three flags below: a closed day cannot start, end or be crossed whatever they say. Fails with{' '}
                  <code>closed</code>.
                </>
              ),
            },
            {
              name: 'canStart',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Can be a range start, a single pick or a multiple pick. <code>false</code> fails with <code>start-not-allowed</code>.
                </>
              ),
            },
            {
              name: 'canEnd',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Can be a range end (also required of a same-day range). <code>false</code> fails with <code>end-not-allowed</code>.
                </>
              ),
            },
            {
              name: 'canPassThrough',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Can lie strictly between start and end. <code>false</code> makes any range across it fail with <code>blocked-in-range</code> on this date.
                </>
              ),
            },
            {
              name: 'reason',
              type: 'string',
              description: (
                <>
                  Your tag for the restriction (e.g. <code>check-out-only</code>). Copied to <code>ValidationIssue.dayReason</code>; for day-related issues the
                  default text comes from <code>messages.dayReasons[reason]</code> when that exists.
                </>
              ),
            },
            {
              name: 'message',
              type: 'string',
              description: <>Ready-made text. Copied to the issue&apos;s <code>message</code>, which tooltips and announcements prefer over any translation.</>,
            },
            {
              name: 'schedule',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  The restriction comes from the timetable, not from real unavailability. Relaxing the schedule ignores this whole result, so mark only results
                  that are purely schedule.
                </>
              ),
            },
          ]}
        />

        <h3>RuleContext</h3>
        <PropsTable
          caption="RuleContext (ctx of getDayAvailability and validateSelection)"
          rows={[
            { name: 'mode', type: "'single' | 'range' | 'multiple' | 'readonly'", description: 'The selection mode.' },
            {
              name: 'selection',
              type: 'Selection',
              description: (
                <>
                  The selection (<code>{'{ mode, value }'}</code>) of the engine snapshot; during a click it is the state before the click. In{' '}
                  <code>validateSelection</code>, use the first argument for the selection being proposed.
                </>
              ),
            },
            { name: 'activeEndpoint', type: "'start' | 'end'", description: 'Which end of a range the next activation sets.' },
            { name: 'today', type: 'CalendarDate | null', description: 'The calendar’s today (or the engine’s today input).' },
            {
              name: 'context',
              type: 'TContext',
              description: (
                <>
                  Your own data: the calendar&apos;s <code>ruleContext</code> prop (e.g. party size, chosen times). A change creates a new snapshot and
                  revalidates the selection.
                </>
              ),
            },
          ]}
        />

        <h3>Validation order</h3>
        <p>Checks run in this order and the first failure is the reported issue:</p>
        <ol>
          <li>
            Ranges: <code>end-before-start</code>.
          </li>
          <li>
            The start (or the single / each multiple date): <code>before-min</code>, <code>after-max</code>, <code>past</code>, <code>future</code>, data status,
            then <code>closed</code>, <code>start-not-allowed</code>, <code>weekday-start</code>.
          </li>
          <li>
            <code>same-day</code> when same-day ranges are not allowed.
          </li>
          <li>
            The end: the same day checks, then <code>closed</code>, <code>end-not-allowed</code>, <code>weekday-end</code>.
          </li>
          <li>
            Length: <code>fixed-length</code>, <code>min-length</code>, <code>max-length</code>.
          </li>
          <li>
            The days strictly between, from the start forward: the first blocked day gives <code>blocked-in-range</code> (or its <code>data-*</code> code).
          </li>
          <li>
            Multiple mode: <code>max-selections</code>.
          </li>
          <li>
            <code>validateSelection</code>.
          </li>
        </ol>
        <p>
          Unparseable values in <code>validate()</code> give <code>invalid-date</code> (params <code>{'{ field, value }'}</code> for ranges). Issues carry{' '}
          <code>code</code>, the offending <code>date</code>, <code>params</code> for message templates, the day&apos;s <code>dayReason</code> and{' '}
          <code>message</code> when present.
        </p>
      </Section>

      <Section title="stayRules">
        <p>
          <code>stayRules(options)</code> describes overnight stays. A stay is <code>[check-in, check-out)</code>: the end the guest picks is the check-out day,
          which is drawn as part of the range but is not a night. Every night of the stay is validated; the check-out day only needs to allow departures. The
          adapter always sets exclusive semantics and turns on <code>requireReachableEnd</code>.
        </p>
        <Snippet files={counting} label="Counting nights and days" />
        <PropsTable
          caption="stayRules options"
          rows={[
            {
              name: 'minNights',
              type: 'number',
              description: (
                <>
                  Shortest stay in nights; becomes <code>minLength</code>. Also used by the reachable-end search, so a check-in whose only possible stays are too
                  short is disabled (reported as <code>min-length</code>).
                </>
              ),
            },
            { name: 'maxNights', type: 'number', description: <>Longest stay in nights; becomes <code>maxLength</code>.</> },
            {
              name: 'fixedNights',
              type: 'number',
              description: (
                <>
                  Every stay is exactly this long; clicking a check-in day selects the whole stay. Becomes <code>fixedLength</code>.
                </>
              ),
            },
            {
              name: 'allowSameDay',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Allows check-in and check-out on the same day (day use, 0 nights). Leave <code>minNights</code> unset or 0, otherwise the 0-night stay fails
                  the minimum. Times of day stay in your app.
                </>
              ),
            },
            {
              name: 'checkInWeekdays',
              type: 'readonly Weekday[]',
              description: <>Weekdays guests may arrive on (schedule rule, <code>weekday-start</code>).</>,
            },
            {
              name: 'checkOutWeekdays',
              type: 'readonly Weekday[]',
              description: <>Weekdays guests may leave on (schedule rule, <code>weekday-end</code>).</>,
            },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Weekdays with service (schedule rule). Nights on other weekdays cannot be booked: no check-in (<code>start-not-allowed</code>) and no night
                  inside a stay (<code>blocked-in-range</code>), reason <code>out-of-schedule</code>. The morning after the last available night is still a valid
                  check-out, so <code>[5, 6]</code> allows Friday → Sunday. Unlike <code>SelectionRules.availableWeekdays</code>, which closes the whole day.
                </>
              ),
            },
            {
              name: 'getDayStatus',
              type: '(date, ctx) => StayDayStatus | null | undefined',
              description: (
                <>
                  Status of the <em>night that starts</em> on <code>date</code> (date → date + 1); nothing means <code>available</code>. For a booked night it is
                  also called for the previous date.
                </>
              ),
            },
            {
              name: 'minDate, maxDate, disablePast, disableFuture',
              type: 'see SelectionRules',
              description: 'Passed through unchanged.',
            },
            {
              name: 'getDataStatus, unknownDataPolicy, validateSelection',
              type: 'see SelectionRules',
              description: (
                <>
                  Passed through unchanged. Other <code>SelectionRules</code> fields (<code>getDayAvailability</code>, <code>maxSelections</code>, …) are not
                  options; add them with <code>combineRules</code>.
                </>
              ),
            },
          ]}
        />
        <h3>Stay statuses</h3>
        <p>
          A status is translated into availability for that date. Because the date is the night&apos;s start, the same day is the morning of the previous
          night: the first booked night of a run can still be someone&apos;s check-out day.
        </p>
        <DataTable
          caption="Effect of each StayDayStatus on its date"
          head={['Status', 'Check-in', 'Check-out', 'Night inside a stay', 'Reason tag']}
          rows={[
            [<code key="s">available</code>, yes, yes, yes, '—'],
            [<code key="s">check-in-only</code>, yes, no, yes, <code key="r">check-in-only</code>],
            [<code key="s">check-out-only</code>, no, yes, no, <code key="r">check-out-only</code>],
            [
              <>
                <code>booked</code>, previous night <code>available</code> or <code>check-in-only</code>
              </>,
              no,
              yes,
              no,
              <code key="r">check-out-only</code>,
            ],
            [
              <>
                <code>booked</code>, previous night <code>booked</code>, <code>closed</code> or <code>check-out-only</code>
              </>,
              no,
              no,
              no,
              <code key="r">booked</code>,
            ],
            [<code key="s">closed</code>, no, no, no, <code key="r">closed</code>],
          ]}
        />
        <p>
          The tags (type <code>StayReason</code>) end up in <code>ValidationIssue.dayReason</code> and are translated by <code>messages.dayReasons</code>. Note
          that the first booked morning is tagged <code>check-out-only</code>, not <code>booked</code>. Try it below: check out on the first booked morning, try
          to stay across it, or end on an “In only” day.
        </p>
        <Example src="rules/StayStatuses" title="Stay statuses" />
        <Snippet files={stayStatuses} label="Stay statuses, checked by the engine" />
        <p>
          <code>availableWeekdays</code> restricts nights, not days. With <code>availableWeekdays: [5, 6]</code> (Friday and Saturday nights) a Friday → Sunday
          stay is valid because Sunday is only the check-out morning; a stay that includes the Sunday night, or starts on it, is rejected. The restriction is
          a schedule rule, so <code>relaxRules</code> and the <code>relaxSchedule</code> prop remove it.
        </p>
        <Snippet files={stayWeekdays} label="availableWeekdays and check-out days" />
      </Section>

      <Section title="dayRangeRules">
        <p>
          <code>dayRangeRules(options)</code> describes day-based bookings (boat days, multi-day events, rentals): <code>[start, end]</code>, every day from start
          to end is part of the booking, so 13 → 20 is 8 days (<code>countDays</code>). Picking the same day twice is a valid 1-day range — the adapter always
          allows same-day ranges; use <code>minDays: 2</code> to forbid them. Inclusive semantics and <code>requireReachableEnd</code> are always on.
        </p>
        <PropsTable
          caption="dayRangeRules options"
          rows={[
            { name: 'minDays', type: 'number', description: <>Fewest days, both ends counted; becomes <code>minLength</code>.</> },
            { name: 'maxDays', type: 'number', description: <>Most days; becomes <code>maxLength</code>.</> },
            {
              name: 'fixedDays',
              type: 'number',
              description: (
                <>
                  Every booking is exactly this many days; one click selects all of them (end = start + N − 1). Becomes <code>fixedLength</code>.
                </>
              ),
            },
            { name: 'startWeekdays', type: 'readonly Weekday[]', description: <>Weekdays a booking may begin on (schedule rule).</> },
            { name: 'endWeekdays', type: 'readonly Weekday[]', description: <>Weekdays a booking may end on (schedule rule).</> },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: <>Operating weekdays, e.g. weekends only <code>[6, 0]</code>. Other days are closed and cannot be inside a booking.</>,
            },
            {
              name: 'singleDayFirst',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  First click books that one day, a later click on or after it extends the booking (see <code>SelectionRules.singleDayFirst</code>).
                </>
              ),
            },
            {
              name: 'getDayStatus',
              type: '(date, ctx) => DayRangeStatus | null | undefined',
              description: <>Status of the whole day; nothing means <code>available</code>.</>,
            },
            {
              name: 'minDate, maxDate, disablePast, disableFuture, getDataStatus, unknownDataPolicy, validateSelection',
              type: 'see SelectionRules',
              description: 'Passed through unchanged.',
            },
          ]}
        />
        <DataTable
          caption="Effect of each DayRangeStatus"
          head={['Status', 'Start', 'End', 'Inside a range', 'One-day range', 'Reason tag']}
          rows={[
            [<code key="s">available</code>, yes, yes, yes, yes, '—'],
            [<code key="s">start-only</code>, yes, no, no, no, <code key="r">start-only</code>],
            [<code key="s">end-only</code>, no, yes, no, no, <code key="r">end-only</code>],
            [<code key="s">closed</code>, no, no, no, no, <code key="r">closed</code>],
          ]}
        />
        <p>
          A one-day range needs a day that can both start and end, so <code>start-only</code> and <code>end-only</code> days cannot be booked alone (with{' '}
          <code>singleDayFirst</code> the click on such a day just places a start).
        </p>
        <Example src="rules/DayRangeStatuses" title="Start-only and end-only days" />
        <Snippet files={dayStatuses} label="Day statuses, checked by the engine" />
      </Section>

      <Section title="closedDates">
        <p>
          <code>closedDates(dates, reason = &apos;closed&apos;)</code> returns a rule set whose only field is <code>getDayAvailability</code>: each listed date is
          closed with the given reason tag, every other day is left alone. <code>dates</code> is any iterable of <code>CalendarDate</code> strings; a{' '}
          <code>Set</code> is used as is, any other iterable is copied into a set once. Lookups are by exact string, so pass
          normalised <code>YYYY-MM-DD</code> dates. Use it next to an adapter in the <code>rules</code> array or in <code>combineRules</code>; give the reason a
          text through <code>messages.dayReasons</code>, as the example in the next section does.
        </p>
      </Section>

      <Section title="combineRules">
        <p>
          <code>combineRules(...sets)</code> merges rule sets into one in which <em>every</em> rule must pass. It is what the calendar does with a{' '}
          <code>rules</code> array. Falsy entries (<code>null</code>, <code>undefined</code>, <code>false</code>) are skipped, so conditional rules can be written
          inline; inputs are never mutated. The sets are merged left to right with these semantics:
        </p>
        <DataTable
          caption="How combineRules merges each field"
          head={['Fields', 'Merge']}
          rows={[
            [<code key="f">minDate</code>, 'The latest one (bounds intersect).'],
            [<code key="f">maxDate</code>, 'The earliest one.'],
            [
              <>
                <code>disablePast</code>, <code>disableFuture</code>, <code>requireReachableEnd</code>, <code>singleDayFirst</code>
              </>,
              'OR: on when any set turns it on. A later false does not turn it off.',
            ],
            [<code key="f">minLength</code>, 'The largest.'],
            [
              <>
                <code>maxLength</code>, <code>maxSelections</code>
              </>,
              'The smallest.',
            ],
            [
              <>
                <code>startWeekdays</code>, <code>endWeekdays</code>, <code>availableWeekdays</code>
              </>,
              'Intersection of the sets that define the list; a list defined by one set only is kept as is.',
            ],
            [
              <>
                <code>rangeSemantics</code>, <code>allowSameDay</code>, <code>fixedLength</code>, <code>unknownDataPolicy</code>
              </>,
              'The last set that defines a value wins.',
            ],
            [
              <code key="f">getDayAvailability</code>,
              'All are called for the day and the results AND-ed: closed if any is closed, canStart/canEnd/canPassThrough false if any says false. reason and message come from the first result that restricts the day. The merged result counts as schedule only when every restricting result is marked schedule.',
            ],
            [<code key="f">validateSelection</code>, 'All run in order; the first issue wins and the validators after it are not called.'],
            [<code key="f">getDataStatus</code>, 'Both are asked; the worse status wins: error > loading > unknown > loaded.'],
          ]}
        />
        <p>
          A key whose value is <code>undefined</code> counts as “not defined here”: <code>{'{ validateSelection: props.validate }'}</code> with no prop does not
          erase a validator from an earlier set. Combining an already combined set flattens it into its original parts, which lets{' '}
          <code>relaxRules</code> relax each part on its own.
        </p>
        <Snippet files={combineFields} label="Merging fields" />
        <Snippet files={combineFunctions} label="Merging functions" />
        <Example src="rules/CombinedRules" title="Product rules + closed dates + sales window" />
        <Note>
          <p>
            Lengths are merged as numbers without their unit. Combining a set with exclusive semantics and one with inclusive semantics keeps the semantics of
            the last one, so a <code>minNights: 3</code> from <code>stayRules</code> followed by <code>dayRangeRules</code> becomes “at least 3 days”.
          </p>
          <p>
            A <code>fixedLength</code> (last one wins) is still checked against the merged minimum and maximum; if it lies outside them no range is valid.
            Weekday lists that do not overlap intersect to an empty list, which allows no start, no end or — for <code>availableWeekdays</code> — no day at all.
          </p>
        </Note>
      </Section>

      <Section title="relaxRules">
        <p>
          <code>relaxRules(rules, options)</code> is the pure version of the calendar&apos;s <code>relaxSchedule</code> prop (“custom dates”). It returns a copy
          without the schedule rules and keeps everything that describes real unavailability.
        </p>
        <DataTable
          caption="What relaxRules removes and keeps"
          head={['Option (default)', 'Removed when on', 'Always kept']}
          rows={[
            [
              <code key="o">weekdays (true)</code>,
              <>
                <code>startWeekdays</code>, <code>endWeekdays</code>, <code>availableWeekdays</code>, and every <code>getDayAvailability</code> result marked{' '}
                <code>schedule: true</code> (the whole result is ignored)
              </>,
              <>
                Bounds, past/future, other availability results (bookings, closed days), data status and <code>unknownDataPolicy</code>,{' '}
                <code>validateSelection</code>, <code>maxSelections</code>, semantics, <code>allowSameDay</code>, <code>singleDayFirst</code>,{' '}
                <code>requireReachableEnd</code>
              </>,
            ],
            [
              <code key="o">length (true)</code>,
              <>
                <code>minLength</code>, <code>maxLength</code>, <code>fixedLength</code> (so adapter <code>minNights</code>/<code>maxDays</code>/… too)
              </>,
              '',
            ],
          ]}
        />
        <p>
          Pass <code>{'{ weekdays: false }'}</code> to relax only lengths, or <code>{'{ length: false }'}</code> to relax only weekdays. On a result of{' '}
          <code>combineRules</code> each original set is relaxed separately and then combined again. That matters when one set restricts a day by schedule and
          another one restricts the same day for real: only the schedule part goes away.
        </p>
        <Snippet files={relax} label="relaxRules" />
        <Note>
          <p>
            The per-set relaxing only works on the object returned by <code>combineRules</code>. A copy of it (<code>{'{ ...combined, maxDate }'}</code>) has
            lost its parts; relaxing it uses the merged availability, which is schedule only when all of its restrictions are — a day with a schedule and a real
            restriction then stays fully restricted. Add extra fields with another <code>combineRules</code> call instead of spreading.
          </p>
        </Note>
      </Section>

      <Section title="createSelectionEngine">
        <p>
          <code>createSelectionEngine(input)</code> is the headless evaluator the calendar uses for clicks, keyboard, hover previews and disabled states. It is a
          snapshot of one set of inputs: results are memoised per day for the engine&apos;s lifetime, so create a new engine whenever the rules, selection, today
          or context change. It does not add the calendar&apos;s <code>minDate</code>/<code>disablePast</code>/… props — put them into the rules.
        </p>
        <PropsTable
          caption="SelectionEngineInput"
          rows={[
            { name: 'rules', type: 'SelectionRules', required: true, description: 'One rule set; use combineRules for several.' },
            {
              name: 'state',
              type: '{ selection: Selection; activeEndpoint: \'start\' | \'end\' }',
              required: true,
              description: (
                <>
                  The current selection and which range end comes next. Its mode decides how <code>plan()</code> behaves and whether <code>checkStart()</code>{' '}
                  runs the reachable-end search (range only).
                </>
              ),
            },
            {
              name: 'today',
              type: 'CalendarDate | null',
              required: true,
              description: (
                <>
                  Reference for <code>disablePast</code>/<code>disableFuture</code>; <code>null</code> disables both checks.
                </>
              ),
            },
            { name: 'context', type: 'TContext', description: <>Given to rule callbacks as <code>ctx.context</code>.</> },
          ]}
        />
        <PropsTable
          caption="SelectionEngine"
          rows={[
            {
              name: 'semantics',
              type: "'inclusive' | 'exclusive'",
              description: <>Resolved <code>rangeSemantics</code>.</>,
            },
            {
              name: 'allowSameDay',
              type: 'boolean',
              description: <>Resolved <code>allowSameDay</code>, with the per-semantics default applied.</>,
            },
            {
              name: 'availability(date)',
              type: '{ closed, canStart, canEnd, canPassThrough, schedule, reason?, message? }',
              description: (
                <>
                  The day&apos;s availability with defaults applied and <code>availableWeekdays</code> folded in; all flags are booleans. The type is not
                  exported by name: use <code>ReturnType&lt;SelectionEngine[&apos;availability&apos;]&gt;</code>.
                </>
              ),
            },
            {
              name: 'dataStatus(date)',
              type: 'DataStatus',
              description: <>Status of the date&apos;s month, <code>loaded</code> without <code>getDataStatus</code>.</>,
            },
            {
              name: 'checkDay(date)',
              type: 'ValidationIssue | null',
              description: <>Only the checks every selectable day shares: bounds, past/future and (with the block policy) data status.</>,
            },
            {
              name: 'checkStart(date)',
              type: 'ValidationIssue | null',
              description: (
                <>
                  Can the date be a single pick, a multiple pick or a range start: <code>checkDay</code>, closed, <code>canStart</code>, start weekday and, when
                  the state is in range mode, the reachable-end search. Does not run <code>validateSelection</code>.
                </>
              ),
            },
            {
              name: 'validateRange(start, end)',
              type: '{ valid: boolean; issue: ValidationIssue | null }',
              description: <>Full validation of one range, built-in checks then <code>validateSelection</code>.</>,
            },
            {
              name: 'validate(selection)',
              type: '{ valid: boolean; issue: ValidationIssue | null }',
              description: (
                <>
                  Validates a complete selection of any mode, parsing its values first (<code>invalid-date</code> for bad strings), so it is safe for untrusted
                  input. A range with only a start is checked as a start, without the reachable-end search. Multiple: duplicates are ignored,{' '}
                  <code>maxSelections</code> counts distinct dates. Read-only and empty selections are valid unless <code>validateSelection</code> objects.
                </>
              ),
            },
            {
              name: 'plan(date)',
              type: '{ kind, date, issue, next }',
              description: (
                <>
                  What activating the date would do: the <code>kind</code> below, the <code>issue</code> when it is <code>rejected</code>, and the{' '}
                  <code>next</code> state (selection and active endpoint) to apply otherwise. A rejected plan returns the unchanged state.
                </>
              ),
            },
          ]}
        />
        <DataTable
          caption="ActivationPlan kinds"
          head={['Kind', 'When']}
          rows={[
            [<code key="k">select</code>, 'Single mode: a new date.'],
            [<code key="k">none</code>, 'Read-only mode, or the already selected single date.'],
            [<code key="k">start</code>, 'Range: a new start (also a click before the current start).'],
            [<code key="k">complete</code>, 'Range: the end was chosen, or a fixed-length range / singleDayFirst day was created in one click.'],
            [<code key="k">clear</code>, 'Range: the lone start clicked again when same-day ranges are not allowed, or the lone singleDayFirst day.'],
            [<code key="k">toggle-on / toggle-off</code>, 'Multiple mode: add or remove a date.'],
            [<code key="k">rejected</code>, 'Any check or validateSelection failed; issue says why.'],
          ]}
        />
        <Snippet files={enginePlan} label="Engine methods" />
        <h3>Server-side validation</h3>
        <p>
          Never trust a date range sent by a browser. Build the same rules on the server (or share the module) and validate the request with an engine whose
          today is the server&apos;s date in your business time zone (<code>getToday({'{ timeZone }'})</code>).
        </p>
        <Snippet files={serverValidation} label="Validating a booking request" />
      </Section>

      <Section title="Conflicts and limitations">
        <Note>
          <p>
            <strong>Exclusive same-day + minimum.</strong> A same-day stay has 0 nights. <code>stayRules({'{ allowSameDay: true, minNights: 1 }'})</code> never
            allows day use; leave the minimum unset or 0.
          </p>
        </Note>
        <Note>
          <p>
            <strong>63 end candidates.</strong> The reachable-end search stops after 63 candidates. A start whose first valid end is further away is not rejected,
            but it is not verified in advance either; the end is validated when picked.
          </p>
        </Note>
        <Note>
          <p>
            <strong>Fixed length vs. minimum/maximum.</strong> <code>fixedLength</code> does not replace <code>minLength</code>/<code>maxLength</code>; all
            three apply. Keep the fixed length inside them.
          </p>
        </Note>
        <Note>
          <p>
            <strong>Partial restrictions and schedule.</strong> <code>schedule: true</code> applies to the whole availability result. If a day has a schedule
            restriction and a real one, return them from separate rule sets (combined with <code>combineRules</code>) so that relaxing keeps the real one.
          </p>
        </Note>
        <Note>
          <p>
            <strong>Reasons after merging.</strong> The merged availability takes <code>reason</code> and <code>message</code> from the first result that
            restricts the day. If that result has no reason, a later result&apos;s reason is not used.
          </p>
        </Note>
        <Note>
          <p>
            <strong>Partial ranges reach validateSelection.</strong> While a start is being placed your validator receives{' '}
            <code>{'{ start, end: null }'}</code>; return <code>null</code> for it unless you mean to reject the start.
          </p>
        </Note>
      </Section>
    </Page>
  );
}
