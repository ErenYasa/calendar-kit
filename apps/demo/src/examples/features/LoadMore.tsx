import { useState } from 'react';
import { Calendar, addDays, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';

// `loadMoreLabels` only changes the content of the default buttons; their
// behaviour and accessibility stay. The list starts two months after the
// current month (computed once when the example mounts: opened in January it
// shows March, in November the next January) so both directions can load,
// down to today and up to a year ahead.
export default function LoadMore() {
  const [today] = useState(() => getToday());
  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="range"
        orientation="vertical"
        navigation="continuous"
        loadDirections="both"
        numberOfMonths={2}
        monthsPerLoad={2}
        defaultVisibleMonth={addMonthsToMonth(getMonth(today), 2)}
        minDate={today}
        maxDate={addDays(today, 365)}
        maxBlockSize={480}
        loadMoreLabels={{
          previous: <span>↑ Show earlier dates</span>,
          next: <span>Show more dates ↓</span>,
        }}
      />
    </div>
  );
}
