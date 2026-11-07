import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';

// Only the next 30 days, counted from the day the example is opened.
// Navigation stops at the months that contain the limits.
export default function DateLimits() {
  const [today] = useState(() => getToday());
  return <Calendar mode="single" numberOfMonths={2} minDate={today} maxDate={addDays(today, 30)} />;
}
