import type { ReactNode } from 'react';
import { Example, Snippet } from '../Code';
import { DataTable, Note, Page, Section } from '../ui';
import controllerCode from '../../snippets/events/controller.tsx?code';
import dataLayoutCode from '../../snippets/events/data-layout.tsx?code';
import miscCode from '../../snippets/events/misc.tsx?code';
import navigationCode from '../../snippets/events/navigation.tsx?code';
import selectionCode from '../../snippets/events/selection.tsx?code';

const FIELD_HEAD = ['Field', 'Type', 'Meaning'] as const;

/** Payload table: one row per field. Every event also has `type` and `instanceId`. */
function Payload({ caption, rows }: { caption: string; rows: readonly (readonly [string, string, ReactNode])[] }) {
  return <DataTable caption={caption} head={FIELD_HEAD} rows={rows.map(([name, type, meaning]) => [<code key="n">{name}</code>, <code key="t">{type}</code>, meaning])} />;
}

function Signature({ children }: { children: string }) {
  return (
    <p>
      Signature: <code>{children}</code>
    </p>
  );
}

const c = (s: string) => <code>{s}</code>;

export function EventsReference() {
  return (
    <Page
      title="Callbacks & events"
      lead={
        <>
          Every callback receives a typed event object. Use the specific callbacks (<code>onChange</code>, <code>onVisibleMonthChange</code>, …) for app
          logic, or <code>onEvent</code> to receive all of them as one discriminated union.
        </>
      }
    >
      <Section title="How callbacks are called">
        <ul>
          <li>
            Most callbacks receive only the event: <code>onDateClick(event)</code>. Three receive the new value first:{' '}
            <code>onChange(value, event)</code>, <code>onVisibleMonthChange(month, event)</code> and <code>onActiveEndpointChange(endpoint, event)</code>.
          </li>
          <li>
            Every event has <code>type</code> (its name in <code>onEvent</code>) and <code>instanceId</code> (the calendar&apos;s root <code>id</code>), so one
            handler can serve several calendars.
          </li>
          <li>
            <code>onEvent</code> is called after the specific callback, with the same event object. Passing only <code>onEvent</code> is enough to receive
            everything.
          </li>
          <li>
            Callbacks are never called during render. The calendar always calls the callback from the latest render, so you do not need{' '}
            <code>useCallback</code>, and a new function identity never re-emits an event.
          </li>
          <li>
            <strong>Actions</strong> (a click, a key, a controller call) emit their events synchronously, inside the browser event or the controller call.{' '}
            <strong>Derived events</strong> (<code>validationChange</code>, <code>visibleMonthsChange</code>, <code>renderedMonthsChange</code>,{' '}
            <code>loadingChange</code>, <code>layoutChange</code>, <code>tooltipOpenChange</code>, <code>ready</code> and an uncontrolled{' '}
            <code>activeEndpointChange</code>) compare the committed state with the last reported one and arrive after React has rendered.
          </li>
          <li>
            Changing a prop never calls the callback that would request that change: a new <code>value</code> does not call <code>onChange</code>, a new{' '}
            <code>visibleMonth</code> does not call <code>onVisibleMonthChange</code>, a new <code>activeEndpoint</code> does not call{' '}
            <code>onActiveEndpointChange</code>. Derived events still report what the prop changed (for example <code>validationChange</code> or{' '}
            <code>renderedMonthsChange</code>).
          </li>
          <li>
            Under React StrictMode in development, effects run twice on mount, so <code>onReady</code> can fire twice. Action events (such as{' '}
            <code>onChange</code>) are never doubled. A real remount (for example a new <code>key</code>) emits the mount events again.
          </li>
        </ul>
      </Section>

      <Section title="Event sources">
        <p>
          Events that can have several origins carry <code>source: EventSource</code>:
        </p>
        <DataTable
          caption="EventSource values"
          head={['Value', 'Produced by', 'Seen in']}
          rows={[
            [c('pointer'), 'A mouse, pen or touch activation of a day; focus that arrives by pointer.', 'dateClick, change, selectionComplete, selectionClear, invalidSelection, activeEndpointChange, dayFocusChange'],
            [
              c('keyboard'),
              <>
                Enter or Space on a day; arrow, Home/End and Page keys; focus that arrives with Tab.
              </>,
              'The same as pointer, plus visibleMonthChange (moving focus into a month that is not shown) and loadMore (trigger keyboard: moving focus past the end of a continuous list)',
            ],
            [c('navigation'), 'The default previous/next buttons, or previous()/next() from renderNavigation.', 'visibleMonthChange'],
            [
              c('programmatic'),
              'A controller method (ref or ctx.actions).',
              'change, selectionComplete, selectionClear, invalidSelection, activeEndpointChange, visibleMonthChange, dayFocusChange, loadMore (trigger keyboard: focusDate() past the end of a continuous list; ref.loadMore() itself reports load-more)',
            ],
            [
              c('load-more'),
              'Adding months in continuous mode (default button, renderLoadMore’s loadMore(), the auto sentinel, ref.loadMore()); focus moved into the grid when the load-more boundary is reached.',
              'loadMore, dayFocusChange',
            ],
            [
              c('prop'),
              <>
                The parent changed a controlled <code>value</code>, which moved the derived range endpoint.
              </>,
              'activeEndpointChange (uncontrolled endpoint only)',
            ],
            [c('resize'), <>Reserved: declared in the <code>EventSource</code> union but never emitted by the current version (the <code>resize</code> event itself has no source).</>, '—'],
            [c('scroll'), <>Reserved: declared in the <code>EventSource</code> union but never emitted by the current version (the <code>scroll</code> event itself has no source).</>, '—'],
          ]}
        />
      </Section>

      <Section title="Event order">
        <p>
          The order below is pinned by the package tests (range mode, uncontrolled value). Steps in parentheses only happen when they apply; derived events
          that did not change are not emitted at all.
        </p>
        <DataTable
          caption="Order of events per action"
          head={['Action', 'Events, in order']}
          rows={[
            ['Mount', 'validationChange (cause initial) → visibleMonthsChange → renderedMonthsChange → ready; resize once the ResizeObserver reports'],
            ['Range start click', 'dateClick → dayFocusChange → change → activeEndpointChange (start → end)'],
            ['Range end click', 'dateClick → (dayFocusChange) → change → selectionComplete → activeEndpointChange (end → start) → (validationChange)'],
            [
              <>
                End click with controlled <code>activeEndpoint</code>
              </>,
              'dateClick → (dayFocusChange) → change → activeEndpointChange (the request) → selectionComplete',
            ],
            ['Rejected click', 'dateClick → (dayFocusChange) → invalidSelection; no change'],
            ['Click in read-only mode', 'dateClick (accepted: false, kind: none) → (dayFocusChange)'],
            ['Click on the already selected single date', 'dateClick (accepted: true, kind: select) → (dayFocusChange) → selectionComplete; no change'],
            ['ref.select(valid value)', 'change (reason set) → (selectionComplete) → (selectionClear) → (activeEndpointChange) → (validationChange); nothing when the value equals the current one'],
            ['ref.select(invalid value)', 'invalidSelection; nothing else'],
            ['ref.clear()', 'change (reason clear) → selectionClear → (activeEndpointChange); nothing when the selection is already empty'],
            ['Page or jump', 'visibleMonthChange → visibleMonthsChange → renderedMonthsChange → (loadingChange); nothing when the month stays the same'],
            ['Load more', 'loadMore → (visibleMonthsChange) → renderedMonthsChange → (loadingChange)'],
          ]}
        />
        <Note>
          <code>dayFocusChange</code> appears once per newly focused day. In the tests the click arrives without focus, so it follows <code>dateClick</code>. In
          browsers that focus a button on pointer down (Chrome, Firefox, Edge) the day is focused first, so <code>dayFocusChange</code> comes before{' '}
          <code>dateClick</code>. Do not rely on the relative order of these two.
        </Note>
      </Section>

      {/* ------------------------------------------------------------ selection */}

      <Section title="onDateClick">
        <p>
          Fires for every activation of a day with a pointer or with Enter/Space, before anything else happens: accepted and rejected activations, a re-pick of
          the already selected date and clicks in read-only mode alike. It is never suppressed, even when the value does not change.
          Use it for analytics or custom feedback; use <code>onChange</code> for the value.
        </p>
        <p>
          Does not fire for controller calls (<code>ref.select()</code> and friends), for focus or hover, or for arrow keys.
        </p>
        <Signature>{'onDateClick?: (e: DateClickEvent) => void'}</Signature>
        <Payload
          caption="DateClickEvent"
          rows={[
            ['date', 'CalendarDate', 'The activated day.'],
            ['source', "'pointer' | 'keyboard'", 'Keyboard when the click came from Enter/Space (a click with detail 0) or a custom element’s key handler.'],
            ['accepted', 'boolean', <>Whether the activation was accepted: false when <code>kind</code> is rejected or none (read-only mode). Re-picking the selected single date is accepted although the value stays the same.</>],
            [
              'kind',
              'ActivationKind',
              <>
                What the activation does: <code>select</code> (single, also for the date that is already selected), <code>start</code>,{' '}
                <code>complete</code>, <code>clear</code> (range), <code>toggle-on</code>, <code>toggle-off</code> (multiple), <code>none</code> (read-only
                mode) or <code>rejected</code>.
              </>,
            ],
            ['issue', 'ValidationIssue | null', <>Why it was rejected (see <code>onInvalidSelection</code>); null otherwise.</>],
            ['day', 'DayState', 'The full state of the day at the time of the click (disabled, reason, modifiers, …).'],
          ]}
        />
      </Section>

      <Section title="onChange">
        <p>
          Fires when an action changes the selection: a click or Enter/Space on a day, or the controller methods <code>select()</code>, <code>clear()</code>{' '}
          and <code>reset()</code>. The first argument is the new value, typed for the <code>mode</code>: <code>CalendarDate | null</code>,{' '}
          <code>DateRange</code> or <code>readonly CalendarDate[]</code>.
        </p>
        <p>Does not fire:</p>
        <ul>
          <li>
            when a prop changes: <code>value</code>, <code>mode</code>, rules, or a later <code>defaultValue</code> (which is ignored);
          </li>
          <li>for rejected activations (see onInvalidSelection);</li>
          <li>
            when the value stays the same: re-picking the selected single date (it still emits <code>dateClick</code> and{' '}
            <code>selectionComplete</code>), <code>ref.select()</code> or <code>ref.reset()</code> with a value equal to the current one (nothing is
            emitted at all), <code>ref.clear()</code> when the selection is already empty;
          </li>
          <li>
            for <code>ref.select()</code> with an invalid value, or any action in <code>readonly</code> mode.
          </li>
        </ul>
        <p>
          Rejected attempts are never suppressed: <code>invalidSelection</code> (and <code>dateClick</code> for a click) is emitted every time, even for
          the same rejected value twice.
        </p>
        <p>
          <strong>Controlled</strong> (<code>value</code> given): the event is a request. The calendar keeps showing <code>value</code> until you pass the new
          one; ignore the call to refuse it. <strong>Uncontrolled</strong>: the calendar has already stored the value; the callback only informs you.
        </p>
        <Signature>{'onChange?: (value: V, e: ChangeEvent<V>) => void'}</Signature>
        <Payload
          caption="ChangeEvent"
          rows={[
            ['mode', 'SelectionMode', "'single', 'range' or 'multiple'."],
            ['value', 'V', 'The new value (the same as the first argument).'],
            ['previous', 'V', 'The value before the action, as shown by the calendar.'],
            ['source', 'EventSource', "'pointer', 'keyboard' or 'programmatic'."],
            [
              'reason',
              "ActivationKind | 'clear' | 'reset' | 'set'",
              <>
                <code>select</code>, <code>start</code>, <code>complete</code>, <code>toggle-on</code>, <code>toggle-off</code> for activations;{' '}
                <code>clear</code> for a range click on a lone start (or a lone single-day range with <code>singleDayFirst</code>) and for{' '}
                <code>ref.clear()</code>; <code>reset</code> for <code>ref.reset()</code>; <code>set</code> for <code>ref.select()</code>.
              </>,
            ],
            ['date', 'CalendarDate | null', 'The activated day; null for controller calls.'],
            ['phase', 'SelectionPhase', "Phase of the new value: 'empty', 'start-selected' (range with a start only) or 'complete'."],
            ['validation', 'ValidationResult', <>Validation of the new value against the current rules: <code>{'{ valid, issue }'}</code>.</>],
          ]}
        />
      </Section>

      <Section title="onSelectionComplete">
        <p>Fires right after a change that completes the selection, when the new value is valid:</p>
        <ul>
          <li>
            single: a date was selected (click or <code>ref.select(date)</code>), including a click on the date that is already selected;
          </li>
          <li>
            range: the end was chosen, a fixed-length range was created in one click, a single day was selected with <code>singleDayFirst</code>, or{' '}
            <code>ref.select()</code> set a range with both ends;
          </li>
          <li>
            multiple: a click reached exactly <code>rules.maxSelections</code>, or <code>ref.select()</code> set a non-empty list.
          </li>
        </ul>
        <p>
          A user who completes the same value again (re-picking the selected single date, or choosing the same range again) gets{' '}
          <code>selectionComplete</code> again, without <code>change</code> when the value is unchanged; that makes it the right place to close a
          popover. A programmatic <code>ref.select()</code> of the value already selected emits nothing. Does not fire for <code>ref.reset()</code>{' '}
          (even when the default value is complete), for prop changes, or again on later renders. With a
          controlled <code>activeEndpoint</code> it comes after the endpoint request; otherwise right after <code>change</code>. A typical use is closing a
          popover or moving focus to the next form field.
        </p>
        <Signature>{'onSelectionComplete?: (e: SelectionCompleteEvent) => void'}</Signature>
        <Payload
          caption="SelectionCompleteEvent"
          rows={[
            ['mode', 'SelectionMode', 'The selection mode.'],
            ['value', 'unknown', <>The completed value. It is not narrowed by mode: cast it (<code>e.value as DateRange</code>) or read your own state.</>],
            ['source', 'EventSource', "'pointer', 'keyboard' or 'programmatic'."],
          ]}
        />
      </Section>

      <Section title="onSelectionClear">
        <p>
          Fires after a change that empties a non-empty selection: <code>ref.clear()</code>, <code>ref.reset()</code> to an empty default,{' '}
          <code>ref.select(null)</code>, a range click on the lone start date, or toggling off the last date in multiple mode. It does not fire when you
          clear a controlled <code>value</code> yourself.
        </p>
        <Signature>{'onSelectionClear?: (e: SelectionClearEvent) => void'}</Signature>
        <Payload
          caption="SelectionClearEvent"
          rows={[
            ['previous', 'unknown', 'The value before it was cleared (not narrowed by mode).'],
            ['source', 'EventSource', "'pointer', 'keyboard' or 'programmatic'."],
          ]}
        />
      </Section>

      <Section title="onInvalidSelection">
        <p>
          Fires when an attempt to select is refused: a rejected click or Enter/Space (after <code>dateClick</code>), or <code>ref.select()</code> with a
          value that fails validation. The selection does not change and <code>onChange</code> is not called. The same localised message is announced to
          screen readers and is part of the day&apos;s accessible label.
        </p>
        <p>
          Not emitted for <code>clear()</code> and <code>reset()</code> (they are not validated), for clicks in read-only mode, or for{' '}
          <code>ref.select()</code> in read-only mode, which only returns an issue. It is never suppressed as a repeat: the same rejected attempt twice
          emits it twice.
        </p>
        <Signature>{'onInvalidSelection?: (e: InvalidSelectionEvent) => void'}</Signature>
        <Payload
          caption="InvalidSelectionEvent"
          rows={[
            [
              'date',
              'CalendarDate | null',
              <>
                The day concerned. A rejected click or Enter/Space always carries the activated day. For <code>ref.select()</code> it is{' '}
                <code>issue.date</code>, or <code>null</code> when the issue has no day (for example too many dates for <code>maxSelections</code>, an
                invalid value, or a custom validator without a date). Check for <code>null</code> before using it as a date.
              </>,
            ],
            ['issue', 'ValidationIssue', 'The reason, see below.'],
            ['message', 'string', <>The issue as text, from <code>issue.message</code> or the calendar&apos;s <code>messages</code>.</>],
            ['source', 'EventSource', "'pointer', 'keyboard' or 'programmatic'."],
          ]}
        />
        <Payload
          caption="ValidationIssue"
          rows={[
            [
              'code',
              'ReasonCode',
              <>
                <code>invalid-date</code>, <code>before-min</code>, <code>after-max</code>, <code>past</code>, <code>future</code>, <code>closed</code>,{' '}
                <code>start-not-allowed</code>, <code>end-not-allowed</code>, <code>blocked-in-range</code>, <code>weekday-start</code>,{' '}
                <code>weekday-end</code>, <code>min-length</code>, <code>max-length</code>, <code>fixed-length</code>, <code>same-day</code>,{' '}
                <code>end-before-start</code>, <code>max-selections</code>, <code>data-unknown</code>, <code>data-loading</code>, <code>data-error</code>,{' '}
                <code>custom</code>.
              </>,
            ],
            ['date', 'CalendarDate?', 'The day that caused the issue, when there is one.'],
            ['params', 'IssueParams?', <>Values for the message, e.g. <code>{'{ min: 2, actual: 1, unit: "nights" }'}</code>.</>],
            ['dayReason', 'string?', <>The <code>reason</code> your availability rule gave for that day (e.g. <code>booked</code>).</>],
            ['message', 'string?', 'A ready-made message from your availability rule or validateSelection.'],
          ]}
        />
      </Section>

      <Section title="onValidationChange">
        <p>
          Reports the validity of the <em>current</em> value. It fires once on mount (<code>cause: &apos;initial&apos;</code>, <code>previous: null</code>)
          and afterwards only when the result changes: <code>valid</code> flips, or the issue changes (code, date, day reason, message or params). A change of
          value that stays valid emits nothing.
        </p>
        <p>
          Use it when the value can become invalid without a click: a controlled <code>value</code> from your state, rules or <code>ruleContext</code> that
          change, data that loads, or a new day (<code>today</code>). The calendar never modifies the value itself; it only reports. Typical use: disable the
          submit button.
        </p>
        <Signature>{'onValidationChange?: (e: ValidationChangeEvent) => void'}</Signature>
        <Payload
          caption="ValidationChangeEvent"
          rows={[
            ['previous', 'ValidationResult | null', 'The last reported result; null on mount.'],
            ['current', 'ValidationResult', <><code>{'{ valid: boolean, issue: ValidationIssue | null }'}</code> for the current value.</>],
            ['selection', 'Selection', <>The value that was validated, as <code>{'{ mode, value }'}</code>.</>],
            [
              'cause',
              "'initial' | 'selection' | 'rules'",
              <>
                <code>initial</code>: first evaluation after mount. <code>selection</code>: the value changed since the last evaluation (by an action or by
                the <code>value</code> prop). <code>rules</code>: the value is the same but rules, rule context, data status, loading or today changed.
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="onActiveEndpointChange">
        <p>
          Range mode only. The active endpoint is the end the next click sets (<code>&apos;start&apos;</code> or <code>&apos;end&apos;</code>). How the event
          behaves depends on whether you control it:
        </p>
        <ul>
          <li>
            <strong>Uncontrolled</strong> (no <code>activeEndpoint</code> prop): reports a real transition after it was rendered, with the source of the
            action. If you control <code>value</code> and refuse a change, the endpoint does not move and nothing is emitted. If you change{' '}
            <code>value</code> yourself and the derived endpoint moves (for example you clear the range), it is reported with <code>source: &apos;prop&apos;</code>.
          </li>
          <li>
            <strong>Controlled</strong> (<code>activeEndpoint</code> given): the event is a request emitted at action time, right after <code>change</code>{' '}
            and before <code>selectionComplete</code>, and for <code>ref.setActiveEndpoint()</code>. Store it to apply it. Changing the prop yourself emits
            nothing.
          </li>
        </ul>
        <p>Not emitted on mount, in other modes, or when the endpoint stays the same.</p>
        <Signature>{'onActiveEndpointChange?: (endpoint: RangeEndpoint, e: ActiveEndpointChangeEvent) => void'}</Signature>
        <Payload
          caption="ActiveEndpointChangeEvent"
          rows={[
            ['previous', 'RangeEndpoint', 'The endpoint before.'],
            ['current', 'RangeEndpoint', 'The new endpoint (the same as the first argument).'],
            ['source', 'EventSource', "'pointer', 'keyboard', 'programmatic', or 'prop' (uncontrolled endpoint, parent changed value)."],
          ]}
        />
      </Section>

      <Section title="Example: selection events in a form">
        <p>
          The first component saves a draft on every change, tracks completion, shows why a click was rejected and disables Continue while the value is
          invalid. The second controls <code>activeEndpoint</code> from two fields.
        </p>
        <Snippet files={selectionCode} label="Selection events" />
      </Section>

      {/* ----------------------------------------------------------- navigation */}

      <Section title="onVisibleMonthChange">
        <p>
          Fires when the <strong>reference month</strong> is asked to change (the month placed at <code>monthPosition</code> in the window, which{' '}
          <code>visibleMonth</code> controls):
        </p>
        <DataTable
          caption="What emits visibleMonthChange"
          head={['Action', 'source', 'reason']}
          rows={[
            ['Default previous/next buttons, renderNavigation’s previous()/next()', 'navigation', 'previous / next'],
            ['ref.previous() / ref.next()', 'programmatic', 'previous / next'],
            ['ref.goToMonth()', 'programmatic', 'jump'],
            ['Arrow or Page keys moving focus into a month that is not shown', 'keyboard', 'keyboard'],
            ['ref.focusDate() on a day in a month that is not shown', 'programmatic', 'keyboard'],
          ]}
        />
        <p>Does not fire:</p>
        <ul>
          <li>on mount, or when you change the <code>visibleMonth</code> prop;</li>
          <li>
            for load-more or for scrolling in continuous mode: the reference month does not change (use <code>onVisibleMonthsChange</code> or{' '}
            <code>onRenderedMonthsChange</code>);
          </li>
          <li>
            when the month stays the same: a jump to the current reference month, or a request outside <code>minDate</code>/<code>maxDate</code> that is
            clamped back to the current month (for example <code>ref.next()</code> or <code>ref.previous()</code> at the last or first allowed month).
            A request clamped to a <em>different</em> month fires with <code>clamped: true</code>; <code>goToMonth()</code> returns{' '}
            <code>clamped: true</code> in both cases.
          </li>
        </ul>
        <p>
          <strong>Controlled</strong> (<code>visibleMonth</code> given): the event is a request; store <code>month</code> to move. Ignoring it keeps the
          calendar where it is. <strong>Uncontrolled</strong>: the calendar has already moved.
        </p>
        <p>
          <strong>Controlled in continuous mode.</strong> Changing the <code>visibleMonth</code> prop takes the same path as <code>goToMonth()</code>: a
          month that is already rendered is scrolled to and the loaded list is kept; a month that is not rendered rebuilds the list around it (bounded by{' '}
          <code>maxRenderedMonths</code>, reported through <code>renderedMonthsChange</code> / <code>onRenderedMonthsChange</code> so your data loading
          follows) and is scrolled to once it has rendered. The value is clamped to <code>minDate</code>/<code>maxDate</code>. The scroll uses{' '}
          <code>behavior: &apos;auto&apos;</code> (no smooth animation), keyboard focus is not moved, and the prop change emits no{' '}
          <code>visibleMonthChange</code>. When the prop only echoes a navigation the calendar started itself (you stored the month from{' '}
          <code>onVisibleMonthChange</code> after <code>goToMonth()</code> or an arrow key), it does not scroll a second time.
        </p>
        <p>
          Drive the prop from <code>onVisibleMonthChange</code>. Do not feed it from <code>onVisibleMonthsChange</code> or the scroll position: in continuous
          mode those follow the user&apos;s scrolling, so writing them back into <code>visibleMonth</code> would scroll the calendar again and make it chase
          the user.
        </p>
        <Signature>{'onVisibleMonthChange?: (month: CalendarMonth, e: VisibleMonthChangeEvent) => void'}</Signature>
        <Payload
          caption="VisibleMonthChangeEvent"
          rows={[
            ['previous', 'CalendarMonth | null', 'The reference month before; null when it was not known yet (no today on the server).'],
            ['month', 'CalendarMonth', 'The new reference month, already clamped (the same as the first argument).'],
            ['source', 'EventSource', "'navigation', 'programmatic' or 'keyboard'."],
            ['reason', "'previous' | 'next' | 'jump' | 'keyboard'", 'See the table above.'],
            ['clamped', 'boolean', 'The request was outside min/max and was moved to the nearest allowed month.'],
          ]}
        />
        <Example src="events/ControlledMonth" title="Controlled visibleMonth" />
      </Section>

      <Section title="onVisibleMonthsChange">
        <p>
          Fires when the list of months on screen changes, including once on mount (with <code>previous: []</code>). In paged mode these are the months of
          the window (fewer when <code>overflow=&quot;reduce-months&quot;</code> drops some). In continuous mode they follow scrolling: the rendered months that
          intersect the scroll area (the page, or the calendar with <code>maxBlockSize</code>), measured with an IntersectionObserver once per frame.
        </p>
        <p>It has no source: it reports the result of paging, jumping, scrolling, loading and layout changes alike.</p>
        <Signature>{'onVisibleMonthsChange?: (e: VisibleMonthsChangeEvent) => void'}</Signature>
        <Payload
          caption="VisibleMonthsChangeEvent"
          rows={[
            ['previous', 'readonly CalendarMonth[]', 'The months reported last time ([] on mount).'],
            ['months', 'readonly CalendarMonth[]', 'The months on screen now, in chronological order.'],
          ]}
        />
      </Section>

      <Section title="Example: navigation events">
        <p>Keep the month in the URL with a controlled visibleMonth, and show the visible months in your own heading.</p>
        <Snippet files={navigationCode} label="Navigation events" />
      </Section>

      {/* ------------------------------------------------------- data and layout */}

      <Section title="onRenderedMonthsChange">
        <p>
          Fires when the months in the DOM change, and once on mount with every rendered month in <code>added</code>. This is the place to start data
          requests: paging, jumps, load-more, keyboard navigation past the last month and trimming at <code>maxRenderedMonths</code> all end up here. Cancel
          requests for <code>removed</code> months.
        </p>
        <p>
          In paged mode the rendered months equal the visible ones. In continuous mode they grow with load-more, lose months from the opposite end above{' '}
          <code>maxRenderedMonths</code>, and are rebuilt around the target when you jump to a month far away (without rendering the months in between).
        </p>
        <Signature>{'onRenderedMonthsChange?: (e: RenderedMonthsChangeEvent) => void'}</Signature>
        <Payload
          caption="RenderedMonthsChangeEvent"
          rows={[
            ['previous', 'readonly CalendarMonth[]', 'The months rendered before ([] on mount).'],
            ['months', 'readonly CalendarMonth[]', 'The months rendered now, in order.'],
            ['added', 'readonly CalendarMonth[]', 'Months in months but not in previous.'],
            ['removed', 'readonly CalendarMonth[]', 'Months in previous but not in months.'],
          ]}
        />
      </Section>

      <Section title="onLoadMore">
        <p>
          Continuous mode only. Fires when months are added by the default button (or the <code>loadMore()</code> of a custom <code>renderLoadMore</code>),
          by the automatic sentinel (<code>loadMore=&quot;auto&quot;</code>), by <code>ref.loadMore()</code> or when moving focus past the first or last
          rendered month extends the list (a target at most <code>monthsPerLoad</code> months away; farther targets jump instead). It is emitted at the time of the action;{' '}
          <code>renderedMonthsChange</code> follows after the render.
        </p>
        <p>
          Does not fire in paged mode, at <code>minDate</code>/<code>maxDate</code> when nothing can be added, or for <code>goToMonth</code>. Adding months never emits <code>visibleMonthChange</code>.
        </p>
        <Signature>{'onLoadMore?: (e: LoadMoreEvent) => void'}</Signature>
        <Payload
          caption="LoadMoreEvent"
          rows={[
            ['direction', "'next' | 'previous'", 'Where the months were added.'],
            ['months', 'readonly CalendarMonth[]', <>The added months (up to <code>monthsPerLoad</code>, fewer at min/max). Months dropped from the other end are in <code>renderedMonthsChange.removed</code>.</>],
            ['source', 'EventSource', <>
              <code>load-more</code>, except for trigger <code>keyboard</code>, which carries the source of the focus move: <code>keyboard</code> (arrow or
              Page keys) or <code>programmatic</code> (<code>ref.focusDate()</code>).
            </>],
            [
              'trigger',
              "'button' | 'auto' | 'manual' | 'keyboard'",
              <>
                <code>button</code>: the default or custom control. <code>auto</code>: the sentinel scrolled into view. <code>manual</code>:{' '}
                <code>ref.loadMore()</code>. <code>keyboard</code>: focus moved past the end of the list (arrow or Page keys, or <code>ref.focusDate()</code>).
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="onLoadingChange">
        <p>
          Fires when the loading snapshot changes: the <code>loading</code> prop is turned on or off, or the <code>getDataStatus</code> result of a rendered
          month becomes or stops being <code>loading</code> or <code>error</code> (also when such a month is rendered or removed). Not emitted on mount: read
          the initial state from your own props.
        </p>
        <Signature>{'onLoadingChange?: (e: LoadingChangeEvent) => void'}</Signature>
        <Payload
          caption="LoadingChangeEvent"
          rows={[
            ['previous', 'LoadingSnapshot', 'The snapshot before.'],
            ['current', 'LoadingSnapshot', 'The snapshot now.'],
          ]}
        />
        <Payload
          caption="LoadingSnapshot"
          rows={[
            ['initial', 'boolean', <><code>loading</code> is on and the calendar has never been shown without it: days are a skeleton and cannot be selected.</>],
            ['refreshing', 'boolean', <><code>loading</code> is on after data was shown: a background refresh; view, selection and focus are kept.</>],
            ['loadingMonths', 'readonly CalendarMonth[]', <>Rendered months whose status is <code>loading</code>.</>],
            ['errorMonths', 'readonly CalendarMonth[]', <>Rendered months whose status is <code>error</code>.</>],
            ['busy', 'boolean', <><code>loading</code> is on or a month is loading (the root has <code>aria-busy</code>).</>],
          ]}
        />
      </Section>

      <Section title="onReady">
        <p>
          Fires once per mount, after the container was measured for the first time. On mount it follows the first <code>validationChange</code>,{' '}
          <code>visibleMonthsChange</code> and <code>renderedMonthsChange</code>. The ref is already attached, so the controller can be used here. It does not
          mean your data has loaded, and it never fires during server rendering.
        </p>
        <Signature>{'onReady?: (e: ReadyEvent) => void'}</Signature>
        <Payload caption="ReadyEvent" rows={[['layout', 'CalendarLayout', 'The first measured layout (see onLayoutChange).']]} />
      </Section>

      <Section title="onResize">
        <p>
          Reports the size of the calendar&apos;s root element. The first report has <code>previous: null</code>; after that it fires when the width or
          height changed by more than <code>resizeThreshold</code> pixels (default 0) since the <em>last reported</em> size. ResizeObserver callbacks are
          coalesced to one per animation frame, and an identical size is never reported twice. Without ResizeObserver it reports once on mount.
        </p>
        <p>
          <code>resizeThreshold</code> only thins out these notifications; the layout itself still adapts to every change. For structural changes (columns,
          number of months) use <code>onLayoutChange</code>.
        </p>
        <Signature>{'onResize?: (e: ResizeEvent) => void'}</Signature>
        <Payload
          caption="ResizeEvent"
          rows={[
            ['previous', '{ width: number; height: number } | null', 'The last reported size; null the first time.'],
            ['current', '{ width: number; height: number }', 'The border-box size in CSS pixels, rounded to two decimals.'],
          ]}
        />
      </Section>

      <Section title="onLayoutChange">
        <p>
          Fires when the effective layout changes in structure: orientation, navigation, requested or effective months, columns, effective month position,
          active overflow, minimum day size reached, direction or minimum month width. Width changes that keep the same structure do not fire it. The cause
          can be a resize or a prop change. Not emitted on mount (use <code>onReady</code>).
        </p>
        <Signature>{'onLayoutChange?: (e: LayoutChangeEvent) => void'}</Signature>
        <Payload
          caption="LayoutChangeEvent"
          rows={[
            ['previous', 'CalendarLayout | null', 'The layout before.'],
            ['current', 'CalendarLayout', 'The layout now.'],
          ]}
        />
        <Payload
          caption="CalendarLayout"
          rows={[
            ['orientation', "'horizontal' | 'vertical'", 'From the orientation prop.'],
            ['navigation', "'paged' | 'continuous'", 'From the navigation prop.'],
            ['requestedMonths', 'number', 'numberOfMonths.'],
            ['effectiveMonths', 'number', <>Months actually shown; lower than requested only with <code>overflow=&quot;reduce-months&quot;</code>.</>],
            ['columns', 'number', 'Month columns (1 when vertical).'],
            ['requestedMonthPosition', 'number', 'monthPosition as given.'],
            ['effectiveMonthPosition', 'number', 'The position actually used (clamped to the effective months).'],
            ['overflow', "'scroll' | 'wrap' | 'reduce-months'", 'The overflow prop.'],
            ['activeOverflow', "'none' | 'scroll' | 'wrap' | 'reduce-months'", <>What happens now: <code>none</code> when everything fits, <code>scroll</code> as the last resort.</>],
            ['atMinDaySize', 'boolean', 'Day cells are at minDaySize and cannot shrink further.'],
            ['containerWidth', 'number | null', 'The measured content width; null before measuring.'],
            ['minMonthWidth', 'number', 'The narrowest a month can be (7 × minimum day width + padding).'],
            ['direction', "'ltr' | 'rtl'", 'Text direction.'],
          ]}
        />
      </Section>

      <Section title="Example: data and layout events">
        <p>
          Load prices per month from <code>onRenderedMonthsChange</code> (cancelling requests for removed months), report errors from{' '}
          <code>onLoadingChange</code>, and adapt a footer to the real number of columns.
        </p>
        <Snippet files={dataLayoutCode} label="Data and layout events" />
      </Section>

      {/* ------------------------------------------------------- interaction */}

      <Section title="onDayFocusChange">
        <p>
          Fires when keyboard (DOM) focus lands on a different day than the last focused one: arrow and Page keys, Tab into the calendar, a click,{' '}
          <code>ref.focusDate()</code>, <code>goToMonth(…, {'{ focus: true }'})</code>, or the calendar keeping focus in the grid when a load-more control
          disappears. Leaving the calendar does not fire it (the last focused day is kept), and focusing the same day again does not either.
        </p>
        <Signature>{'onDayFocusChange?: (e: DayFocusChangeEvent) => void'}</Signature>
        <Payload
          caption="DayFocusChangeEvent"
          rows={[
            ['previous', 'CalendarDate | null', 'The previously focused day; null for the first focus.'],
            ['date', 'CalendarDate | null', 'The focused day. Typed nullable, but the current version always sends a date.'],
            ['source', 'EventSource', "'pointer', 'keyboard', 'programmatic' or 'load-more'."],
          ]}
        />
      </Section>

      <Section title="onTooltipOpenChange">
        <p>
          Fires when the open tooltip moves to another day, opens or closes, whatever the trigger: hover, keyboard focus, touch, a persistent tooltip, or the
          controlled <code>tooltip.openDate</code>. A change of trigger on the same day (hover, then focus) does not fire it. On mount it fires only when a
          tooltip is already open. Escape closes the tooltip and reports it.
        </p>
        <Signature>{'onTooltipOpenChange?: (e: TooltipOpenChangeEvent) => void'}</Signature>
        <Payload
          caption="TooltipOpenChangeEvent"
          rows={[
            ['date', 'CalendarDate | null', 'The day whose tooltip is open now; null when closed.'],
            ['previous', 'CalendarDate | null', 'The day whose tooltip was open before.'],
            ['open', 'boolean', 'Whether a tooltip is open now.'],
            ['trigger', "'hover' | 'focus' | 'touch' | 'persistent' | 'controlled' | null", 'What opened it; null when closed.'],
          ]}
        />
      </Section>

      <Section title="onOutsideClick">
        <p>
          Fires on every <code>pointerdown</code> (mouse, touch or pen, any button) on the document outside the calendar. &quot;Inside&quot; is the
          calendar&apos;s React tree: its DOM, the portalled tooltip, and anything your slots render, even through a portal. Your own wrapper around the
          calendar and the button that opened it are outside, so check them yourself (see the example below).
        </p>
        <p>
          The calendar only listens while <code>onOutsideClick</code> or <code>onEvent</code> is passed. It never closes anything itself: an inline calendar
          has no open state.
        </p>
        <Signature>{'onOutsideClick?: (e: OutsideClickEvent) => void'}</Signature>
        <Payload caption="OutsideClickEvent" rows={[['nativeEvent', 'PointerEvent', <>The document event; use <code>nativeEvent.target</code> to ignore your own elements.</>]]} />
      </Section>

      <Section title="onScroll">
        <p>
          Fires when the months area of the calendar scrolls: horizontally with <code>overflow=&quot;scroll&quot;</code>, or vertically with{' '}
          <code>maxBlockSize</code>. Calls are coalesced to one per animation frame with the latest position. Scrolling the page does not fire it; the calendar
          only listens while <code>onScroll</code> or <code>onEvent</code> is passed.
        </p>
        <Signature>{'onScroll?: (e: ScrollEvent) => void'}</Signature>
        <Payload
          caption="ScrollEvent"
          rows={[
            ['scrollLeft', 'number', 'scrollLeft of the months area.'],
            ['scrollTop', 'number', 'scrollTop of the months area.'],
          ]}
        />
      </Section>

      <Section title="onEvent">
        <p>
          Receives every event above as <code>CalendarEvent</code>, a union discriminated by <code>type</code>, after the specific callback. Use it for
          analytics, debugging or forwarding to a state machine. <code>CalendarEventType</code> is the union of the <code>type</code> strings.
        </p>
        <Signature>{'onEvent?: (e: CalendarEvent) => void'}</Signature>
        <DataTable
          caption="type → callback"
          head={['type', 'Callback']}
          rows={[
            ['ready', 'onReady'],
            ['dateClick', 'onDateClick'],
            ['change', 'onChange'],
            ['selectionComplete', 'onSelectionComplete'],
            ['selectionClear', 'onSelectionClear'],
            ['invalidSelection', 'onInvalidSelection'],
            ['validationChange', 'onValidationChange'],
            ['activeEndpointChange', 'onActiveEndpointChange'],
            ['visibleMonthChange', 'onVisibleMonthChange'],
            ['visibleMonthsChange', 'onVisibleMonthsChange'],
            ['renderedMonthsChange', 'onRenderedMonthsChange'],
            ['loadMore', 'onLoadMore'],
            ['loadingChange', 'onLoadingChange'],
            ['resize', 'onResize'],
            ['layoutChange', 'onLayoutChange'],
            ['dayFocusChange', 'onDayFocusChange'],
            ['tooltipOpenChange', 'onTooltipOpenChange'],
            ['outsideClick', 'onOutsideClick'],
            ['scroll', 'onScroll'],
          ].map(([t, cb]) => [c(t!), c(cb!)])}
        />
      </Section>

      <Section title="Example: focus, popovers and analytics">
        <p>
          A date field that closes its popover on selection or on a click outside, a details panel driven by <code>onDayFocusChange</code>, a header shadow
          from <code>onScroll</code>, and one <code>onEvent</code> handler for analytics.
        </p>
        <Snippet files={miscCode} label="Focus, popover and onEvent" />
      </Section>
    </Page>
  );
}

export function ControllerReference() {
  return (
    <Page
      title="Controller (ref)"
      lead={
        <>
          Pass a ref to drive the calendar from your own UI: navigate, select, clear, move focus and read its state. Inside slots the same object is{' '}
          <code>ctx.actions</code>.
        </>
      }
    >
      <Section title="Getting the controller">
        <p>
          Create a ref typed <code>CalendarController</code> and pass it to <code>Calendar</code>. It is <code>null</code> before mount and on the server, so
          call it from event handlers or effects with <code>?.</code>. The object keeps the same identity for the life of the calendar and always works on the
          latest state, so it is safe to store or pass down.
        </p>
        <p>
          Slots (<code>renderHeader</code>, <code>renderFooter</code>, <code>renderMonthHeader</code>, <code>renderNavigation</code>,{' '}
          <code>renderLoading</code>, <code>renderError</code>, <code>renderLoadMore</code>) receive the same controller as <code>ctx.actions</code>, next to
          the snapshot fields (<code>ctx.phase</code>, <code>ctx.visibleMonths</code>, …), so controls inside the calendar need no ref.
        </p>
        <p>
          Methods emit the same events as user actions, with <code>source: &apos;programmatic&apos;</code>. With controlled props (<code>value</code>,{' '}
          <code>visibleMonth</code>, <code>activeEndpoint</code>) a method only <em>requests</em> the change through the callback, exactly like a click.
        </p>
        <Example src="events/ControllerButtons" title="Buttons outside the calendar" />
        <Snippet files={controllerCode} label="Controller from a ref and from a slot" />
      </Section>

      <Section title="instanceId">
        <p>
          <code>readonly instanceId: string</code>. The <code>id</code> of the calendar&apos;s root element: the <code>id</code> prop, or a generated unique
          id. Every event carries the same value, so you can tell calendars apart in a shared handler, or point <code>aria-controls</code> at the calendar.
        </p>
      </Section>

      <Section title="goToMonth()">
        <p>
          <code>{'goToMonth(month: CalendarMonth | CalendarDate | string, options?: GoToMonthOptions): GoToMonthResult | null'}</code>
        </p>
        <p>Makes the given month the reference month. It never changes the selection.</p>
        <ul>
          <li>
            Accepts <code>YYYY-MM</code> or a valid <code>YYYY-MM-DD</code> (its month is used). Anything else (an invalid date, another format, a non-string)
            returns <code>null</code> and does nothing.
          </li>
          <li>
            A month before <code>minDate</code> or after <code>maxDate</code> is clamped to the nearest allowed month; the result then has{' '}
            <code>clamped: true</code>. <code>disablePast</code>/<code>disableFuture</code> do not limit navigation.
          </li>
          <li>
            Emits <code>visibleMonthChange</code> (<code>source: &apos;programmatic&apos;</code>, <code>reason: &apos;jump&apos;</code>) unless the target,
            after clamping, is already the reference month; then nothing is emitted, although the result still says <code>clamped: true</code> when the
            request was outside the limits. Derived events (<code>visibleMonthsChange</code>, <code>renderedMonthsChange</code>) follow.
          </li>
          <li>
            Paged mode: the window is rebuilt around the target according to <code>monthPosition</code>. Continuous mode: a rendered month is scrolled into
            view (again on every call, even for the same month); a month that is not rendered rebuilds the list around it without rendering the months in
            between.
          </li>
          <li>
            Controlled <code>visibleMonth</code>: the call only emits the request. The result still describes the requested month, but the reference month
            does not change until you update the prop (in continuous mode a month that is already rendered is scrolled to right away; storing the
            month in the prop afterwards does not scroll a second time).
          </li>
        </ul>
        <Payload
          caption="GoToMonthOptions"
          rows={[
            [
              'focus',
              'boolean?',
              <>
                Move keyboard focus to the first day of the target month (moved inside <code>minDate</code>/<code>maxDate</code>), as soon as it is rendered.
                The request is dropped if the user has moved focus elsewhere in the meantime. Emits <code>dayFocusChange</code> when the focused day changes.
              </>,
            ],
            [
              'behavior',
              "'auto' | 'smooth' | 'instant'",
              <>
                Continuous mode only. <code>smooth</code> animates the scroll unless the user prefers reduced motion; <code>auto</code>, <code>instant</code>{' '}
                and omitting it jump immediately.
              </>,
            ],
          ]}
        />
        <Payload
          caption="GoToMonthResult"
          rows={[
            ['month', 'CalendarMonth', 'The month actually used (after clamping).'],
            ['clamped', 'boolean', 'The target was outside min/max.'],
          ]}
        />
      </Section>

      <Section title="next() and previous()">
        <p>
          <code>next(): void</code>, <code>previous(): void</code>. Move the reference month by <code>stepMonths</code> (default 1), like the default arrows,
          but with <code>source: &apos;programmatic&apos;</code> and <code>reason: &apos;next&apos;</code> / <code>&apos;previous&apos;</code>. In continuous
          mode the calendar scrolls to the new reference month; no months are loaded and no <code>loadMore</code> is emitted.
        </p>
        <p>
          Unlike the default buttons they are never disabled: at <code>minDate</code>/<code>maxDate</code> the request is clamped back to the current
          month, so nothing moves and no <code>visibleMonthChange</code> is emitted. Use <code>canPrevious</code>/<code>canNext</code> from{' '}
          <code>renderNavigation</code> to disable your own buttons. They do nothing before the reference month is known (server render without{' '}
          <code>today</code>).
        </p>
      </Section>

      <Section title="loadMore()">
        <p>
          <code>{"loadMore(direction?: 'next' | 'previous'): void"}</code>, default <code>&apos;next&apos;</code>. Continuous mode only; in paged mode it does
          nothing. Adds <code>monthsPerLoad</code> months in that direction, stopping at <code>minDate</code>/<code>maxDate</code>, and drops months from the
          opposite end above <code>maxRenderedMonths</code> (never the month that holds focus). The scroll position is preserved when months are added
          before.
        </p>
        <p>
          It works with every <code>loadMore</code> mode and in either direction, whatever <code>loadDirections</code> says:{' '}
          <code>loadDirections</code> only decides which built-in controls and auto-load sentinels exist, not where the controller may load.{' '}
          <code>loadMore=&quot;manual&quot;</code> hides the built-in control so your own button (for example in <code>renderFooter</code>) is the only
          one. Emits <code>loadMore</code> with{' '}
          <code>trigger: &apos;manual&apos;</code>, then <code>renderedMonthsChange</code>. At the boundary nothing happens and nothing is emitted.
        </p>
      </Section>

      <Section title="clear()">
        <p>
          <code>clear(): void</code>. Empties the selection: emits <code>change</code> (<code>reason: &apos;clear&apos;</code>, <code>date: null</code>), then{' '}
          <code>selectionClear</code>; in range mode the next click sets the start again (<code>activeEndpointChange</code> if it was <code>end</code>). It
          is not validated. When the selection is already empty, or in read-only mode, it does nothing and emits nothing. With a controlled{' '}
          <code>value</code> the change is a request.
        </p>
      </Section>

      <Section title="reset()">
        <p>
          <code>reset(): void</code>. Restores <code>defaultValue</code> as it was on mount (later changes to that prop are ignored), or the empty value when
          there is none or the mode has changed since. Emits <code>change</code> with <code>reason: &apos;reset&apos;</code>, or nothing at all when the
          value already equals the default; <code>selectionClear</code> when the result is empty and the selection was not; never <code>selectionComplete</code>. The
          default value is not validated again (watch <code>onValidationChange</code> if it may have become invalid). Does nothing in read-only mode.
        </p>
        <p>
          With a controlled <code>value</code> you normally pass no <code>defaultValue</code>, so <code>reset()</code> requests an empty value.
        </p>
      </Section>

      <Section title="select()">
        <p>
          <code>{'select(value: CalendarDate | DateRange | readonly CalendarDate[] | null): ValidationResult'}</code>
        </p>
        <p>
          Proposes a whole value for the current mode (<code>null</code> means empty) and validates it with the same rules as a click: bounds, past/future,
          availability, lengths, <code>validateSelection</code>, <code>maxSelections</code> and data status.
        </p>
        <ul>
          <li>
            <strong>Valid</strong>: the value is applied with <code>reason: &apos;set&apos;</code> and <code>date: null</code>. Emits <code>change</code>,
            then <code>selectionComplete</code> when the value is complete (single date, range with both ends, non-empty list) or{' '}
            <code>selectionClear</code> when it empties the selection. The range endpoint follows the value (a lone start makes the next click set the end).
            When the value equals the current one nothing is emitted (no <code>change</code>, no <code>selectionComplete</code>).
          </li>
          <li>
            <strong>Invalid</strong>: nothing changes. Emits only <code>invalidSelection</code> (<code>source: &apos;programmatic&apos;</code>) and returns{' '}
            <code>{'{ valid: false, issue }'}</code>.
          </li>
          <li>
            While the calendar is in its <strong>initial</strong> <code>loading</code> state no data is known yet, so every non-empty value returns a{' '}
            <code>data-loading</code> issue (unless <code>unknownDataPolicy: &apos;allow&apos;</code>). A background refresh validates against the data already
            shown.
          </li>
          <li>
            In read-only mode it returns <code>{"{ valid: false, issue: { code: 'custom', message: 'read-only' } }"}</code> and emits nothing.
          </li>
          <li>It does not navigate: call <code>goToMonth()</code> to show the new value.</li>
        </ul>
        <Payload
          caption="ValidationResult"
          rows={[
            ['valid', 'boolean', 'Whether the value passed every rule.'],
            ['issue', 'ValidationIssue | null', <>The first problem found (see <a href="#/api-events">ValidationIssue</a>); null when valid.</>],
          ]}
        />
      </Section>

      <Section title="setActiveEndpoint()">
        <p>
          <code>{"setActiveEndpoint(endpoint: 'start' | 'end'): void"}</code>. Range mode only. Chooses which end the next click sets, for example from
          &quot;Check-in&quot; / &quot;Check-out&quot; fields. Setting <code>end</code> while there is no start has no effect on the next click: it still
          starts a range. Does nothing in other modes or when the endpoint is already the given one.
        </p>
        <p>
          Uncontrolled: <code>activeEndpointChange</code> (<code>source: &apos;programmatic&apos;</code>) is reported after the render. Controlled{' '}
          <code>activeEndpoint</code>: the call only emits the request; update the prop to apply it. An uncontrolled endpoint follows the value again after the next change (for example, completing a range sets it back to <code>start</code>).
        </p>
      </Section>

      <Section title="focusDate()">
        <p>
          <code>focusDate(date: CalendarDate): void</code>. Moves keyboard (DOM) focus to the day, moved inside <code>minDate</code>/<code>maxDate</code>{' '}
          first, and scrolls it into view. It focuses even when that day was already the focused one. Emits <code>dayFocusChange</code> with{' '}
          <code>source: &apos;programmatic&apos;</code> when the focused day changes.
        </p>
        <p>
          If the day is not rendered, the calendar navigates first: paged mode moves the window (<code>visibleMonthChange</code> with{' '}
          <code>source: &apos;programmatic&apos;</code> and <code>reason: &apos;keyboard&apos;</code>); continuous mode extends the list when the month is
          within <code>monthsPerLoad</code> of an end (<code>onLoadMore</code> with trigger <code>keyboard</code>, source <code>programmatic</code>),
          otherwise it rebuilds the list around it. Focus follows once the day is rendered, unless the user has
          moved focus elsewhere in the meantime. It does not select anything.
        </p>
      </Section>

      <Section title="getSnapshot()">
        <p>
          <code>getSnapshot(): CalendarSnapshot</code>. Returns a plain copy of the current state, with no side effects. The values are those of the last
          render: right after an action in the same handler (for example <code>select()</code> then <code>getSnapshot()</code>) you still see the state before
          the action. Read it later, or use the action&apos;s return value and events.
        </p>
        <Payload
          caption="CalendarSnapshot"
          rows={[
            ['selection', 'Selection', <><code>{'{ mode, value }'}</code>; check <code>mode</code> to narrow <code>value</code>.</>],
            ['activeEndpoint', "'start' | 'end'", <>The end the next click sets (always <code>start</code> outside range mode).</>],
            ['phase', 'SelectionPhase', "'empty', 'start-selected' or 'complete'."],
            ['validation', 'ValidationResult', 'Validation of the current value.'],
            ['referenceMonth', 'CalendarMonth | null', 'The month at monthPosition; null until today is known (server render without today).'],
            ['visibleMonths', 'readonly CalendarMonth[]', 'The months on screen (see onVisibleMonthsChange).'],
            ['renderedMonths', 'readonly CalendarMonth[]', 'The months in the DOM (see onRenderedMonthsChange).'],
            ['layout', 'CalendarLayout', <>The effective layout; <code>containerWidth</code> is the latest measured width.</>],
            ['focusedDate', 'CalendarDate | null', 'The last focused day, kept after focus leaves the calendar; null before any focus.'],
            ['today', 'CalendarDate | null', <>The <code>today</code> prop or the computed date; null on the server without the prop.</>],
          ]}
        />
      </Section>
    </Page>
  );
}
