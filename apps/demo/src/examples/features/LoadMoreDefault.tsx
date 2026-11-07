import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';

// Default controls: continuous navigation adds `monthsPerLoad` months per
// press with the built-in, localised buttons ("Show earlier dates" /
// "Show more dates"), in both directions until minDate/maxDate.
export default function LoadMoreDefault() {
  const [today] = useState(() => getToday());
  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="single"
        orientation="vertical"
        navigation="continuous"
        loadDirections="both"
        numberOfMonths={1}
        minDate={addDays(today, -90)}
        maxDate={addDays(today, 365)}
        maxBlockSize={420}
      />
    </div>
  );
}
