import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';

// Day use: a stay may start and end on the same day (0 nights).
// An exclusive same-day range has length 0, so no minimum stay may be set.
const dayUse = stayRules({ allowSameDay: true });

export default function SameDay() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar mode="range" rules={dayUse} value={range} onChange={setRange} />
      <p>{range.end ? `${countNights(range)} nights (click the same day twice for day use)` : 'Click a day twice for day use.'}</p>
    </div>
  );
}
