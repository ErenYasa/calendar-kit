import { useState } from 'react';
import { Calendar, type DateRange } from 'calendar-kit';
import './RenderDay.css';

// renderDay: you render the element; getDayProps merges the calendar's ref,
// tabIndex, ARIA, data-* state and handlers into your props. It keeps the
// default `cal-day-button` class, so the default circle, range band, focus
// ring and disabled look still apply; your content is drawn above them.
// Your handlers run first; call event.preventDefault() to skip the calendar's own.
export default function RenderDay() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      disablePast
      value={range}
      onChange={setRange}
      renderDay={({ day, getDayProps }) => (
        <button {...getDayProps({ className: 'rd-day' })}>
          <span>{day.dayText}</span>
          {day.weekEnd && !day.past && <span className="rd-tag">wknd</span>}
        </button>
      )}
    />
  );
}
