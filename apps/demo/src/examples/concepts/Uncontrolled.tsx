import { useState } from 'react';
import { Calendar, addDays, getMonth, getToday } from 'calendar-kit';

// Uncontrolled: the calendar keeps the selection. `defaultValue` and
// `defaultVisibleMonth` are read once, on mount.
export default function Uncontrolled() {
  const [today] = useState(() => getToday());
  return (
    <Calendar
      mode="single"
      defaultValue={addDays(today, 3)}
      defaultVisibleMonth={getMonth(today)}
      onChange={(date) => console.log('selected', date)}
    />
  );
}
