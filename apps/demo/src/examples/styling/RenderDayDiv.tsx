import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';
import './RenderDayDiv.css';

// A day that is not a <button>: getDayProps({ type: null }) writes no `type`
// attribute and adds role="button" (pass your own `role` to replace it).
// The calendar still gives it the roving tabIndex, arrow-key navigation, ARIA
// and data-* state, and handles Enter and Space itself (a native button
// would turn them into a click).
export default function RenderDayDiv() {
  const [date, setDate] = useState<CalendarDate | null>(null);
  return (
    <div>
      <Calendar
        mode="single"
        disablePast
        value={date}
        onChange={setDate}
        renderDay={({ getDayProps, defaultContent }) => (
          <div {...getDayProps({ type: null, className: 'rdd-day' })}>{defaultContent}</div>
        )}
      />
      <p role="status">Selected: {date ?? 'none'} (Tab to a day, then use the arrows and Enter or Space)</p>
    </div>
  );
}
