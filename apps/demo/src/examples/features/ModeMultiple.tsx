import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';

// Up to 5 separate dates; clicking a selected date removes it.
export default function ModeMultiple() {
  const [dates, setDates] = useState<readonly CalendarDate[]>([]);
  return (
    <div>
      <Calendar mode="multiple" rules={{ maxSelections: 5 }} value={dates} onChange={setDates} />
      <p>
        {dates.length}/5 selected: {[...dates].sort().join(', ') || 'none'}
      </p>
    </div>
  );
}
