// Navigation events: keep the month in the URL, show the visible months in
// your own heading and report how people browse.
import { useState } from 'react';
import { Calendar, type CalendarMonth, addMonthsToMonth, formatMonth, getMonth, getToday, parseMonth } from 'calendar-kit';

// Your app's own function.
declare function track(name: string, data?: Record<string, unknown>): void;

// Controlled visibleMonth: the month lives in the URL (?month=2026-11).
export function MonthInUrl() {
  const [thisMonth] = useState(() => getMonth(getToday()));
  const [month, setMonth] = useState<CalendarMonth>(() => parseMonth(new URLSearchParams(location.search).get('month')) ?? thisMonth);

  const show = (next: CalendarMonth) => {
    setMonth(next);
    history.replaceState(null, '', `?month=${next}`);
  };

  return (
    <div>
      <label>
        Month{' '}
        <select value={month} onChange={(e) => show(e.target.value as CalendarMonth)}>
          {Array.from({ length: 12 }, (_, i) => addMonthsToMonth(thisMonth, i)).map((m) => (
            <option key={m} value={m}>
              {formatMonth(m, 'en-US')}
            </option>
          ))}
        </select>
      </label>
      <Calendar
        mode="single"
        disablePast
        visibleMonth={month}
        // Arrows, keyboard paging and ref.goToMonth() ask for a new month here.
        // Not storing it keeps the calendar where it is.
        onVisibleMonthChange={(next, e) => {
          show(next);
          track('month_viewed', { month: next, reason: e.reason, source: e.source, clamped: e.clamped });
        }}
      />
    </div>
  );
}

// The months actually on screen, e.g. for a heading outside the calendar.
// In continuous mode they follow scrolling (IntersectionObserver).
export function VisibleMonthsHeading() {
  const [months, setMonths] = useState<readonly CalendarMonth[]>([]);
  const first = months[0];
  const last = months[months.length - 1];

  return (
    <section aria-labelledby="dates-heading">
      <h2 id="dates-heading">{first && last ? `${formatMonth(first, 'en-US')} – ${formatMonth(last, 'en-US')}` : 'Dates'}</h2>
      <Calendar
        mode="range"
        navigation="continuous"
        orientation="vertical"
        numberOfMonths={2}
        maxBlockSize={480}
        onVisibleMonthsChange={(e) => setMonths(e.months)}
      />
    </section>
  );
}
