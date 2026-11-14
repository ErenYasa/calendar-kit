import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';

// Day use: a stay may start and end on the same day (0 nights).
// Do not set minNights here: a 0-night stay would fail any minimum of 1 or more.
const dayUse = stayRules({ allowSameDay: true });

export default function SameDay() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar mode="range" rules={dayUse} value={range} onChange={setRange} />
      <p>{range.end ? `${countNights(range)} nights${range.start === range.end ? ' (day use)' : ''}` : 'Click the same day twice for day use, or two different days for a stay.'}</p>
    </div>
  );
}
