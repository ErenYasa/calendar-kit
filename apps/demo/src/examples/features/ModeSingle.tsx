import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';

// Click a day to select it; clicking another day replaces it. The line below
// shows the value passed to onChange (a 'YYYY-MM-DD' string, or null).
export default function ModeSingle() {
  const [date, setDate] = useState<CalendarDate | null>(null);
  return (
    <div>
      <Calendar mode="single" value={date} onChange={setDate} />
      <p>Selected: {date ?? 'none'}</p>
    </div>
  );
}
