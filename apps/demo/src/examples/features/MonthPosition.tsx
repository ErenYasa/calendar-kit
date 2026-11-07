import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';

// The reference month (the selection's month, or today's) is shown in the
// middle: previous · reference · next.
export default function MonthPosition() {
  const [today] = useState(() => getToday());
  return <Calendar mode="single" numberOfMonths={3} monthPosition={2} defaultValue={addDays(today, 2)} />;
}
