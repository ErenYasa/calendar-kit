// Selection events in a booking form: save the draft, track the funnel,
// explain rejected clicks and keep the submit button in sync with validity.
import { useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint, type ValidationResult, countNights, stayRules } from 'calendar-kit';

// Your app's own functions.
declare function track(name: string, data?: Record<string, unknown>): void;
declare function saveDraft(dates: DateRange): void;

const rules = stayRules({ minNights: 2, disablePast: true });
const EMPTY: DateRange = { start: null, end: null };

export function StayDates() {
  const [dates, setDates] = useState<DateRange>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult>({ valid: true, issue: null });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Calendar
        mode="range"
        numberOfMonths={2}
        rules={rules}
        value={dates}
        onChange={(next, e) => {
          // Controlled: the calendar shows `next` only once you store it.
          setDates(next);
          setError(null);
          saveDraft(next);
          track('dates_changed', { reason: e.reason, source: e.source, phase: e.phase });
        }}
        onSelectionComplete={(e) => {
          // `e.value` is typed `unknown`: cast it for your mode.
          const range = e.value as DateRange;
          track('dates_completed', { nights: countNights(range), source: e.source });
        }}
        onSelectionClear={(e) => track('dates_cleared', { source: e.source })}
        onInvalidSelection={(e) => setError(e.message)}
        onValidationChange={(e) => setValidation(e.current)}
        onDateClick={(e) => {
          // Every activation, also the rejected ones (onInvalidSelection has the message).
          if (!e.accepted && e.issue) track('date_rejected', { code: e.issue.code, reason: e.issue.dayReason });
        }}
      />
      <p role="alert">{error}</p>
      <button type="submit" disabled={!dates.end || !validation.valid}>
        Continue
      </button>
    </form>
  );
}

// Controlled activeEndpoint: two "Check-in / Check-out" fields decide which
// end the next click sets. onActiveEndpointChange is a request, like onChange.
export function CheckInCheckOut() {
  const [dates, setDates] = useState<DateRange>(EMPTY);
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');

  return (
    <div>
      <div role="group" aria-label="Dates to edit">
        <button type="button" aria-pressed={endpoint === 'start'} onClick={() => setEndpoint('start')}>
          Check-in: {dates.start ?? 'add date'}
        </button>
        <button type="button" aria-pressed={endpoint === 'end'} disabled={!dates.start} onClick={() => setEndpoint('end')}>
          Check-out: {dates.end ?? 'add date'}
        </button>
        <button
          type="button"
          onClick={() => {
            // Both props are yours: reset them together (prop changes call no callbacks).
            setDates(EMPTY);
            setEndpoint('start');
          }}
        >
          Clear
        </button>
      </div>
      <Calendar
        mode="range"
        rules={rules}
        value={dates}
        onChange={setDates}
        activeEndpoint={endpoint}
        onActiveEndpointChange={(next) => setEndpoint(next)}
      />
    </div>
  );
}
